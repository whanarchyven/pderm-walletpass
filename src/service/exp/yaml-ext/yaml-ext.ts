import { yaml } from "./deps";
export class YamlExt {
  static parse(path: string) {
    return yaml.parse(path);
  }
}
