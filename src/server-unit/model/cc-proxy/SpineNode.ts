import intern from 'intern';
import { SpineNode as Entity } from '../../../server/model/cc-proxy/SpineNode';
import { Skill } from '../../../server/model/cc/Skill';
import { SkillGroup } from '../../../server/model/cc/SkillGroup';

const { suite, test } = intern.getInterface('tdd');
const { assert } = intern.getPlugin('chai');

suite(
    __filename.substring(__filename.indexOf('/server-unit/') + '/server-unit/'.length),
    (): void => {
        test('static factory', (): void => {
            assert.deepEqual(Entity.getInstance(), new Entity());
        });

        suite(
            'constructor',
            (): void => {
                test('default constructor', (): void => {
                    const entity: Entity = new Entity();
                    assert.isUndefined(entity.childrenIds);
                    assert.isUndefined(entity.childrenNb);
                    assert.isUndefined(entity.discipline);
                    assert.isUndefined(entity.id);
                    assert.isUndefined(entity.name);
                    assert.isUndefined(entity.parentId);
                    assert.isUndefined(entity.skillIds);
                    assert.isUndefined(entity.skillNb);
                });
                test('constructor w/ payload fully documented', (): void => {
                    const bootstrap: SkillGroup = {
                        children: [{} as SkillGroup],
                        directChildrenCount: 2,
                        directSkillCount: 2,
                        discipline: 'discipline',
                        id: 'id',
                        skills: [{} as Skill],
                        taxonomyPathElement: { title: 'title' }
                    } as SkillGroup;
                    const entity: Entity = new Entity('snapshotId', bootstrap, 2, '1-domain');
                    assert.deepEqual(entity.childrenIds, []);
                    assert.strictEqual(entity.childrenNb, 2);
                    assert.strictEqual(entity.discipline, 'discipline');
                    assert.strictEqual(entity.id, 'snapshotId@2-id');
                    assert.strictEqual(entity.name, 'title');
                    assert.strictEqual(entity.parentId, '1-domain');
                    assert.deepEqual(entity.skillIds, []);
                    assert.strictEqual(entity.skillNb, 2);
                });
                test('constructor w/ payload and no array length', (): void => {
                    const bootstrap: SkillGroup = {
                        children: [{} as SkillGroup],
                        discipline: 'discipline',
                        id: 'id',
                        skills: [{} as Skill],
                        taxonomyPathElement: { title: 'title' }
                    } as SkillGroup;
                    const entity: Entity = new Entity('snapshotId', bootstrap, 2, '1-domain');
                    assert.deepEqual(entity.childrenIds, []);
                    assert.strictEqual(entity.childrenNb, 1);
                    assert.strictEqual(entity.discipline, 'discipline');
                    assert.strictEqual(entity.id, 'snapshotId@2-id');
                    assert.strictEqual(entity.name, 'title');
                    assert.strictEqual(entity.parentId, '1-domain');
                    assert.deepEqual(entity.skillIds, []);
                    assert.strictEqual(entity.skillNb, 1);
                });
                test('constructor w/ payload and no skills array, no title', (): void => {
                    const bootstrap: SkillGroup = { children: [{} as SkillGroup], discipline: 'discipline', id: 'id' } as SkillGroup;
                    const entity: Entity = new Entity('snapshotId', bootstrap, 2, '1-domain');
                    assert.deepEqual(entity.childrenIds, []);
                    assert.strictEqual(entity.childrenNb, 1);
                    assert.strictEqual(entity.discipline, 'discipline');
                    assert.strictEqual(entity.id, 'snapshotId@2-id');
                    assert.isUndefined(entity.name);
                    assert.strictEqual(entity.parentId, '1-domain');
                    assert.deepEqual(entity.skillIds, []);
                    assert.strictEqual(entity.skillNb, 0);
                });
            }
        );
    }
);
