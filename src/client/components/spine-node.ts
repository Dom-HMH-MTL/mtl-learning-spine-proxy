import { html, LitElement, property } from '@polymer/lit-element/lit-element.js';
import { TemplateResult } from 'lit-html/lit-html';
import { SpineNode as Model } from '../model/cc-proxy/SpineNode';

export enum Mode {
    breadcrumb,
    childrenList
}

export class SpineNode extends LitElement {
    /** Reference spine node model */
    @property({ type: Object })
    public item: Model;
    @property({ type: Object })
    public mode: Mode;
    @property({ type: Object })
    public position: Mode;
    @property({ type: Object })
    public setSize: Mode;

    constructor(item: Model, mode: Mode, position: number = 0, setSize: number = 0) {
        super();
        this.item = item;
        this.mode = mode;
        this.position = position;
        this.setSize = setSize;
    }

    protected shouldUpdate(props: SpineNode): boolean {
        if (typeof props.item === 'string') {
            props.item = JSON.parse(props.item);
        }
        return props.item !== undefined;
    }

    protected render(): TemplateResult {
        const { item, mode, position, setSize }: SpineNode = this;
        const collapsibleCss: TemplateResult = html`
        <style>
            .collapsibleNode::after {
                content: ' > ';
            }
        </style>
         `;

        if (mode === Mode.breadcrumb) {
            if (position === 0 && setSize === 1) {
                return html`${collapsibleCss}<span class="lastNode">${item.name}</span>`;
            }
            if (position + 1 < setSize) {
                return html`${collapsibleCss}
                <span class="collapsibleNode">
                    <a href="#" on-click="${this.collapseNode.bind(this)}">${item.name}</a>
                </span>`;
            }
            return html`${collapsibleCss}
            <span class="lastNode">${item.name}</span>`;
        }
        return html`<a href="#" on-click="${this.expandChild.bind(this)}">${item.name}</a>`;
    }

    /**
     * Dispatches node collapse event
     *
     * @param {MouseEvent} event
     */
    private collapseNode(event: MouseEvent): void {
        ((this as any) as EventTarget).dispatchEvent(
            new CustomEvent('collapse-node', {
                bubbles: true,
                composed: true,
                detail: { childId: this.item.id }
            })
        );
    }
    /**
     * Dispatches expand node event
     *
     * @param {MouseEvent} event
     */
    private expandChild(event: MouseEvent): void {
        ((this as any) as EventTarget).dispatchEvent(
            new CustomEvent('expand-child', {
                bubbles: true,
                composed: true,
                detail: { childId: this.item.id }
            })
        );
    }
}

customElements.define('spine-node', SpineNode);
