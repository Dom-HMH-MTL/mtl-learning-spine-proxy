import { BaseModel as Parent, readOnly } from '@hmh/nodejs-base-server';
export class Spine extends Parent {
    // Factory method
    public static getInstance(): Spine {
        return new Spine();
    }
    @readOnly() public discipline: string;
    @readOnly() public spineId: string;
    @readOnly() public title: string;
    @readOnly() public versionId: string;
}
