import Reglement from '../Model/Reglement';
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
            'id', 'data-numero', 'data-href',
            'data-idzone', 'data-idprescription', 'data-inseecommune'
        ];
        attributes.filter(att => element.getAttribute(att)).forEach((att) => {
            titre[att] = element.getAttribute(att);
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

}

export default HtmlConverterService;
