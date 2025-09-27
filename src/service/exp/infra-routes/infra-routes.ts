import {
  InfraRoutesConfig,
  InstanceDeployment,
  InstanceRoutesConfig,
  StatusErrorable,
} from "@/src/service/exp/infra-routes/infra-routes.types";
import { YamlExt } from "@/src/service/exp/yaml-ext";

export class InfraRoutes {
  // config: InfraRoutesConfig;
  parsed: any;

  constructor(private readonly config: InfraRoutesConfig) {
    this.config = config;
    this.parsed = YamlExt.parse(config.infraRoutesYamlPath);
  }

  findDeploymentOfService(
    serviceName: string
  ): InstanceDeployment & { instanceName: string } {
    return undefined as any;
  }

  getInstanceByName(name: string): InstanceRoutesConfig {
    return undefined as any;
  }

  getInstancesNamesList(name: string): string[] {
    return [];
  }

  lint(): StatusErrorable {
    return undefined as any;
  }

  upsertDeploymentOnInstance(
    instanceName: string,
    deployment: InstanceDeployment
  ): StatusErrorable {
    return undefined as any;
  }
}
