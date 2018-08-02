import intern from 'intern';
import { SpineTree as Entity } from '../../../server/model/cc-proxy/SpineTree';
import { Spine as Source } from '../../../server/model/cc/Spine';

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
                    assert.isUndefined(entity.id);
                    assert.isUndefined(entity.name);
                    assert.isUndefined(entity.snapshotId);
                });
                test('constructor w/ payload fully documented', (): void => {
                    const bootstrap: Source = {
                        spineId: 'id',
                        title: 'name',
                        versionId: 'versionId'
                    } as Source;
                    const entity: Entity = new Entity(bootstrap);
                    assert.strictEqual(entity.snapshotId, 'versionId');
                    assert.strictEqual(entity.id, 'id');
                    assert.strictEqual(entity.name, 'name');
                });
            }
        );
    }
);
