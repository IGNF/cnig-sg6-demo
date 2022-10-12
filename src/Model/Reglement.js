import Titre from "./Titre";

class Reglement {

    // attributes (form)
    id;
    nom;
    lien;

    // gpu attributes
    idUrba;
    typeDoc;

    // liste de Zone
    titres;

    // hors model
    // html pour comparer (?)
    htmlContent;

    constructor() {
        this.titres = [];
    }

    serialize() {

    }

    unserialise(data) {
        this.id = data.id;
        this.nom = data.nom;
        this.lien = data.lien;
        this.idUrba = data.idUrba;
        this.typeDoc = data.typeDoc;
        this.titres = data.titres.map(titreData => new Titre().unserialise(titreData));
        this.htmlContent = data.htmlContent;
        return this;
    }


    getTitreById(id) {
        const index = this.titres.findIndex(t => t.id === id);
        if (index === -1) {
            return null;
        }
        return this.titres[index];
    }


    removeTitre(id) {
        const index = this.titres.findIndex(t => t.id === id);
        if (index === -1) {
            return;
        }
        this.titres.splice(index, 1);
    }


    toSimpleContent() {
        const content = this.titres.map(titre => titre.toSimpleContent()).join('');
        return `
            ${content}
        `;
    };


    toHtml() {
        const content = this.titres.map(titre => titre.toHtml()).join('');
        return `
            <div id="${this.id}" nom="${this.nom}" lien="${this.lien}"
                idUrba="${this.idUrba}" typeDoc="${this.typeDoc}" >
                ${content}
            </div>
        `;
    };


    toXml() {
        const content = this.titres.map(titre => titre.toXml()).join('');
        return `<?xml version="1.0" encoding="UTF-8"?>
            <plu:ReglementDU
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xmlns="http://www.w3.org/1999/xhtml"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
                xmlns:plu="https://cnig.gouv.fr/reglementDU"
                xsi:schemaLocation="https://cnig.gouv.fr/reglementDU https://raw.githubusercontent.com/cnigfr/structuration-reglement-urbanisme/master/schemas/reglementDU.xsd"
                id="${this.id}" nom="${this.nom}" lien="${this.lien}"
                idUrba="${this.idUrba}" typeDoc="${this.typeDoc}" >
                ${content}
            </plu:ReglementDU>
        `;
    };

}

export default Reglement;
