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
        this.id =             `idelem${Date.now()}`;
        this.intitule =       '';
        this.niveau =         '';
        this.numero =         '';
        this.href =           '';
        this.idZone =         '';
        this.idPrescription = 'nonConcerne';
        this.inseeCommune =   '';
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

    findTitreById(id) {
        if (this.id === id) {
            return this;
        }
        return this.children.find(child => child.findTitreById(id));
    }


    findSubtitle(needle) {
        if (needle.intitule === this.intitule && needle.niveau === this.niveau) {
            return this;
        }
        return this.children.find(child => child.findSubtitle(needle));
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
        const html = `
            ${partContent}
            ${partChildren}
        `;
        const node = document.createElement('div');
        node.innerHTML = html;
        const titleNode = node.querySelector(`h${this.niveau}`);
        if (titleNode) {
            titleNode.setAttribute('id', this.id);
            titleNode.setAttribute('data-intitule', this.intitule);
            titleNode.setAttribute('data-niveau', this.niveau);
            titleNode.setAttribute('data-numero', this.numero);
            titleNode.setAttribute('data-href', this.href);
            titleNode.setAttribute('data-idzone', this.idZone);
            titleNode.setAttribute('data-idprescription', this.idPrescription);
            titleNode.setAttribute('data-inseecommune', this.inseeCommune);
        }
        return node.innerHTML;
    };


    toXml() {
        const partContent = this.contents.map(contenu => contenu.toXml()).join('');
        const partChildren = this.children.map(titre => titre.toXml()).join('');
        // TODO clean data attributes
        const xmlString = `
            <plu:Titre id="${this.id}" intitule="${this.intitule}" niveau="${this.niveau}"
                numero="${this.numero}" href="${this.href}" idZone="${this.idZone}"
                idPrescription="${this.idPrescription}" inseeCommune="${this.inseeCommune}">
                ${partContent}
                ${partChildren}
            </plu:Titre>
        `;
        return this.sanitizeXml(xmlString);
    };

    sanitizeXml(string) {
        return string.trim().replace(/\u00a0/g, ' ')
    }

}

export default Titre;
