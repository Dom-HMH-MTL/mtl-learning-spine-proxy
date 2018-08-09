import intern from 'intern';
import { Skill as Entity } from '../../../server/model/cc-proxy/Skill';
import { Skill as Source } from '../../../server/model/cc/Skill';
import { SkillReference } from '../../../server/model/cc/SkillReference';

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
                    assert.isUndefined(entity.description);
                    assert.isUndefined(entity.id);
                    assert.isUndefined(entity.name);
                    assert.isUndefined(entity.parentId);
                    assert.isUndefined(entity.postrequesites);
                    assert.isUndefined(entity.prerequesites);
                });
                test('constructor w/ payload fully documented', (): void => {
                    const bootstrap: Source = {
                        description: 'description',
                        id: 'id',
                        postrequisites: [{ skillId: 'post-id' } as SkillReference],
                        prerequisites: [{ skillId: 'pre-id' } as SkillReference],
                        title: 'name'
                    } as Source;
                    const entity: Entity = new Entity('snapshotId', bootstrap, '1-domain');
                    assert.strictEqual(entity.description, 'description');
                    assert.strictEqual(entity.id, 'snapshotId@id');
                    assert.strictEqual(entity.name, 'name');
                    assert.strictEqual(entity.parentId, '1-domain');
                    assert.deepEqual(entity.postrequesites, ['post-id']);
                    assert.deepEqual(entity.prerequesites, ['pre-id']);
                });
                test('constructor w/ payload and no requesite references', (): void => {
                    const bootstrap: Source = {
                        description: 'description',
                        id: 'id',
                        title: 'name'
                    } as Source;
                    const entity: Entity = new Entity('snapshotId', bootstrap, '1-domain');
                    assert.strictEqual(entity.description, 'description');
                    assert.strictEqual(entity.id, 'snapshotId@id');
                    assert.strictEqual(entity.name, 'name');
                    assert.strictEqual(entity.parentId, '1-domain');
                    assert.isUndefined(entity.postrequesites);
                    assert.isUndefined(entity.prerequesites);
                });
            }
        );
    }
);
