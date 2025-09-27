// yaml example
// instances:
//     - name: instance1
//       ip: 192.168.1.1
//       user: ubuntu
//       ansible: node-traefic-pyhon-wireguard.ansible.yaml
//       domains:
//         - patterns: ['example.com', '*.example.com']
//       deployments:
//       - domain: a.example.com
//         port: 3000
//         service: service1
//         preset: production
//       - domain: example.com
//         port: 3001
//         service: service2
//         preset: stage

import {
  InfraRoutesConfig,
  InstanceDeployment,
  InstanceRoutesConfig,
  StatusErrorable,
} from "@/src/service/exp/infra-routes/infra-routes.types";

export interface InfraRoutesDef {
  config: InfraRoutesConfig;
  parsed: any;
  // constructor(config: InfraRoutesConfig): void;
  lint(): StatusErrorable;
  getInstancesNamesList(name: string): string[];
  getInstanceByName(name: string): InstanceRoutesConfig;
  upsertDeploymentOnInstance(
    instanceName: string,
    deployment: InstanceDeployment
  ): StatusErrorable;
  findDeploymentOfService(
    serviceName: string
  ): InstanceDeployment & { instanceName: string };
}
