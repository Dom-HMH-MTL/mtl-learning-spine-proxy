import { html, LitElement, TemplateResult } from '@polymer/lit-element/lit-element.js';
import { repeat } from 'lit-html/lib/repeat.js';
import { until } from 'lit-html/lib/until.js';
import { Skill } from '../model/cc-proxy/Skill';
import { SpineNode } from '../model/cc-proxy/SpineNode';
import { SpineTree } from '../model/cc-proxy/SpineTree';
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
export async function loadSpineTrees(): Promise<SpineTree[]> {
    return fetch('/api/v1/cc-proxy/SpineTree', { headers: { accept: 'application/json' }, method: 'GET' })
        .then((response: Response): any => response.json())
        .then(
            (items: any[]): SpineTree[] => {
                const spines: SpineTree[] = [];
                for (const item of items) {
                    spines.push(Object.assign(new SpineTree(), item));
                }
                return spines;
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
            isSpineSelectorOpen: Boolean,
            preSelectedSkillIds: Object,
            spineTreeId: String
        };
    }

    /** The url to get the spine browser */
    private spineTreeId: string; // = 'Lx5dbX58EIxwGYCtIIv-Wi-Hk4QA';
    /** The nodes displayed at the top */
    private breadcrumbs: SpineNode[] = [];
    /** initial server request */
    private initialState: Promise<void>;
    /** List of selected skills in browser */
    private selectedSkillIds: Set<string> = new Set();
    /** List of skills to pre-check */
    private preSelectedSkillIds: Set<string> = new Set();
    private isSpineSelectorOpen: boolean = false;

    public constructor() {
        super();
        (this as LitElement).addEventListener('expand-child', async (event: CustomEvent) => {
            event.stopPropagation();
            if (this.spineTreeId) {
                const child: SpineNode = await loadSpineNode(this.spineTreeId, event.detail.childId);
                this.breadcrumbs = [...this.breadcrumbs, child];
            }
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
        this.preSelectedSkillIds.forEach((id: string) => this.selectedSkillIds.add(id));
    }
    /**
     * Gets the spine browser's selectedSkills
     *
     * @return {Set<string>} set of selected skills
     */
    public getSelectedSkills(): Set<string> {
        return this.selectedSkillIds;
    }

    protected _render({ spineTreeId, isSpineSelectorOpen }: LearningSpineBrowser): TemplateResult {
        const getLoadingMessage = (): TemplateResult => {
            return html`<span>Loading...</span>`;
        };

        const displayBreadcrumbNode = (node: SpineNode, idx: number): TemplateResult => {
            return html`<spine-node item=${node} mode=${Mode.breadcrumb} position=${idx} setSize=${this.breadcrumbs.length}></spine-node>`;
        };
        const displayBreadcrumbNodes = (): TemplateResult => {
            return html`<div>${repeat(this.breadcrumbs, displayBreadcrumbNode)}</div>`;
        };

        const displayChild = (child: SpineNode): TemplateResult => {
            return html`<li><spine-node item=${child} mode=${Mode.childrenList}></spine-node></li>`;
        };
        const fetchAndDisplayChild = (childId: string): Promise<TemplateResult> => {
            return html`${until(loadSpineNode(spineTreeId, childId).then(displayChild), getLoadingMessage())}`;
        };

        const displaySkill = (skill: Skill): TemplateResult => {
            return html`<li><spine-skill item=${skill} selected=${this.selectedSkillIds.has(skill.id)}></spine-skill></li>`;
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

        const fetchAndDisplayNodeAndChildren = async (): Promise<TemplateResult> => {
            const display = (): TemplateResult => {
                const lastNode: SpineNode = this.breadcrumbs[this.breadcrumbs.length - 1];
                return html`${displayBreadcrumbNodes()} ${displayChildren(lastNode)}`;
            };
            if (this.breadcrumbs.length !== 0) {
                return html`${display()}`;
            }
            return html`${until(
                loadSpineNode(spineTreeId)
                    .then((node) => {
                        this.breadcrumbs.push(node);
                    })
                    .then(display),
                getLoadingMessage()
            )}`;
        };

        const displaySpine = (spine: SpineTree): TemplateResult => {
            return html`<li class="mdc-list-item mdc-ripple-upgraded" role="menuitem"
            on-click="${(e: MouseEvent) => {
                e.stopPropagation();
                this.spineTreeId = spine.id;
                this.isSpineSelectorOpen = false;
                this.breadcrumbs = [];
            }}"> ${spine.name} ${spine.id}</li>
            <li class="mdc-list-divider" role="separator"></li>
            `;
        };
        return html`
        <link rel="stylesheet" href="/node_modules/@material/menu/dist/mdc.menu.css" />
        <link rel="stylesheet" href="/node_modules/@material/button/dist/mdc.button.css" />
        <link rel="stylesheet" href="/node_modules/@material/list/dist/mdc.list.css" />
        <link rel="stylesheet" href="/node_modules/@material/ripple/dist/mdc.ripple.css" />

        <style>

            ul{
                list-style :none;
            }
        </style>

        <h2>Learning Spine elements</h2>
        <button class="mdc-button" on-click="${(e: MouseEvent) => {
            e.stopPropagation();
            this.isSpineSelectorOpen = !isSpineSelectorOpen;
        }}">Choose Spine</button>

        <div class="mdc-menu-anchor">
            <div class$="mdc-menu ${isSpineSelectorOpen ? 'mdc-menu--open' : ''}">
                <ul class="mdc-menu__items mdc-list" role="menu" aria-hidden="true">
                    ${loadSpineTrees().then((spines: SpineTree[]) => repeat(spines, (spine) => displaySpine(spine)))}
                </ul>
            </div>
        </div>
        <div>${this.spineTreeId ? fetchAndDisplayNodeAndChildren() : ''}</div>
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
