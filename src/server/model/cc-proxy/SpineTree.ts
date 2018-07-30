import { BaseModel as Parent, readOnly } from '@hmh/nodejs-base-server';

export class SpineTree extends Parent {
    // Factory method
    public static getInstance(): SpineTree {
        return new SpineTree();
    }

    @readOnly() public name: string;
}
