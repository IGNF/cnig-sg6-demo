
class Titre {

    // attributes (form)
    id;
    intitule;
    niveau;
    numero;
    href;

    // gpu attributes
    idZone;
    idPrescription;
    // un ou plusieurs commune (cf PLUi)
    inseeCommune;

    // Liste de contenu
    contents;
    // Liste de Zone enfants
    children;

    constructor() {
        this.contents = [];
        this.children = [];
    }

}

export default Titre;
