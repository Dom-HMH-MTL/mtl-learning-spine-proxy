import { saveConfig } from '@hmh/nodejs-base-server';
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
            // @ts-ignore: access to private method
            const getServerDirectoryStub: SinonStub = stub(server, 'getServerDirectory');
            getServerDirectoryStub.withArgs().returns('/here');
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
            assert.deepEqual(server.getTypedConfig(source), target);
            getServerDirectoryStub.restore();
        });
        test('with default', () => {
            // @ts-ignore: access to private method
            const getServerDirectoryStub: SinonStub = stub(server, 'getServerDirectory');
            getServerDirectoryStub.withArgs().returns('/here');

            // @ts-ignore: access to private method
            assert.deepEqual(server.getTypedConfig(), appConfig);

            assert.isTrue(getServerDirectoryStub.calledOnce);
            getServerDirectoryStub.restore();
        });
    });

    test('start()', () => {
        // @ts-ignore: access to private method
        const getTypedResourceDefinitionStub: SinonStub = stub(server, 'getTypedResourceDefinition');
        getTypedResourceDefinitionStub.withArgs().returns({});
        const config: { [key: string]: any } = {
            activeMode: 'todo',
            todo: {
                NodeServer: {
                    cacheControlStrategy: {
                        static: 'whatever'
                    },
                    defaultClientContentPath: './index.html',
                    port: 9876,
                    staticContentMaxAge: 12345,
                    staticFolderMapping: {
                        one: '../one',
                        two: '../../two'
                    }
                }
            }
        };
        // @ts-ignore: access to private method
        const getTypedConfigStub: SinonStub = stub(server, 'getTypedConfig');
        getTypedConfigStub.withArgs().returns(config);

        // @ts-ignore: access to private method
        const loadDefaultContentStub: SinonStub = stub(server, 'loadDefaultContent');
        // @ts-ignore: access to private method
        const addMiddlewaresStub: SinonStub = stub(server, 'addMiddlewares');
        // @ts-ignore: access to private method
        const addServerRoutesStub: SinonStub = stub(server, 'addServerRoutes');
        // @ts-ignore: access to private method
        const addClientRoutesStub: SinonStub = stub(server, 'addClientRoutes');
        // @ts-ignore: access to private attribute
        const listenStub: SinonStub = stub(server.expressApp, 'listen');
        const mockServer = {
            address: () => ({ address: '::', port: 5555 })
        };
        listenStub.withArgs(9876).returns(mockServer);

        saveConfig(null); // To leave room for the mock config
        server.start();

        assert.isTrue(getTypedResourceDefinitionStub.calledOnce);
        assert.isTrue(getTypedConfigStub.calledOnce);
        assert.isTrue(loadDefaultContentStub.calledOnceWithExactly('./index.html'));
        assert.isTrue(addMiddlewaresStub.calledOnceWithExactly(12345, { one: '../one', two: '../../two' }));
        assert.isTrue(addServerRoutesStub.calledOnceWithExactly({}));
        assert.isTrue(addClientRoutesStub.calledOnceWithExactly('todo'));
        assert.isTrue(listenStub.calledOnceWithExactly(9876));
        getTypedResourceDefinitionStub.restore();
        getTypedConfigStub.restore();
        loadDefaultContentStub.restore();
        addMiddlewaresStub.restore();
        addServerRoutesStub.restore();
        addClientRoutesStub.restore();
        listenStub.restore();
    });
});
