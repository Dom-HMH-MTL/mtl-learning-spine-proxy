import intern from 'intern';

import { SkillResource as Resource } from '../../../server/resource/cc-proxy/SkillResource';

const { suite, test } = intern.getInterface('tdd');
const { assert } = intern.getPlugin('chai');

suite(
    __filename.substring(__filename.indexOf('/server-unit/') + '/server-unit/'.length),
    (): void => {
        test('getInstance()', (): void => {
            const resource: Resource = Resource.getInstance();
            assert.isTrue(resource instanceof Resource);
            assert.strictEqual(Resource.getInstance(), resource);
            assert.strictEqual(Resource.getInstance(), resource);
        });
        test('getServiceType()', (): void => {
            const resource: Resource = Resource.getInstance();
            // @ts-ignore: access to protected method
            assert.strictEqual(resource.getServiceType(), 'pou');
        });
    }
);
