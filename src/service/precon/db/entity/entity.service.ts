import { Collection, Db, Document, MongoClient } from "mongodb";
import path from "path";
import fs from "fs";
import {
  DataSourceOptions,
  DataSourceService,
} from "@/src/service/precon/db/data-source/data-source.service";

export interface EntityDbPreConfiguredServiceOptions {
  collectionName: string;
  dataSource: DataSourceOptions;
}

export class EntityDbPreConfiguredService<T extends Document> {
  private static clients: Record<string, MongoClient> = {};
  private db?: Db;
  private collectionProxy?: Collection<T>;
  private collection?: Collection<T>;

  constructor(private options: EntityDbPreConfiguredServiceOptions) {
    this.collectionProxy = new Proxy({} as Collection<T>, {
      get: (target, prop: string, receiver) => {
        if (prop === "then") {
          return undefined;
        }
        return async (...args: any[]) => {
          await this.ensureConnected();
          if (typeof (this.collection as any)[prop] === "function") {
            return (this.collection as any)[prop](...args);
          }
          return (this.collection as any)[prop];
        };
      },
    });
  }

  private async ensureConnected(): Promise<void> {
    if (!EntityDbPreConfiguredService.clients[this.options.dataSource.host]) {
      // console.log('creating new cli')
      const mongoConnectionString = new DataSourceService(
        this.options.dataSource
      ).getMongoConnectionString();
      let resolvedTlsCAFile: string | undefined;
      if (this.options.dataSource.tlsCAFile) {
        const caSpec = this.options.dataSource.tlsCAFile;
        resolvedTlsCAFile = path.resolve(process.cwd(), caSpec);
      }
      const client = new MongoClient(mongoConnectionString, {
        tls: this.options.dataSource.tls,
        tlsCAFile: resolvedTlsCAFile,
      });
      try {
        await client.connect();
        await client
          .db(this.options.dataSource.database)
          .command({ ping: 1 });
        console.log(
          "[Mongo] Connected and ping ok",
          this.options.dataSource.host,
          this.options.dataSource.database
        );
        EntityDbPreConfiguredService.clients[this.options.dataSource.host] =
          client;
      } catch (error) {
        console.error("[Mongo] Connection error", error);
        throw error;
      }
    }

    const client =
      EntityDbPreConfiguredService.clients[this.options.dataSource.host];

    this.db = client.db(this.options.dataSource.database);
    if (!this.collection) {
      this.collection = this.db.collection<T>(this.options.collectionName);
      console.log(
        "[Mongo] Using collection",
        this.options.collectionName,
        "in db",
        this.options.dataSource.database
      );
    }
  }

  public asMongoCollection(): Collection<T> {
    return this.collectionProxy as Collection<T>;
  }
}
