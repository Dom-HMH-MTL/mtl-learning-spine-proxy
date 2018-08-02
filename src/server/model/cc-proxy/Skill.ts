import { BaseModel as Parent, readOnly } from '@hmh/nodejs-base-server';
import { Skill as Source } from '../cc/Skill.js';

export class Skill extends Parent {
    // Factory method
    public static getInstance(): Skill {
        return new Skill();
    }

    @readOnly() public description: string;
    @readOnly() public name: string;
    @readOnly() public parentId: string;
    @readOnly() public postrequesites: string[];
    @readOnly() public prerequesites: string[];
    // @readOnly() public standards: object;

    public constructor(snapshotId?: string, source?: Source, parentId?: string) {
        super();
        if (snapshotId && source) {
            this.id = snapshotId + '@' + source.id;
            this.name = source.title;
            this.description = source.description;
            this.parentId = parentId;
            if (source.postrequisites) {
                this.postrequesites = [];
                for (const dependency of source.postrequisites) {
                    this.postrequesites.push(dependency.skillId);
                }
            }
            if (source.prerequisites) {
                this.prerequesites = [];
                for (const dependency of source.prerequisites) {
                    this.prerequesites.push(dependency.skillId);
                }
            }
            // this.standards; = skill.standards;
        }
    }
}
