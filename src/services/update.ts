import { spawn } from 'child_process';
import { execSync } from 'child_process';
import config from 'config';


const UPDATE_TOKEN = config.get<string>('updateToken');


/**
 * Exécute une commande en enfant et attend sa fin.
 */
async function runCommand(cmd: string, args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
        const child = spawn(cmd, args, { stdio: 'inherit' });
        child.on('close', code => code === 0
            ? resolve()
            : reject(new Error(`${cmd} ${args.join(' ')} failed with code ${code}`))
        );
    });
}

/**
 * Vérifie si la branche locale est à jour avec la branche distante.
 */
export async function isUpToDate(): Promise<boolean> {
    await runCommand('git', ['fetch', '--all']);
    const local = execSync('git rev-parse HEAD').toString().trim();
    const remote = execSync('git rev-parse @{u}').toString().trim();
    return local === remote;
}

/**
 * Effectue le pull, installe les dépendances et compile.
 */
export async function updateCode(): Promise<void> {
    await runCommand('git', ['reset', '--hard', 'origin/main']);
    await runCommand('npm', ['ci']);
    await runCommand('npm', ['run', 'build']);
}

/**
 * Redémarre l'application via PM2.
 */
export async function restartApp(): Promise<void> {
    await runCommand('pm2', ['restart', 'api']);
}

/**
 * Vérifie la validité du token d'update.
 */
export function validateToken(token: string | undefined): boolean {
    console.log(token, UPDATE_TOKEN);
    return token === UPDATE_TOKEN;
}
