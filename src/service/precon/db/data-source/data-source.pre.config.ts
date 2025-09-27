import { DataSourceOptions } from "@/src/service/precon/db/data-source/data-source.service";


export const pre_db_datasource_$metaforest_mcs_pediatric_dermatology: DataSourceOptions =
  {
    type: "mongodb",
    host: "rc1b-ozt5tmyq4i4zzdxw.mdb.yandexcloud.net:27018",
    username: "odd",
    database: "odd",
    password: "YE83GeJZp5fiECA",
    authSource: "admin",
    replicaSet: "rs01",
    tls: true,
    tlsCAFile: "env:MONGO_CA_CERT_B64",
  };
