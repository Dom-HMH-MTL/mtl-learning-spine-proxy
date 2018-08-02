import { saveConfig } from '@hmh/nodejs-base-server';
import intern from 'intern';

import { SpineTreeResource as Resource } from '../../../server/resource/cc-proxy/SpineTreeResource';

import * as appConfig from '../../../server/config.json';

const { suite, test, beforeEach, afterEach } = intern.getInterface('tdd');
const { assert } = intern.getPlugin('chai');

suite(
    __filename.substring(__filename.indexOf('/server-unit/') + '/server-unit/'.length),
    (): void => {
        beforeEach((): void => {
            saveConfig(null); // To reset the shared configuration
            saveConfig(appConfig); // To load the default configuration
        });
        afterEach((): void => {
            saveConfig(appConfig); // To load the default configuration
        });

        test('getInstance()', (): void => {
            const resource: Resource = Resource.getInstance();
            assert.isTrue(resource instanceof Resource);
            assert.strictEqual(Resource.getInstance(), resource);
            assert.strictEqual(Resource.getInstance(), resource);
        });
        test('getServiceType()', (): void => {
            const resource: Resource = Resource.getInstance();
            // @ts-ignore: access to protected method
            assert.strictEqual(resource.getServiceType(), 'cc-proxy');
        });
    }
);
