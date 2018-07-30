import intern from 'intern';

import { BaseResource } from '@hmh/nodejs-base-server';
import * as resources from '../../server/resource/index';

const { suite, test } = intern.getInterface('tdd');
const { assert } = intern.getPlugin('chai');

suite(
    __filename.substring(__filename.indexOf('/server-unit/') + '/server-unit/'.length),
    (): void => {
        test('exported class list', (): void => {
            const resourceClasses: { [key: string]: typeof BaseResource } = resources as any;
            assert.strictEqual(Object.keys(resourceClasses).length, 3);
            assert.isNotNull(resourceClasses.SkillGroupResource);
            assert.isNotNull(resourceClasses.SkillResource);
            assert.isNotNull(resourceClasses.SpineNodeResource);
        });
    }
);
