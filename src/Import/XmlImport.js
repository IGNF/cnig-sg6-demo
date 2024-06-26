import Reglement from '../Model/Reglement.js';
import Titre from '../Model/Titre.js';
import Contenu from '../Model/Contenu.js';

import { DOMParser as DOMParser2 } from 'xmldom';
/*
 * TODO https://github.com/IGNF/cnig-sg6-demo/issues/7 - blinder les tests pour
 * supprimer ce code et utiliser le parser 'xmldom'
 * (différence de comportement entre DOMParser de xmldom et celui de firefox => risque d'avoir le même problème)
 */
if ( typeof window !== 'undefined' && typeof window.DOMParser !== 'undefined' ){
    DOMParser2 = window.DOMParser;
}

class XmlImport {

	xmlReglement;


    constructor() {

    }


    load(xmlString) {
        const parser = new DOMParser2();

        const xmlReglement = parser.parseFromString(xmlString, 'application/xml');
		this.xmlReglement = xmlReglement;

        const reglement = new Reglement();
        const reglementElement = xmlReglement.getElementsByTagName('plu:ReglementPLU')[0];

        reglement.id =      reglementElement.getAttribute('idReglement');
        reglement.lien =    reglementElement.getAttribute('lien');
        reglement.nom =     reglementElement.getAttribute('nom');
        reglement.idUrba =  reglementElement.getAttribute('idUrba');
        reglement.titres = Array.from(xmlReglement.getElementsByTagName('plu:Titre'))
            .filter(element => element.getAttribute('niveau'))
            .map((element) => {
                return this.loadTitre(element);
            });

        return reglement;
    }

    loadTitre(element) {
        
        const titre = new Titre();
        titre.id = element.getAttribute('idTitre');
        titre.idCnig = element.getAttribute('idTitre');
        titre.intitule = element.getAttribute('intitule');
        titre.niveau = parseInt(element.getAttribute('niveau'));
        titre.numero = element.getAttribute('numero');

        titre.idZone = element.getAttribute('idZone');
        titre.idSousZone = element.getAttribute('idSousZone');
        titre.idPrescription = element.getAttribute('idPrescription');

        var cb = function(element, titre) {
            
            if(element.parentNode.getAttribute("idTitre") == titre.id && element.parentNode.attributes.niveau.value == titre.niveau) {
                return true;
            }
            return false; 
        }

        titre.contents = Array.from(this.xmlReglement.querySelector("[idTitre='" + titre.id + "'").getElementsByTagName('plu:Contenu'))
			.filter(element => cb(element, titre))
            .map(subtitle => this.loadContenu(subtitle));

        titre.children = Array.from(this.xmlReglement.querySelector("[idTitre='" + titre.id + "'").getElementsByTagName('plu:Titre'))
            .filter(element =>cb(element, titre))
            .map(subtitle => this.loadTitre(subtitle));

		return titre;
    }


    lameCheckHTML(htmlString) {
        const doc = document.createAttribute('div');
        doc.innerHTML = htmlString;
        return doc.innerHTML === htmlString;
    }

    loadContenu(element) {
        const contenu = new Contenu();

        contenu.id = element.getAttribute('idContenu');
        contenu.idCnig = element.getAttribute('idContenu');
        contenu.idZone = element.getAttribute('idZone');
        contenu.idPrescription = element.getAttribute('idPrescription');
        if (!this.lameCheckHTML(element.innerHTML)) {
            console.error('[XmlImport] html non valide', contenu, element.innerHTML);
        }
        
        contenu.htmlContent = element.innerHTML;

        return contenu;
    }


}

export default XmlImport;
