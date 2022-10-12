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

}

export default Reglement;
