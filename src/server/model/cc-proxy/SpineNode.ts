import { BaseModel as Parent, readOnly } from '@hmh/nodejs-base-server';
import { SkillGroup as Source } from '../cc/SkillGroup';

export class SpineNode extends Parent {
    // Factory method
    public static getInstance(): SpineNode {
        return new SpineNode();
    }

    @readOnly() public childrenIds: string[];
    @readOnly() public childrenNb: number;
    @readOnly() public discipline: string;
    @readOnly() public name: string;
    @readOnly() public parentId: string;
    @readOnly() public skillIds: string[];
    @readOnly() public skillNb: number;

    public constructor(snapshotId?: string, source?: Source, depth: number = 0, parentId: string = null) {
        super();
        if (source && snapshotId) {
            // @ts-ignore: access to a parent attribute which TSC does NOT see defined :( It's maybe related to the parent definition located in a NPM module and TSC...
            this.id = snapshotId + '@' + depth + '-' + source.id;
            this.parentId = parentId;
            if (source.taxonomyPathElement) {
                this.name = source.taxonomyPathElement.title;
            }
            this.childrenNb = source.directChildrenCount !== undefined ? source.directChildrenCount : source.children.length;
            this.childrenIds = [];
            this.discipline = source.discipline;
            this.skillNb = source.directSkillCount !== undefined ? source.directSkillCount : source.skills ? source.skills.length : 0;
            this.skillIds = [];
        }
    }
}
