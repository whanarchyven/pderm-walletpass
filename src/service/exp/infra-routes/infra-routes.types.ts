export interface InfraRoutesConfig {
  infraRoutesYamlPath: string;
}
export interface InstanceRoutesConfig {
  name: string;
  ip: string;
  user: string;
  ansible: string;
  pem?: string;
  domains: DomainGroup[];
}
export interface DomainGroup {
  patterns: string[];
  deployments: InstanceDeployment[];
}
export interface InstanceDeployment {
  domain: string;
  port: number;
  service: string;
  preset: string;
}
export interface StatusErrorable {
  status: "ok" | "error";
  error?: string;
}
