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
        let contentPile = [];
        let pluContenuPile = [];

        children.reduce((previous, child, index) => {
            titlePile.push(this.newTitleFromSource(child));
            this.updateContent(titlePile[0], this.newContenuFromSource(child))
            //return;
            // // pass 'section plu-titre' && 'section plu-contenu'
            // if (child.classList.contains('plu-contenu')) {
            //     pluContenuPile.push(child);
            //     return;
            // }
            // const contenu = this.newContenuFromSource(child);
            // contentPile.push(contenu);

            // if (child.tagName.match('H[1-6]')) {
            //     const title = this.newTitleFromSource(child);
            //     // parent is the last upper level title
            //     const parents = titlePile.filter(t => t.niveau < title.niveau);
            //     if (parents.length > 0) {
            //         this.addChildrenTitle(parents[parents.length - 1], title);
            //     }
            //     titlePile.push(title);
            // }

            // const lastTitle = titlePile[titlePile.length - 1];
            // const lastContenu = contentPile.pop();
            // this.updateContent(lastTitle, lastContenu);
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
            'id', 'href',
            'idZone', 'idPrescription'
        ];
        attributes.forEach((att) => {
            let attribute = att;
            attribute = 'data-' + attribute.toLowerCase();
            if (element.getAttribute(attribute) && element.getAttribute(attribute) !== 'null') {
                if(att != "id" || element.getAttribute(attribute).match("Contenu")) {
                    contenu[att] = element.getAttribute(attribute);
                }
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
            'id', 'numero', 'href',
            'idZone', 'idPrescription'
        ];
        attributes.forEach((att) => {
            let attribute = att;
            attribute = 'data-' + attribute.toLowerCase();
            if (element.getAttribute(attribute) && element.getAttribute(attribute) !== 'null') {
                if(att != "id" || element.getAttribute(attribute).match("Titre")) {
                    titre[att] = element.getAttribute(attribute);
                }
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
            'id', 'numero', 'href',
            'idZone', 'idPrescription'
        ];
        attributes.forEach((att) => {
            let attribute = att;
            attribute = 'data-' + attribute.toLowerCase();
            if (titre[att]) {
                node.setAttribute(attribute, titre[att]);
            }
        });
    }


    updateContenuNode(node, contenu) {
        const attributes = [
            'id', 'href',
            'idZone', 'idPrescription'
        ];
        attributes.forEach((att) => {
            let attribute = att;
            attribute = 'data-' + attribute.toLowerCase();
            if (contenu[att]) {
                node.setAttribute(attribute, contenu[att]);
            }
        });
    }

}

export default HtmlConverterService;
