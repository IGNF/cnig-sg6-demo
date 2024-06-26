import Titre from '../Model/Titre.js';
import Contenu from '../Model/Contenu.js';


class HtmlConverterService {


    constructor() {
        if (HtmlConverterService.instance) {
            return HtmlConverterService.instance;
        }
        HtmlConverterService.instance = this;
    }


    recomposeTitre(source) {
        const node = document.createElement('div');
        node.innerHTML = source;

        const children = Array.from(node.children);
        let titlePile = [];
        children.reduce((previous, child, index) => {
            titlePile.push(this.newTitleFromSource(child));
            this.updateContent(titlePile[0], this.newContenuFromSource(child))
        }, null);

        // return root
        const newTitle = titlePile[0];
        return newTitle;
    }


    newContenuFromSource(element) {
        const contenu = new Contenu();
        // from user input
        contenu.htmlContent = element.outerHTML;
        // from data attributes
        const attributes = [
            'id',
            'idZone', 'idPrescription'
        ];
        attributes.forEach((att) => {
            let attribute = att;
            attribute = 'data-' + attribute.toLowerCase();
            if (element.getAttribute(attribute) && element.getAttribute(attribute) !== 'null') {
                    contenu[att] = element.getAttribute(attribute);
            }
        });
        return contenu;
    }


    newTitleFromSource(element) {
        const titre = new Titre();
        // from user input
        titre.niveau = parseInt(element.tagName.substring(1));
        titre.intitule = element.innerText;
        // from data attributes
        const attributes = [
            'id', 'numero', 'idSousZone',
            'idZone', 'idPrescription'
        ];
        attributes.forEach((att) => {
            let attribute = att;
            attribute = 'data-' + attribute.toLowerCase();
            if (element.getAttribute(attribute) && element.getAttribute(attribute) !== 'null') {
                    titre[att] = element.getAttribute(attribute);
            }
        });
        return titre;
    }


    updateContent(titre, contenu) {
        if (!titre) {
            console.error('[PluReglementSaveService] updateContent - title not found');
            return false;
        }
        titre.contents.push(contenu);
    }


    addChildrenTitle(parent, child) {
        if (parent === null || child.niveau === 1) {
            return;
        }
        if (child.niveau - parent.niveau === 1) {
            return parent.children.push(child);
        }
        const subtitle = new Titre();
        subtitle.niveau = parent.niveau + 1;
        subtitle.intitule = 'titre vide';
        parent.children.push(subtitle);
        this.addChildrenTitle(subtitle, child);
    }


    updateTitreNode(node, titre) {
        const attributes = [
            'id', 'numero',
            'idZone', , 'idSousZone', 'idPrescription'
        ];
        attributes.forEach((att) => {
            let attribute = att;
            attribute = 'data-' + attribute.toLowerCase();
            node.setAttribute(attribute, titre[att]);
        });
    }


    updateContenuNode(node, contenu) {
        const attributes = [
            'id',
            'idZone', 'idPrescription'
        ];
        attributes.forEach((att) => {
            let attribute = att;
            attribute = 'data-' + attribute.toLowerCase();
            node.setAttribute(attribute, contenu[att]);
        });
    }

}

export default HtmlConverterService;
