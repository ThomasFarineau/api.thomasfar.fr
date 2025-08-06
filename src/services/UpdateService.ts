import config from "config";
import { execSync, spawn } from "node:child_process";
import Service from "../interfaces/service.i";

const UPDATE_TOKEN = config.get<string>("updateToken");

export default class UpdateService implements Service {
  private readonly updateToken: string;

  constructor() {
    this.updateToken = UPDATE_TOKEN;
  }

  /**
   * Vérifie si la branche locale est à jour avec la branche distante.
   */
  async isUpToDate(): Promise<boolean> {
    await this.runCommand("git", ["fetch", "--all"]);
    const local = execSync("git rev-parse HEAD").toString().trim();
    const remote = execSync("git rev-parse @{u}").toString().trim();
    return local === remote;
  }

  /**
   * Effectue le pull, installe les dépendances et compile.
   */
  async updateCode(): Promise<void> {
    await this.runCommand("git", ["reset", "--hard", "origin/main"]);
    await this.runCommand("npm", ["ci", "--include=dev"]);
    await this.runCommand("npm", ["run", "build"]);
  }

  /**
   * Redémarre l'application via PM2.
   */
  async restartApp(): Promise<void> {
    await this.runCommand("pm2", ["restart", "api"]);
  }

  /**
   * Vérifie la validité du token d'update.
   */
  validateToken(token: string | undefined): boolean {
    return token === this.updateToken;
  }

  /**
   * Exécute une commande en enfant et attend sa fin.
   */
  private async runCommand(cmd: string, args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn(cmd, args, {
        stdio: "inherit"
      });
      child.on("close", (code) =>
        code === 0
          ? resolve()
          : reject(
            new Error(`${cmd} ${args.join(" ")} failed with code ${code}`)
          )
      );
    });
  }
}
