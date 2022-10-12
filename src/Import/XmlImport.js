import Reglement from '../Model/Reglement';
import Titre from '../Model/Titre';
import Contenu from '../Model/Contenu';

class XmlImport {

	xmlReglement;


    constructor() {

    }


    load(xmlString) {
        const parser = new DOMParser();
        const xmlReglement = parser.parseFromString(xmlString, 'text/html');
		this.xmlReglement = xmlReglement;

        const reglement = new Reglement();

        const reglementElement = xmlReglement.getElementsByTagName('plu:ReglementDU')[0];
        reglement.id = reglementElement.getAttribute('id');
        reglement.lien = reglementElement.getAttribute('lien');
        reglement.nom = reglementElement.getAttribute('nom');
        reglement.idUrba = reglementElement.getAttribute('idUrba');
        reglement.typeDoc = reglementElement.getAttribute('typeDoc');

        reglement.titres = Array.from(xmlReglement.getElementsByTagName('plu:Titre'))
            .filter(element => element.getAttribute('niveau') == 1)
            .map((element) => {
                return this.loadTitre(element);
            });


        return reglement;
    }

    loadTitre(element) {
        const titre = new Titre();

        titre.id = element.getAttribute('id');
        titre.intitule = element.getAttribute('intitule')?.toLowerCase();
        titre.niveau = parseInt(element.getAttribute('niveau'));
        titre.numero = element.getAttribute('numero');
        titre.href = element.getAttribute('href');

        titre.idZone = element.getAttribute('idZone');
        titre.idPrescription = element.getAttribute('idPrescription');
        titre.inseeCommune = element.getAttribute('inseeCommune');

        titre.children = Array.from(this.xmlReglement.getElementById(titre.id).getElementsByTagName('plu:Titre'))
			.filter(element => element.parentNode.id == titre.id)
            .map(subtitle => this.loadTitre(subtitle));

        titre.contents = Array.from(this.xmlReglement.getElementById(titre.id).getElementsByTagName('plu:Contenu'))
			.filter(element => element.parentNode.id == titre.id)
            .map(subtitle => this.loadContenu(subtitle));


		return titre;
    }

    loadContenu(element) {
        const contenu = new Contenu();

        contenu.id = element.getAttribute('id');
        contenu.href = element.getAttribute('href');
        contenu.idZone = element.getAttribute('idZone');
        contenu.idPrescription = element.getAttribute('idPrescription');
        contenu.htmlContent = element.innerHTML;

        return contenu;
    }


}

export default XmlImport;
