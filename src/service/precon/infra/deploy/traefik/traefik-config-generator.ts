import path from "path";
import * as fs from "fs";

export class TraefikConfigGeneratorService {
  static genRouteTomlSubdomain(instancePath, hostname: string) {
    console.log(hostname);
    if (!hostname.includes(".")) throw "Bad HostName";
    if (hostname.includes("http"))
      throw "Bad HostName must me like sub.domain.com";
    const dashCaseReversed = hostname
      .toLowerCase()
      .split(".")
      .reverse()
      .join("-");
    const dotCaseReversed = hostname
      .toLowerCase()
      .split(".")
      .reverse()
      .join(".");

    const writeToPath = path.join(
      instancePath,
      `/etc/traefik/routes/${dotCaseReversed}.toml`
    );

    const toml = `[http.routers]
    [http.routers.${dashCaseReversed}]
        entryPoints = ["http"]
        rule = "Host(\`${hostname}\`) && PathPrefix(\`/\`)"
        service = "${dashCaseReversed}"
        middlewares = ["subdomain-https-redirect"]

    [http.routers.${dashCaseReversed}-secure]
        entryPoints = ["https"]
        rule = "Host(\`${hostname}\`) && PathPrefix(\`/\`)"
        service = "${dashCaseReversed}"
        tls = { certResolver = "letsencrypt" }

[http.middlewares]
    [http.middlewares.subdomain-https-redirect.redirectScheme]
        scheme = "https"
        permanent = true

[http.services]
    [http.services.${dashCaseReversed}.loadBalancer]
        [[http.services.${dashCaseReversed}.loadBalancer.servers]]
        url = "http://localhost:3000"

      `;

    fs.writeFileSync(writeToPath, toml);
    return `Written toml to ${writeToPath} with following content ${toml}`;
  }
}
