
class Contenu {

    // attributes (form)
    id;
    href;

    // gpu attributes
    // par default même que Zone.idZone
    idZone;
    // par default pas de prescription (à saisir par le form)
    idPrescription;

    // HTML en string
    htmlContent;

    constructor() {
        this.id =             `idelem${Date.now()}`;
        this.href =           '';
        this.idZone =         '';
        this.idPrescription = 'nonConcerne';
        this.htmlContent =    '';
    }

    unserialise(data) {
        this.id =             data.id;
        this.href =           data.href;
        this.idZone =         data.idZone;
        this.idPrescription = data.idPrescription;
        this.htmlContent =    data.htmlContent;
        return this;
    }


    toSimpleContent() {
        return `${this.htmlContent}`;
    };


    toHtml() {
        const html = `
            <div class="section plu-contenu" id="${this.id}" data-href="${this.href}" data-idZone="${this.idZone}" data-idPrescription="${this.idPrescription}"></div>
            ${this.htmlContent}
        `;
        const node = document.createElement('div');
        node.innerHTML = html;
        const children = Array.from(node.children);
        children.forEach((child) => {
            child.setAttribute('data-id-contenu', this.id);
        });
        return node.innerHTML;
    }


    toXml() {
        return `
            <plu:Contenu id="${this.id}" href="${this.href}" idZone="${this.idZone}" idPrescription="${this.idPrescription}">
                ${this.htmlContent}
            </plu:Contenu>
        `.trim();
    };

}

export default Contenu;
