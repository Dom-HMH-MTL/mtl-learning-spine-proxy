import { BaseServer as Parent } from '@hmh/nodejs-base-server';
import { BaseResource } from '@hmh/nodejs-base-server';

import * as appConfig from './config.json';
import * as appResources from './resource'; // List of all concrete BaseResource classes implementions

export class Server extends Parent {
    public start(overrides?: { [key: string]: any }): void {
        const resources: { [key: string]: typeof BaseResource } = this.getTypedResourceDefinition();
        const config: { [key: string]: any } = this.getTypedConfig();
        if (overrides && overrides.port) {
            const configMode: string = config.activeMode;
            Object.assign(config[configMode].NodeServer, overrides);
        }
        super.start(resources, config);
    }

    // Simple getter to type the imported object and to allow injection at testing time
    private getTypedResourceDefinition(definitions: { [key: string]: typeof BaseResource } = appResources as any): { [key: string]: typeof BaseResource } {
        return definitions;
    }

    // Simple getter to allow injection at testing time
    private getServerDirectory(): string {
        return __dirname;
    }

    // Simple getter to type the imported object and to allow injection at testing time
    private getTypedConfig(config: { [key: string]: any } = appConfig as any): { [key: string]: any } {
        const serverDirectory: string = this.getServerDirectory();
        const serverConfig: { [key: string]: any } = config[config.activeMode].NodeServer;
        serverConfig.defaultClientContentPath = serverDirectory + '/' + serverConfig.defaultClientContentPath;
        for (const folderMap of Object.keys(serverConfig.staticFolderMapping)) {
            serverConfig.staticFolderMapping[folderMap] = serverDirectory + '/' + serverConfig.staticFolderMapping[folderMap];
        }
        return config;
    }
}

/* istanbul ignore if */
if (process.argv[1].endsWith('/dist/server/server.js')) {
    new Server().start({ port: process.env.PORT });
}
