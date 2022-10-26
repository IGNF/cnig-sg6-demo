import Titre from '../Model/Titre';
import Contenu from '../Model/Contenu';


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
            // pass 'section plu-titre' && 'section plu-contenu'
            if (child.classList.contains('plu-contenu')) {
                pluContenuPile.push(child);
                return;
            }
            contentPile.push(child.outerHTML);

            if (child.tagName.match('H[1-6]')) {
                const title = this.newTitleFromSource(child);
                // parent is the last upper level title
                const parents = titlePile.filter(t => t.niveau < title.niveau);
                if (parents.length > 0) {
                    this.addChildrenTitle(parents[parents.length - 1], title);
                }
                titlePile.push(title);
            }

            const lastTitle = titlePile[titlePile.length - 1];
            const lastContent = contentPile.pop();
            this.updateContent(lastTitle, lastContent);
        }, null);

        // return root
        const newTitle = titlePile[0];
        return newTitle;
    }


    newTitleFromSource(element) {
        const titre = new Titre();
        // from user input
        titre.niveau = parseInt(element.tagName.substring(1));
        titre.intitule = element.innerText.toLowerCase();
        // from data attributes
        const attributes = [
            'id', 'numero', 'href',
            'idZone', 'idPrescription', 'inseeCommune'
        ];
        attributes.forEach((att) => {
            let attribute = att;
            if (attribute !== 'id') {
                attribute = 'data-' + attribute.toLowerCase();
            }
            if (element.getAttribute(attribute) && element.getAttribute(attribute) !== 'null') {
                titre[att] = element.getAttribute(attribute);
            }
        });
        return titre;
    }


    updateContent(titre, htmlString) {
        if (!titre) {
            console.error('[PluReglementSaveService] updateContent - title not found');
            return false;
        }
        if (titre.contents.length === 0) {
            titre.contents.push(new Contenu());
        }
        titre.contents[titre.contents.length - 1].htmlContent += htmlString;
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
            'idZone', 'idPrescription', 'inseeCommune'
        ];
        attributes.forEach((att) => {
            let attribute = att;
            if (attribute !== 'id') {
                attribute = 'data-' + attribute.toLowerCase();
            }
            if (titre[att]) {
                node.setAttribute(attribute, titre[att]);
            }
        });
    }

}

export default HtmlConverterService;
