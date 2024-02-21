import Contenu from './Contenu.js';

class Titre {

    // attributes (form)
    id;
    intitule;
    niveau;
    numero;

    // gpu attributes
    idZone;
    idSousZone
    idPrescription;

    // Liste de contenu
    // export content before children
    contents;
    // Liste de Zone enfants
    children;
    displayChildren;
    hiddenClass;

    constructor() {
        
        this.id =               `idTitre${Math.floor(Math.random()*Date.now())}`;
        this.idCnig =           '';
        this.intitule =         '';
        this.niveau =           '';
        this.numero =           '';
        this.idZone =           '';
        this.idSousZone =       '';
        this.idPrescription =   'nonConcerne';
        this.contents =         [];
        this.children =         [];
        this.displayChildren =  true;
        this.hiddenClass =      [];               
    }

    unserialise(data) {
        this.id =             data.id;
        this.idCnig =         data.idCnig;
        this.intitule =       data.intitule;
        this.niveau =         data.niveau;
        this.numero =         data.numero;
        this.idZone =         data.idZone;
        this.idSousZone =     data.idSousZone;
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
            titleNode.setAttribute('data-idCnig', this.idCnig);
            titleNode.setAttribute('data-intitule', this.intitule);
            titleNode.setAttribute('data-niveau', this.niveau);
            titleNode.setAttribute('data-numero', this.numero);
            titleNode.setAttribute('data-idzone', this.idZone);
            titleNode.setAttribute('data-idsouszone', this.idSousZone);
            titleNode.setAttribute('data-idprescription', this.idPrescription);
        }
        return node.innerHTML;
    };


    toXml() {
        //fuse content with same attribute
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
            <plu:Titre id="${this.idCnig}" intitule="${this.intitule}" niveau="${this.niveau}"
                numero="${this.numero}" idZone="${this.idZone}" idSousZone="${this.idSousZone}"
                idPrescription="${this.idPrescription}">
                ${partContent}
                ${partChildren}
            </plu:Titre>
        `;
        return this.sanitizeXml(xmlString.replace(/style="display: none;"/g, ""));
    };

    sanitizeXml(string) {
        return string.trim().replace(/\u00a0/g, ' ');
    }

}

export default Titre;
