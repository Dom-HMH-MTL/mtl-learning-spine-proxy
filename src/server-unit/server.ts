import intern from 'intern';

import { Server } from '../server/server';

import * as appConfig from '../server/config.json';
import * as appResources from '../server/resource/index'; // List of all concrete BaseResource classes implementions

const { suite, test, beforeEach, afterEach } = intern.getInterface('tdd');
const { assert } = intern.getPlugin('chai');
import { SinonStub, stub } from 'sinon';

suite(__filename.substring(__filename.indexOf('/server-unit/') + '/server-unit/'.length), () => {
    let server: Server;

    beforeEach(() => {
        server = new Server();
    });

    afterEach(() => {
        server = null;
    });

    test('getServerDirectory()', () => {
        // @ts-ignore: access to private method
        assert.strictEqual(server.getServerDirectory(), __dirname.replace('/server-unit', '/server'));
    });

    suite('getTypedResourceDefinition()', () => {
        test('with mock', () => {
            const source: { [key: string]: any } = {};
            // @ts-ignore: access to private method
            assert.strictEqual(server.getTypedResourceDefinition(source), source);
        });
        test('with default', () => {
            // @ts-ignore: access to private method
            assert.strictEqual(server.getTypedResourceDefinition(), appResources);
        });
    });

    suite('getTypedConfig()', () => {
        test('with mock', () => {
            const source: { [key: string]: any } = {
                activeMode: 'todo',
                todo: {
                    NodeServer: {
                        defaultClientContentPath: './index.html',
                        staticFolderMapping: {
                            one: '../one',
                            two: '../../two'
                        }
                    }
                }
            };
            const target: { [key: string]: any } = {
                activeMode: 'tada',
                todo: {
                    NodeServer: {
                        defaultClientContentPath: './index.html',
                        staticFolderMapping: {
                            one: '../one',
                            two: '../../two'
                        }
                    }
                }
            };
            // @ts-ignore: access to private method
            assert.deepEqual(server.getTypedConfig('tada', source), target);
        });
        test('with default', () => {
            // @ts-ignore: access to private method
            assert.deepEqual(server.getTypedConfig(), appConfig);
        });
    });

    suite('updateConfig()', () => {
        test('without port', () => {
            // @ts-ignore: access to private method
            const source: { [key: string]: any } = {
                activeMode: 'todo',
                todo: {
                    NodeServer: {
                        defaultClientContentPath: './index.html',
                        staticFolderMapping: {
                            one: '../one',
                            two: '../../two'
                        }
                    }
                }
            };
            const target: { [key: string]: any } = {
                activeMode: 'todo',
                todo: {
                    NodeServer: {
                        defaultClientContentPath: '/here/./index.html',
                        staticFolderMapping: {
                            one: '/here/../one',
                            two: '/here/../../two'
                        }
                    }
                }
            };
            // @ts-ignore: access to private method
            assert.deepEqual(server.updateConfig(source, undefined, '/here'), target);
            assert.deepEqual((appConfig as any).dev.NodeServer.port, 8686);
        });
        test('with port override', () => {
            // @ts-ignore: access to private method
            server.updateConfig(appConfig, '1234567890', '/here');
            assert.deepEqual((appConfig as any).dev.NodeServer.port, 1234567890);
        });
    });

    test('configureAndStart()', () => {
        // @ts-ignore: access to private method
        const getServerDirectoryStub: SinonStub = stub(server, 'getServerDirectory');
        getServerDirectoryStub.withArgs().returns('/here');
        // @ts-ignore: access to private method
        const getTypedResourceDefinitionStub: SinonStub = stub(server, 'getTypedResourceDefinition');
        getTypedResourceDefinitionStub.withArgs().returns({});
        const config: { [key: string]: any } = {
            activeMode: 'todo',
            todo: {
                NodeServer: {
                    cacheControlStrategy: { static: 'whatever' },
                    defaultClientContentPath: './index.html',
                    port: 9876,
                    staticContentMaxAge: 12345,
                    staticFolderMapping: { one: '../one', two: '../../two' }
                }
            }
        };
        // @ts-ignore: access to private method
        const getTypedConfigStub: SinonStub = stub(server, 'getTypedConfig');
        getTypedConfigStub.withArgs().returns(config);
        // @ts-ignore: access to private method
        const updateConfigStub: SinonStub = stub(server, 'updateConfig');
        const startStub: SinonStub = stub(server, 'start');

        server.configureAndStart();

        assert.isTrue(getServerDirectoryStub.calledOnce);
        assert.isTrue(getTypedResourceDefinitionStub.calledOnce);
        assert.isTrue(getTypedConfigStub.calledOnce);
        assert.isTrue(updateConfigStub.calledOnce);
        assert.isTrue(startStub.calledOnce);
        getServerDirectoryStub.restore();
        getTypedResourceDefinitionStub.restore();
        getTypedConfigStub.restore();
        updateConfigStub.restore();
        startStub.restore();
    });
});
