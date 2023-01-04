
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
        this.id =             `idContenu${Date.now()}`;
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


    isLike(contenu) {
        return this.href === contenu.href &&
            this.idZone === contenu.idZone &&
            this.idPrescription === contenu.idPrescription;
    }


    addHtmlFromOtherContenu(contenu) {
        this.htmlContent += contenu.htmlContent;
        contenu.htmlContent = "";
    }


    toSimpleContent() {
        return `${this.htmlContent}`;
    };


    toHtml() {
        const node = document.createElement('div');
        node.innerHTML = this.htmlContent;
        const children = Array.from(node.children);
        children.forEach((child) => {
            child.setAttribute('data-id', this.id);
            child.setAttribute('data-href', this.href);
            child.setAttribute('data-idzone', this.idZone);
            child.setAttribute('data-idprescription', this.idPrescription);
        });
        return node.innerHTML;
    };


    toXml() {
        return `
            <plu:Contenu id="${this.id}" href="${this.href}" idZone="${this.idZone}" idPrescription="${this.idPrescription}">
                ${this.htmlContent}
            </plu:Contenu>
        `.trim();
    };

}

export default Contenu;
