import intern from 'intern';

import { SkillGroupService as Service } from '../../../server/service/cc/SkillGroupService';

const { suite, test } = intern.getInterface('tdd');
const { assert } = intern.getPlugin('chai');

suite(
    __filename.substring(__filename.indexOf('/server-unit/') + '/server-unit/'.length),
    (): void => {
        test('getInstance()', (): void => {
            const service: Service = Service.getInstance();
            assert.isTrue(service instanceof Service);
            assert.strictEqual(Service.getInstance(), service);
            assert.strictEqual(Service.getInstance(), service);
        });
    }
);
