import intern from 'intern';
import { SkillRootGroup as Entity } from '../../../server/model/cc/SkillRootGroup';

const { suite, test } = intern.getInterface('tdd');
const { assert } = intern.getPlugin('chai');

suite(
    __filename.substring(__filename.indexOf('/server-unit/') + '/server-unit/'.length),
    (): void => {
        test('static factory', (): void => {
            assert.deepEqual(Entity.getInstance(), new Entity());
        });

        test('constructor', (): void => {
            const bootstrap: Entity = {
                discipline: 'discipline',
                group: null
            } as Entity;
            const entity: Entity = Object.assign(new Entity(), bootstrap);
            assert.strictEqual(entity.discipline, 'discipline');
        });
    }
);
