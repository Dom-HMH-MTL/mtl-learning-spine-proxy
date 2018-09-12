import { BaseServer as Parent } from '@hmh/nodejs-base-server';
import { BaseResource } from '@hmh/nodejs-base-server';

import * as appConfig from './config.json';
import * as appResources from './resource'; // List of all concrete BaseResource classes implementions

export class Server extends Parent {
    public configureAndStart(configMode?: string, port?: string): void {
        const resources: { [key: string]: typeof BaseResource } = this.getTypedResourceDefinition();
        const config: { [key: string]: any } = this.getTypedConfig(configMode);
        this.start(resources, this.updateConfig(config, port, this.getServerDirectory()));
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
    private getTypedConfig(configMode: string, config: { [key: string]: any } = appConfig as any): { [key: string]: any } {
        if (configMode) {
            config.activeMode = configMode;
        }
        return config;
    }

    // Simple getter to type the imported object and to allow injection at testing time
    private updateConfig(config: { [key: string]: any }, port: string, serverDirectory: string): { [key: string]: any } {
        const serverConfig: { [key: string]: any } = config[config.activeMode].NodeServer;
        // Port update
        if (port) {
            serverConfig.port = parseInt(port, 10);
        }
        // HTML of the SPA path update
        serverConfig.defaultClientContentPath = serverDirectory + '/' + serverConfig.defaultClientContentPath;
        // Static folder path update
        for (const folderMap of Object.keys(serverConfig.staticFolderMapping)) {
            serverConfig.staticFolderMapping[folderMap] = serverDirectory + '/' + serverConfig.staticFolderMapping[folderMap];
        }
        return config;
    }
}

/* istanbul ignore if */
if (process.argv[1].endsWith('/dist/server/server.js')) {
    new Server().configureAndStart(process.env.CONFIG_MODE, process.env.PORT);
}
