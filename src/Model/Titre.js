import Contenu from './Contenu';

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
    // export content before children
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
        // TODO manage order
        this.contents =       data.contents.map(contentData => new Contenu().unserialise(contentData));
        this.children =       data.children.map(titreData => new Titre().unserialise(titreData));
        return this;
    }


    toSimpleContent() {
        const partContent = this.contents.map(contenu => contenu.toSimpleContent()).join('');
        const partChildren = this.children.map(titre => titre.toSimpleContent()).join('');
        return `
            ${partContent}
            ${partChildren}
        `;
    };


    toHtml() {
        const partContent = this.contents.map(contenu => contenu.toHtml()).join('');
        const partChildren = this.children.map(titre => titre.toHtml()).join('');
        return `
            <div class="section plu-titre" id="${this.id}" intitule="${this.intitule}" niveau="${this.niveau}"
                numero="${this.numero}" href="${this.href}" idZone="${this.idZone}"
                idPrescription="${this.idPrescription}" inseeCommune="${this.inseeCommune}">
            </div>
            ${partContent}
            ${partChildren}
        `;
    };


    toXml() {
        const partContent = this.contents.map(contenu => contenu.toXml()).join('');
        const partChildren = this.children.map(titre => titre.toXml()).join('');
        return `
            <plu:Titre id="${this.id}" intitule="${this.intitule}" niveau="${this.niveau}"
                numero="${this.numero}" href="${this.href}" idZone="${this.idZone}"
                idPrescription="${this.idPrescription}" inseeCommune="${this.inseeCommune}">
                ${partContent}
                ${partChildren}
            </plu:Titre>
        `;
    };

}

export default Titre;
