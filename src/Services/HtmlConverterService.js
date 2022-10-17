import Reglement from '../Model/Reglement';
import Titre from '../Model/Titre';
import Contenu from '../Model/Contenu';


class HtmlConverterService {


    constructor() {
    }


    createReglement(htmlString) {

        const reglement = new Reglement();
        return reglement;
    }

    createTitre(htmlString) {

        const node = document.createElement('div');
        node.innerHTML = htmlString;

        const children = Array.from(node.children);

        // 1. Recompose section plu-titre / plu-content
        // plu-titre -> h1, h2, h3...
        let title;
        let content;
        const result = children.reduce((previous, child, index) => {
            console.log('child', child);
            if (child.classList.contains('plu-titre')) {
                title = child;
            }
            if (child.classList.contains('plu-content')) {
                content = child;
            }
            if (!child.tagName.match('H[1-6]')) {
                return previous;
            }
            const candidat = {
                child: child,
                index: index,
                voisin: null,
                mustbe: null,
                title: title,
                content: content
            };
            if (index > 0) {
                const voisin = children[index - 1];
                candidat.voisin = voisin;
            }
            if (!candidat.voisin.classList.contains('section')) {
                candidat.mustbe = '<div class="section plu-titre"></div>';
            }
            previous.push(candidat);
            return previous;
        }, []);
        console.log(result);

        // 2. Read Node by Node

        const titre = new Titre();
        return titre;
    }


    loadTitre(element) {
        console.log('loadTitre');
        console.log(element);
        const titre = new Titre();

        titre.id = element.getAttribute('id');
        titre.intitule = element.getAttribute('intitule')?.toLowerCase();
        titre.niveau = parseInt(element.getAttribute('niveau'));
        titre.numero = element.getAttribute('numero');
        titre.href = element.getAttribute('href');

        titre.idZone = element.getAttribute('idZone');
        titre.idPrescription = element.getAttribute('idPrescription');
        titre.inseeCommune = element.getAttribute('inseeCommune');

        titre.contents = Array.from(this.xmlReglement.getElementById(titre.id).getElementsByTagName('plu:Contenu'))
			.filter(element => element.parentNode.id == titre.id)
            .map(subtitle => this.loadContenu(subtitle));

        titre.children = Array.from(this.xmlReglement.getElementById(titre.id).getElementsByTagName('plu:Titre'))
            .filter(element => element.parentNode.id == titre.id)
            .map(subtitle => this.loadTitre(subtitle));

		return titre;
    }

    loadContenu(element) {
        const contenu = new Contenu();

        contenu.id = element.getAttribute('id');
        contenu.href = element.getAttribute('href');
        contenu.idZone = element.getAttribute('idZone');
        contenu.idPrescription = element.getAttribute('idPrescription');
        if (!this.lameCheckHTML(element.innerHTML)) {
            console.error('[XmlImport] html non valide', contenu, element.innerHTML);
        }
        
        contenu.htmlContent = element.innerHTML;

        return contenu;
    }


}

export default HtmlConverterService;
