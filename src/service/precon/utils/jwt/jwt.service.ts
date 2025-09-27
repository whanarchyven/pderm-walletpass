import { sign, verify } from "jsonwebtoken";
import { PreConfiguredService } from "@/src/service/precon/Pre";

export interface JwtServiceOptions {
  jwtKey: string;
}

export class JwtService<T> extends PreConfiguredService<JwtServiceOptions> {
  sign<T extends Object>(payload: T) {
    const key = this.config?.jwtKey;
    if (!key) throw "no jwt key";
    return sign(payload, key);
  }
  verifySafe(jwt?: string): T {
    if (!jwt) return undefined as T;
    const key = this.config?.jwtKey;
    if (!key) throw "no jwt key";
    const payload = verify(jwt, key);
    if (typeof payload !== "object") return undefined as T;
    return payload as T;
  }
  verify<T extends Record<string, unknown>>(jwt: string) {
    const key = this.config?.jwtKey;
    if (!key) throw "no jwt key";
    return verify(jwt, key);
  }
}
