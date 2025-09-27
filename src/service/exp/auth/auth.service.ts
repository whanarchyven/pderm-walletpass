// import { DataSourceName } from "@/_refactor/services_old/database/typeorm/datasources.secret";
// // import { BaseEntity, Column } from "typeorm";
//
// import {
//   ExtendedEntityManager,
//   TypeormPreconfServiceBase,
//   TypeormService,
// } from "@/_refactor/services_old/database/typeorm/typeorm.service";
//
// import {
//   authPreconf,
//   AuthPreconfName,
// } from "@/_refactor/services_old/auth/auth.preconf";
// import { JwtService } from "@/src/service/precon/utils/jwt/jwt.service";
// import { JwtPreconfName } from "@/src/service/precon/utils/jwt/jwt.preconf";
//
// export interface AuthServiceOptions {
//   dataSourceName: DataSourceName;
//   jwtPreconfName: JwtPreconfName;
//   // credentials?:{
//   //     serviceToken?:string;
//   //     userToken?:string;
//   // }
// }
//
// export class UserAccessModel {
//   id!: string;
//
//   @Column()
//   userUris!: string[];
//   @Column()
//   passwordHash?: string;
//   @Column()
//   otc?: string;
//   @Column()
//   otcExpires?: Date;
// }
//
// type JWT = string;
// export class AuthService extends TypeormPreconfServiceBase<
//   AuthServiceOptions,
//   AuthPreconfName
// > {
//   preconfOptions = authPreconf;
//   entities = {
//     UserAccessEntity: TypeormService.createEntityWithCollectionName(
//       UserAccessModel,
//       "user-access"
//     ),
//   };
//   jwtService!: typeof JwtService.prototype;
//
//   init() {
//     this.jwtService = new JwtService().preconf(this.options.jwtPreconfName);
//     return super.init();
//   }
//   async registerUser(userUri: string, password: string): Promise<JWT> {
//     const entity = this.getRepo(this.entities.UserAccessEntity);
//     const extUser = await entity.findOneByArrayValueUni({ userUris: userUri });
//
//     if (extUser) throw "user exists";
//     const user = entity.create({
//       userUris: [userUri],
//       passwordHash: password,
//     });
//     await entity.save(user);
//
//     return this.jwtService.sign(user);
//   }
//   async loginByPass(userUri: string, password: string): Promise<JWT> {
//     const entity = this.getRepo(this.entities.UserAccessEntity);
//     const extUser = await entity.findOneByArrayValueUni({
//       userUris: userUri,
//       passwordHash: password,
//     });
//     if (!extUser) throw "user not found";
//     return this.jwtService.sign(extUser);
//   }
// }
