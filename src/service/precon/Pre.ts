import deepmerge from "deepmerge";

export class PreConfiguredService<T> {
  config: T;
  constructor(optionsFromConst: T, override?: Partial<T>) {
    this.config = deepmerge<T>(optionsFromConst, override ?? {});
  }
}
