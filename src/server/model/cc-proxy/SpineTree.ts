import { BaseModel as Parent, readOnly } from '@hmh/nodejs-base-server';
import { Spine as Source } from '../cc/Spine.js';

export class SpineTree extends Parent {
    // Factory method
    public static getInstance(): SpineTree {
        return new SpineTree();
    }

    @readOnly() public name: string;
    public constructor(source?: Source) {
        super();
        if (source) {
            this.id = source.versionId;
            this.name = source.title;
        }
    }
}
