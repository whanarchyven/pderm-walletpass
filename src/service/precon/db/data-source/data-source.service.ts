import { PreConfiguredService } from "@/src/service/precon/Pre";

export interface DataSourceOptions {
  type: "mongodb";
  host: string;
  username: string;
  database: string;
  password: string;
  authSource?: string;
  replicaSet?: string;
  tls?: boolean;
  tlsCAFile?: string; // relative or absolute path
}
export class DataSourceService extends PreConfiguredService<DataSourceOptions> {
  getMongoConnectionString() {
    const queryParams = new URLSearchParams();
    if (this.config.authSource) queryParams.set("authSource", this.config.authSource);
    if (this.config.replicaSet) queryParams.set("replicaSet", this.config.replicaSet);
    if (this.config.tls !== undefined) queryParams.set("tls", String(this.config.tls));

    const queryString = queryParams.toString();
    return `mongodb://${this.config.username}:${encodeURIComponent(
      this.config.password
    )}@${this.config.host}/${this.config.database}${queryString ? `?${queryString}` : ""}`;
  }
}
