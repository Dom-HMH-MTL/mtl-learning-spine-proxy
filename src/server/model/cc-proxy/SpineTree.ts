import { BaseModel as Parent, readOnly } from '@hmh/nodejs-base-server';
import { Spine as Source } from '../cc/Spine.js';

export class SpineTree extends Parent {
    // Factory method
    public static getInstance(): SpineTree {
        return new SpineTree();
    }

    @readOnly() public name: string;
    @readOnly() public snapshotId: string;
    public constructor(source?: Source) {
        super();
        if (source) {
            this.id = source.spineId;
            this.name = source.title;
            this.snapshotId = source.versionId;
        }
    }
}
