
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
        return `
            <div class="section plu-content" id="${this.id}" href="${this.href}" idZone="${this.idZone}" idPrescription="${this.idPrescription}"></div>
            ${this.htmlContent}
        `;
    }


    toXml() {
        return `
            <plu:Contenu id="${this.id}" href="${this.href}" idZone="${this.idZone}" idPrescription="${this.idPrescription}">
                ${this.htmlContent}
            </plu:Contenu>
        `;
    };

}

export default Contenu;
