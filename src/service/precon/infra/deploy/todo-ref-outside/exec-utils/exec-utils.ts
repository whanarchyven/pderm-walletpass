import { spawn } from "node:child_process";
import path from "path";

// const execPromise = promisify(exec);

interface RsyncProps {
  localSrc: string;
  remoteDest: string;
  remoteIp: string;
  remoteUser: string;
  pathToPem?: string;
  excludePatterns?: string[];
  includePatterns?: string[];
}
interface SshProps {
  remoteIp: string;
  remoteUser: string;
  pathToPem?: string;
  remoteDest: string;
  delete?: boolean;
}
interface ExecReturn {
  stdout: string;
  stderr: string;
}

export class ExecUtils {
  async rsyncProjectToRemote(props: RsyncProps) {
    console.log(this.getRsyncCommand(props));
    await execPromise(this.getRsyncCommand(props), { log: true });
    await this.sshExec(
      `rm -rf ${path.join(props.remoteDest, "/id_rsa")}`,
      props
    );
  }

  getPersistDirCommand(dir: string) {
    return `[[ -d ${dir} ]] || sudo mkdir -p ${dir}`;
  }

  sshExec(command: string, props: SshProps) {
    const args = ["ssh"];
    const pem = props.pathToPem ? `-i ${props.pathToPem}` : "";
    args.push(pem);
    args.push(`${props.remoteUser}@${props.remoteIp}`);
    args.push(`"${command}"`);
    const remoteCommand = args.join(" ");
    return execPromise(remoteCommand, { log: true });
  }
  getRsyncCommand(props: RsyncProps) {
    const args = ["rsync", "-avzhe"];
    //--delete
    // if (props.delete) args.push("--delete");

    const pem = props.pathToPem ? `-i ${props.pathToPem}` : "";
    args.push(`ssh ${pem}`);

    args.push(`${props.localSrc}`);
    args.push(`${props.remoteUser}@${props.remoteIp}:${props.remoteDest}`);

    if (props.includePatterns) {
      props.includePatterns.forEach((pattern) => {
        args.push(`--include='${pattern}'`);
      });
    }

    if (props.excludePatterns) {
      props.excludePatterns.forEach((pattern) => {
        args.push(`--exclude='${pattern}'`);
      });
    }

    return args.join(" ");
  }
  static async execInDir(dir: string, command: string) {
    return execPromise(`cd ${dir} && ` + command, { log: true });
  }
}

function execPromise(command, options = { log: false }) {
  console.log(`Executing command: ${command}`); // Добавьте это для вывода команды
  return new Promise((resolve, reject) => {
    const child = spawn(command, {
      stdio: options.log ? "inherit" : "pipe",
      shell: true,
    });

    if (!child) return reject("No process");

    let output = "";
    let errorOutput = "";

    child.stdout?.on("data", (data) => {
      output += data;
      if (options.log) console.log(data);
    });

    child.stderr?.on("data", (data) => {
      errorOutput += data;
      if (options.log) console.error(data);
    });

    child.on("error", (error) => {
      if (options.log) console.error(error);
      reject(error);
    });

    child.on("close", (code, data) => {
      if (code === 0) {
        resolve(output);
      } else {
        const error = new Error(
          `Command ( ${command} ) failed with code ${code} ${errorOutput}`
        );
        if (options.log) console.error(errorOutput);
        // error.code = code;
        // error.stderr = errorOutput;
        reject(error);
      }
    });
  });
}
