import Contenu from "./Contenu.js";
import Titre from "./Titre.js";

class Reglement {

    // attributes (form)
    id;
    nom;
    lien;

    // gpu attributes
    idUrba;
    typeDoc;
    // une ou plusieurs commune (cf PLUi)
    inseeCommune;

    // liste de Zone
    titres;

    // hors model
    // html pour comparer (?)
    htmlContent;

    constructor() {
        this.id = `idReglementPlu${Date.now()}`;
        this.nom = 'Modifiez la fiche';
        this.lien = '';
        this.idUrba = '';
        this.typeDoc = '';
        this.inseeCommune = '';
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
        this.inseeCommune = data.inseeCommune
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
        //existing.inseeCommune = formData.inseeCommune;
        return;
    }

    addTitre(titre) {
        const contenu = new Contenu();
        contenu.htmlContent = `
            <h${titre.niveau}>${titre.intitule}</h${titre.niveau}>
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
                idUrba="${this.idUrba}" typeDoc="${this.typeDoc}" inseeCommune="${this.inseeCommune}" >
                ${content}
            </div>
        `;
    };


    toXml() {
        const content = this.titres.map(titre => titre.toXml()).join('');
        const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
            <plu:ReglementPLU xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
                xmlns:plu="https://cnig.gouv.fr/reglementDU"
                xsi:schemaLocation="https://cnig.gouv.fr/reglementDU https://raw.githubusercontent.com/IGNF/cnig-sg6-demo/master/examples/data/reglementPLU.XSD"
                id="${this.id}" nom="${this.nom}" lien="${this.lien}"
                idUrba="${this.idUrba}" typeDoc="${this.typeDoc}" inseeCommune="${this.inseeCommune}">
                ${content}
            </plu:ReglementPLU>
        `;
        return this.prettifyXml(this.sanitizeXml(xmlString));
    };


    sanitizeXml(string) {
        return string.trim()
            .replace(/\p{C}/gu, '')
            .replace(/\u00a0/g, ' ')
            .replace(/            /g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/ data-[^=]*="[^"]*"/g, '')
            .replace(/<(img|colgroup|col|source|hr) ([^>]*[^\/])\/?>/g, '<$1 $2/>')
            .replace(/<hr>/g, '<hr/>')
            .replace(/<br>/g, '<br/>')
            .replace(/( )?xmlns="http:\/\/www.w3.org\/1999\/xhtml"/g, '')
            .replace(/xmlns:xsi="http:\/\/www.w3.org\/2001\/XMLSchema-instance"/g, 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.w3.org/1999/xhtml"');
    }


    prettifyXml(xml, tab = null) {
        // tab = optional indent value, default is tab (\t)
        let formatted = '';
        let indent = '';
        tab = tab || '\t';
        xml.split(/>\s*</).forEach(function (node) {
            if (node.match(/^\/\w/)) {
                indent = indent.substring(tab.length);
            }
            formatted += indent + '<' + node + '>\r\n';
            if (node.match(/^<?\w[^>]*[^\/]$/)) {
                indent += tab;
            }
        });
        return formatted.substring(1, formatted.length - 3);
    }

}

export default Reglement;
