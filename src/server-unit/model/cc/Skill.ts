import intern from 'intern';
import { Skill as Entity } from '../../../server/model/cc/Skill';
import { SkillReference } from '../../../server/model/cc/SkillReference';

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
                description: 'description',
                id: 'id',
                postrequisites: [
                    {
                        skillId: 'post-id',
                        strength: 229
                    } as SkillReference
                ],
                prerequisites: [
                    {
                        skillId: 'pre-id',
                        strength: 118
                    } as SkillReference
                ],
                title: 'name'
            } as Entity;
            const entity: Entity = Object.assign(new Entity(), bootstrap);
            assert.strictEqual(entity.id, 'id');
            assert.strictEqual(entity.postrequisites[0].skillId, 'post-id');
            assert.strictEqual(entity.prerequisites[0].skillId, 'pre-id');
        });
    }
);
