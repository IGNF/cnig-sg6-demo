import Contenu from "./Contenu";
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
        this.id = `idReglementDu${Date.now()}`;
        this.nom = 'Modifiez la fiche';
        this.lien = '';
        this.idUrba = '';
        this.typeDoc = '';
        this.titres = [];
    }

    serialize() {

    }

    unserialise(data) {
        if (data === null) {
            return null;
        }
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
        if (index !== -1) {
            return this.titres[index];
        }
        for (const index in this.titres) {
            const titre = this.titres[index].findTitreById(id);
            if (titre) { return titre; }
        }
    }


    removeTitre(id) {
        const index = this.titres.findIndex(t => t.id === id);
        if (index === -1) {
            return;
        }
        this.titres.splice(index, 1);
    }


    replaceTitre(titre) {
        const index = this.titres.findIndex(t => t.id === titre.id);
        if (index === -1) {
            this.titres.push(titre);
            return;
        }
        this.titres.splice(index, 1, titre);
    }

    updateTitre(formData) {
        const existing = this.getTitreById(formData.id);
        if (!existing) {
            return;
        }
        existing.intitule = formData.intitule;
        existing.niveau = formData.niveau;
        existing.numero = formData.numero;
        existing.href = formData.href;
        existing.idZone = formData.idZone;
        existing.idPrescription = formData.idPrescription;
        existing.inseeCommune = formData.inseeCommune;
        return;
    }

    addTitre(titre) {
        const contenu = new Contenu();
        contenu.htmlContent = `
            <h1>${titre.intitule}</h1>
        `;
        titre.contents.push(contenu);
        this.titres.push(titre);
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
        const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
            <plu:ReglementDU
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xmlns="http://www.w3.org/1999/xhtml"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
                xmlns:plu="https://cnig.gouv.fr/reglementDU"
                xsi:schemaLocation="https://cnig.gouv.fr/reglementDU https://raw.githubusercontent.com/cnigfr/structuration-reglement-urbanisme/master/schemas/old/reglementDU.xsd"
                id="${this.id}" nom="${this.nom}" lien="${this.lien}"
                idUrba="${this.idUrba}" typeDoc="${this.typeDoc}">
                ${content}
            </plu:ReglementDU>
        `;
        return this.sanitizeXml(xmlString);
    };

    sanitizeXml(string) {
        return string.trim()
            .replace(/\u00a0/g, ' ')
            .replace(/            /g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/ data-[^=]*="[^"]*"/g, ' ')
            .replace(/<(img|colgroup|col|source|hr) ([^>]*[^\/])\/?>/g, '<$1 $2/>')
            .replace(/<hr>/g, '<hr/>')
            .replace(/( )?xmlns="http:\/\/www.w3.org\/1999\/xhtml"/g, '')
            .replace(/xmlns:xlink="http:\/\/www.w3.org\/1999\/xlink"/g, 'xmlns="http://www.w3.org/1999/xhtml" xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

}

export default Reglement;
