import Contenu from './Contenu.js';

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

    // Liste de contenu
    // export content before children
    contents;
    // Liste de Zone enfants
    children;

    constructor() {
        this.id =             `idTitre${Date.now()}`;
        this.intitule =       '';
        this.niveau =         '';
        this.numero =         '';
        this.href =           '';
        this.idZone =         '';
        this.idPrescription = 'nonConcerne';
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
            titleNode.setAttribute('data-id', this.id);
            titleNode.setAttribute('data-intitule', this.intitule);
            titleNode.setAttribute('data-niveau', this.niveau);
            titleNode.setAttribute('data-numero', this.numero);
            titleNode.setAttribute('data-href', this.href);
            titleNode.setAttribute('data-idzone', this.idZone);
            titleNode.setAttribute('data-idprescription', this.idPrescription);
        }
        return node.innerHTML;
    };


    toXml() {
        // TODO fuse content with same attribute
        // const partContent = this.contents.map(contenu => contenu.toXml()).join('');
        const partContent = this.contents.reduce((previousValue, contenu) => {
            if (previousValue.length === 0) {
                previousValue.push(contenu);
                return previousValue;
            }
            const lastOne = previousValue[previousValue.length - 1];
            if (lastOne.isLike(contenu)) {
                lastOne.addHtmlFromOtherContenu(contenu);
            } else {
                previousValue.push(contenu);
            }
            return previousValue;
        }, []).map(contenu => contenu.toXml()).join('');
        const partChildren = this.children.map(titre => titre.toXml()).join('');
        const xmlString = `
            <plu:Titre id="${this.id}" intitule="${this.intitule}" niveau="${this.niveau}"
                numero="${this.numero}" href="${this.href}" idZone="${this.idZone}"
                idPrescription="${this.idPrescription}">
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
