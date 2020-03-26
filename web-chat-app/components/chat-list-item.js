import Component from "./component";

class ChatListItem extends Component {

    /**
     * define attributes types
     * @returns {Object}
     */
    static get attrTypes() {
        return {
            id: {
                type: "string",
                required: true,
            },
            title: {
                type: "string",
                required: true,
                observe: true
            },
            desc: {
                type: "string",
                observe: true
            },
            avatar: {
                type: "string",
                observe: true
            },
            lastseen: {
                type: "string",
                observe: true
            },
            unreadcount: {
                type: "number",
                observe: true
            },
            online: {
                type: "boolean",
                observe: true
            },
        };
    }

    /**
     * generate observed attributes array from attr types object
     */
    static get observedAttributes() {
        return super.getObservedAttrs(ChatListItem.attrTypes);
    }

    /**
     * generate tag-name from component class name
     * @returns {string}
     */
    static get tagName() {
        return super.generateTagName(ChatListItem.name);
    }

    /**
     * styles of component
     * @returns {string}
     */
    static get style() {
        return (`<style>
                    :host {
                        display: block;
                    }
                    :host([hidden]) {
                        display: none;
                    }
                    * {
                        box-sizing: content-box;
                        user-select: none;                        
                    }
                    .chat-list-item {
                        --primaryColor:  #3AD07A;
                        --hoverColor: #edfbf3;
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        padding: 1em;
                        position: relative;
                        cursor: pointer;
                    }
                    .chat-list-item:hover,
                    .chat-list-item:hover .item-meta{
                        background: var(--hoverColor);
                    }
                    :host([selected]) {
                        box-shadow: 0 0 7px 2px rgba(0, 0, 0, 0.1);
                        position: relative;
                        z-index: 1;
                    }
                    .avatar-container {
                        flex: 0 0 3em;
                        width: 3em;
                        height: 3em;
                        border-radius: 50%;
                        overflow: hidden;   
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin-right: 1em;
                        background: #efefef;
                        font-weight: bold;
                        font-size: 1em;
                        position: relative;
                    }
                    .avatar-container img {
                        max-width: 100%;
                    }
                    .online-badge {
                        position: absolute;
                        right: 10px;
                        bottom: 4px;
                        width: 8px;
                        height: 8px;
                        background: var(--primaryColor);
                        display: inline-block;
                        border-radius: 50%;
                        border: 1px solid #fff;
                        visibility: hidden;
                        opacity: 0;
                    }
                     :host([online]) .online-badge {
                        visibility: visible;
                        opacity: 1;
                    }                    
                    .item-details {
                        flex: 0 1 100%;
                        position: relative;
                    }
                    #title {
                        margin: 0 0 .3em 0;
                        font-size: 1em;
                    }
                    #desc {
                        margin: 0;
                        font-size: .8em;
                        opacity: .4;
                        max-width: 80%;
                        overflow: hidden;
                        display: block;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                    .item-meta {
                        position: absolute;
                        right: 0;
                        top: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background: #fff;                    
                    }
                    #lastseen {
                        font-size: .7em;
                        opacity: .5;
                        margin-right: 1em;
                    }
                    #unreadcount {
                        background: var(--primaryColor);
                        width: 22px;
                        height: 22px;
                        border-radius: 50%;
                        text-align: center;
                        color: #fff;
                        font-size: .8em;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        visibility: hidden;
                        opacity: 0;
                        overflow: hidden;
                        text-overflow: clip;
                    }
                    :host([unread]) #unreadcount {
                        visibility: visible;
                        opacity: 1;
                    }
                </style>`)
    }

    /**
     * html template of component
     * @returns {string}
     */
    static get template() {
        return (`
            <template>
                ${ChatListItem.style}
                <div class="chat-list-item">
                    <div class="avatar-container">
                        <span class="online-badge"></span>
                        <img src="" id="avatar">
                        <span class="char-avatar"></span>
                    </div>
                    <div class="item-details">
                        <h3 id="title"></h3>
                        <p id="desc"></p>
                        <div class="item-meta">
                            <span id="lastseen"></span>
                            <span id="unreadcount"></span>
                        </div>
                    </div>
                </div>
            </template>
            `)
    }

    constructor() {
        super({
            attrTypes: ChatListItem.attrTypes,
            template: ChatListItem.template
        });

        // render component
        this.render();
    }

    connectedCallback() {
        this.initListeners();
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
        if (oldValue === newValue)
            return;

        // re-render component
        this.render();
    }

    set selected(value) {
        if (value) {

            // unselect other items
            document.querySelectorAll("chat-list-item")
                .forEach(i => i.shadowRoot.host.selected = false);

            // fire selected event
            this.dispatchEvent(new CustomEvent("selected", {
                detail: {id: this.hasAttribute("id"),}
            }));

            this.setAttribute('selected', '');

        } else {
            this.removeAttribute('selected');
        }
    }

    get selected() {
        return this.hasAttribute('selected');
    }

    set unread(value) {
        if (value)
            this.setAttribute('unread', '');
        else
            this.removeAttribute('unread');
    }

    get unread() {
        return this.hasAttribute('unread');
    }

    initListeners() {
        this.shadowRoot.host.addEventListener("click", this._onClick.bind(this))
    }

    _onClick(e) {
        e.preventDefault();
        if (this.disabled) {
            return;
        }

        this.selected = !this.selected
    }

    /**
     * render component according to template and attributes
     */
    render() {

        // remove component if id not passed
        if (!("id" in this.attributes)) {
            this.remove()
        }

        // put first char of title when avatar not passed
        const title = this.getAttribute("title").toUpperCase() || "";

        // check the existence of avatar
        // fetch first char of title to show if avatar not passed
        if (!this.getAttribute("avatar")) {
            this.shadowRoot.querySelector(".char-avatar").innerText = title.substr(0, 1);
        }

        // loop over attributes and set all
        for (let attr of this.attributes) {
            const target = this.shadowRoot.getElementById(attr.name);
            if (target)
                target.innerText = attr.value;

            switch (attr.name) {
                case "avatar":
                    target.src = attr.value;
                    break;

                case "unreadcount":
                    this.unread = parseInt(attr.value) > 0;
                    break;

            }

        }
    }

}

customElements.define(ChatListItem.tagName, ChatListItem);
