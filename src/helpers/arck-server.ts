import {makeLogger} from "@helpers/logger";

export class ArckServer {

    logger;

    constructor(private port: number, private host: string) {
        this.logger = makeLogger('SERVER');

        this.logger.info(`ArckServer initialized on ${host}:${port}`);
    }


    static create(port: number, host: string = 'localhost'): ArckServer {
        return new ArckServer(port, host);
    }

    addController(controller: any): ArckServer {
        this.logger.info(`Controller ${controller.name} added.`);
        return this;
    }

    addControllers(controllers: any[]): ArckServer {
        controllers.forEach(controller => {
            this.addController(controller);
        });
        return this;
    }

    listen(): void {
        this.logger.info(`Server running on https://${this.host}:${this.port}`);
    }

}