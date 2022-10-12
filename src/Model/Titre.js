
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

    unserialise(data) {
        this.id =             data.id;
        this.intitule =       data.intitule;
        this.niveau =         data.niveau;
        this.numero =         data.numero;
        this.href =           data.href;
        this.idZone =         data.idZone;
        this.idPrescription = data.idPrescription;
        this.inseeCommune =   data.inseeCommune;
        this.contents =       data.contents;
        this.children =       data.children.map(titreData => new Titre().unserialise(titreData));
        return this;
    }


    getHtmlContent() {
        const partContent = this.contents.map(contenu => contenu.htmlContent).join('');
        const partChildren = this.children.map(titre => titre.getHtmlContent()).join('');

        return `${partContent}${partChildren}`;
    };

}

export default Titre;
