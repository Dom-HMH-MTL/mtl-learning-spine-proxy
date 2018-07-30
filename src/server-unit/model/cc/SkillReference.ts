import intern from 'intern';
import { SkillReference as Entity } from '../../../server/model/cc/SkillReference';

const { suite, test } = intern.getInterface('tdd');
const { assert } = intern.getPlugin('chai');

suite(
    __filename.substring(__filename.indexOf('/server-unit/') + '/server-unit/'.length),
    (): void => {
        test('constructor', (): void => {
            const bootstrap: Entity = {
                skillId: 'id',
                strength: 118
            } as Entity;
            const entity: Entity = Object.assign(new Entity(), bootstrap);
            assert.strictEqual(entity.skillId, 'id');
            assert.strictEqual(entity.strength, 118);
        });
    }
);
