import { html, LitElement, property, TemplateResult } from '@polymer/lit-element/lit-element.js';
import { Skill as Model } from '../model/cc-proxy/Skill.js';
export class Skill extends LitElement {
    /** Whether this element is disabled */
    @property({ type: Boolean })
    public disabled: boolean = false;
    /** Whether this element is indeterminate */
    @property({ type: Boolean })
    public indeterminate: boolean = false;
    /** Whether this element is selected */
    @property({ type: Boolean })
    public selected: boolean = false;
    /** Reference spine skill model */
    @property({ type: Object })
    public item: Model;

    constructor(item: Model, selected = false) {
        super();
        this.item = item;
        this.selected = selected;
    }
    protected shouldUpdate({ item }: Skill): boolean {
        if (typeof item === 'string') {
            this.item = JSON.parse(item);
        }

        return item !== undefined;
    }

    protected render(): TemplateResult {
        const { disabled, indeterminate, item, selected }: Skill = this;
        return html`
        <link rel="stylesheet" href="/node_modules/@material/form-field/dist/mdc.form-field.css" />
        <link rel="stylesheet" href="/node_modules/@material/checkbox/dist/mdc.checkbox.css" />
        <style>
            .id {
                color: green;
                font-weight: 900;
            }
        </style>
        <div class="mdc-form-field">
            <div class="mdc-checkbox" >
                <input type="checkbox"
                    class="mdc-checkbox__native-control"
                    on-click="${(e: Event) => this.onSelect(e)}"
                    checked="${selected}"
                    disabled="${disabled}"
                    indeterminate="${indeterminate}"/>
                <div class="mdc-checkbox__background">
                    <svg class="mdc-checkbox__checkmark"
                        viewBox="0 0 24 24">
                        <path class="mdc-checkbox__checkmark-path"
                            fill="none"
                            stroke="white"
                            d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
                    </svg>
                    <div class="mdc-checkbox__mixedmark"></div>
                </div>
            </div>
        </div>
        ${item.name}<span class="id">[${item.id}]</span>
        `;
    }
    /**
     * Fired when a skill is checked
     *
     * @param event
     */
    private onSelect(event): void {
        event.stopPropagation();
        this.selected = event.target.checked;
        ((this as any) as EventTarget).dispatchEvent(
            new CustomEvent('selected', {
                bubbles: true,
                composed: true,
                detail: { id: this.item.id, selected: this.selected }
            })
        );
    }
}

customElements.define('spine-skill', Skill);
