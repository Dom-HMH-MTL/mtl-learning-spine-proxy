import { html, LitElement } from '@polymer/lit-element/lit-element.js';
import { repeat } from 'lit-html/lib/repeat.js';
import { until } from 'lit-html/lib/until.js';
import { TemplateResult } from 'lit-html/lit-html';
import { Skill } from '../model/cc-proxy/Skill';
import { SpineNode } from '../model/cc-proxy/SpineNode';
import { Mode } from './spine-node';
import './spine-skill';

export async function loadSpineNode(spineTreeId: string, id: string = 'root'): Promise<SpineNode> {
    return fetch('/api/v1/cc-proxy/SpineNode/' + id + '?spineTreeId=' + spineTreeId, { headers: { accept: 'application/json' }, method: 'GET' })
        .then((response: Response): any => response.json())
        .then(
            (item: any): SpineNode => {
                return Object.assign(new SpineNode(), item);
            }
        );
}

export async function loadSkill(id: string = 'root'): Promise<Skill> {
    return fetch('/api/v1/cc-proxy/Skill/' + id, { headers: { accept: 'application/json' }, method: 'GET' })
        .then((response: Response): any => response.json())
        .then(
            (item: any): Skill => {
                return Object.assign(new Skill(), item);
            }
        );
}

/**
 * `<learning-spine-browser>`
 * ## standalone spine browser
 * In typical use, use `<learning-spine-browser>`
 * @param hostUrl
 * @demo ./components/demos/index.html
 *
 */
export class LearningSpineBrowser extends LitElement {
    static get properties(): { [key: string]: string | object } {
        return {
            breadcrumbs: Array,
            preSelectedSkillIds: Object,
            spineTreeId: String
        };
    }

    /** The url to get the spine browser */
    private spineTreeId: string;
    /** The nodes displayed at the top */
    private breadcrumbs: SpineNode[] = [];
    /** initial server request */
    private initialState: Promise<void>;
    /** List of selected skills in browser */
    private selectedSkillIds: Set<string> = new Set();
    /** List of skills to pre-check */
    private preSelectedSkillIds: Set<string> = new Set();

    public constructor(url: string) {
        super();
        this.spineTreeId = url;
        (this as LitElement).addEventListener('expand-child', async (event: CustomEvent) => {
            event.stopPropagation();
            const child: SpineNode = await loadSpineNode(this.spineTreeId, event.detail.childId);
            this.breadcrumbs = [...this.breadcrumbs, child];
        });

        (this as LitElement).addEventListener('collapse-node', async (event: CustomEvent) => {
            event.stopPropagation();
            let childIdx: number = -1;
            for (const node of this.breadcrumbs) {
                childIdx += 1;
                if (node.id === event.detail.childId) {
                    break;
                }
            }
            this.breadcrumbs = this.breadcrumbs.slice(0, childIdx + 1);
        });
        (this as LitElement).addEventListener('selected', async (event: CustomEvent) => {
            event.stopPropagation();
            this.onSelected(event);
        });
    }
    /**
     * Gets the spine browser's selectedSkills
     *
     * @return {Set<string>} set of selected skills
     */
    public getSelectedSkills(): Set<string> {
        return this.selectedSkillIds;
    }
    protected _createRoot(): any {
        this.initialState = loadSpineNode(this.spineTreeId).then(
            (item: SpineNode): void => {
                this.breadcrumbs.push(item);
            }
        );
        this.preSelectedSkillIds.forEach((id: string) => this.selectedSkillIds.add(id));

        return this;
    }

    protected _render({ spineTreeId }: LearningSpineBrowser): TemplateResult {
        const getLoadingMessage = (): TemplateResult => {
            return html`<span>Loading...</span>`;
        };

        const displayBreadcrumbNode = (node: SpineNode, idx: number): TemplateResult => {
            return html`<spine-node item=${node} mode=${Mode.breadcrumb} position=${idx} setSize=${this.breadcrumbs.length}></spine-node>`;
        };
        const displayBreadcrumbNodes = (breadcrumbs: SpineNode[]): TemplateResult => {
            return html`<div>${repeat(this.breadcrumbs, displayBreadcrumbNode)}</div>`;
        };

        const displayChild = (child: SpineNode): TemplateResult => {
            return html`<li><spine-node item=${child} mode=${Mode.childrenList}></spine-node></li>`;
        };
        const fetchAndDisplayChild = (childId: string): Promise<TemplateResult> => {
            return html`${until(loadSpineNode(spineTreeId, childId).then(displayChild), getLoadingMessage())}`;
        };

        const displaySkill = (skill: Skill): TemplateResult => {
            return html`<li><spine-skill item=${skill} selected=${this.preSelectedSkillIds.has(skill.id)}></spine-skill></li>`;
        };
        const fetchAndDisplaySkill = (skillId: string): Promise<TemplateResult> => {
            return html`${until(loadSkill(skillId).then(displaySkill), getLoadingMessage())}`;
        };

        const displayChildren = (item: SpineNode): TemplateResult => {
            if (0 < item.childrenNb) {
                return html`<ul>${repeat(item.childrenIds, fetchAndDisplayChild)}</ul>`;
            }
            if (0 < item.skillNb) {
                return html`<ul>${repeat(item.skillIds, fetchAndDisplaySkill)}</ul>`;
            }
            return html`No child nor skill attached to this node`;
        };

        const fetchAndDisplayNodeAndChildren = async (breadcrumbs: SpineNode[]): Promise<TemplateResult> => {
            if (breadcrumbs.length === 0) {
                this.breadcrumbs.push(await loadSpineNode(spineTreeId));
            }
            const lastNode: SpineNode = breadcrumbs[breadcrumbs.length - 1];
            return html`${displayBreadcrumbNodes(breadcrumbs)}${displayChildren(lastNode)}`;
        };

        return html`
        <style>
        ul {
                list-style: none;
        }
        </style>

        <h2>Learning Spine elements</h2>
        <div>${until(this.initialState.then((): Promise<TemplateResult> => fetchAndDisplayNodeAndChildren(this.breadcrumbs)), getLoadingMessage())}</div>
        `;
    }

    /**
     * Fired when a skill is selected.
     *
     * @param {CustomEvent} event
     */
    private onSelected(event: CustomEvent): void {
        event.stopPropagation();
        event.detail.selected ? this.selectedSkillIds.add(event.detail.item.id) : this.selectedSkillIds.delete(event.detail.item.id);
    }
}

customElements.define('learning-spine-browser', LearningSpineBrowser);
