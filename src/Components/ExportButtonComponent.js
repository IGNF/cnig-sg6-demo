import Component from '../Core/Component.js';
import StorageService from '../Services/StorageService.js';

import XmlExport from '../Export/XmlExport.js';
import EditeurService from '../Services/EditeurService.js';

export class ExportButtonComponent extends Component {

    storageService;

    constructor() {
        super();
        this.name = 'export-btn';

        this.storageService = new StorageService();
        this.editeurService = new EditeurService();
    }

    export(event) {
        // save before export
        this.editeurService.actionSave();
        // export
        let reglement = this.storageService.getReglement();

        if(!reglement.idUrba) {
            alert(`Il n'est pas possible d'exporter un règlement ne possédant pas d'identifiant d'urbanisme. 
Veuillez renseigner cette information via le bouton \"Renseigner\".`);
                   return;
        }

        for(let i in reglement.titres) {
            if(reglement.titres[i].intitule.toUpperCase().match("DISPOSITIONS GÉNÉRALES") || reglement.titres[i].intitule.toUpperCase().match("DISPOSITIONS GENERALES")) {
                reglement.titres[i].idCnig = reglement.idUrba + "/dg";
            } else {
                reglement.titres[i].idCnig = reglement.idUrba + "/" + reglement.titres[i].idZone.replace(/,/g,"-").replace(/ /g, "");
            }   
            if(reglement.titres[i].idSousZone) {
                reglement.titres[i].idCnig += "/" + reglement.titres[i].idSousZone.replace(/,/g,"-").replace(/ /g, "");
            }     
            let index = 0;
            let currentPrescription;
            let currentZone;
            for(let j in reglement.titres[i].contents) {
                if(!reglement.titres[i].contents[j].idZone) {
                    reglement.titres[i].contents[j].idZone = reglement.titres[i].idZone;
                }

                if(currentPrescription != reglement.titres[i].contents[j].idPrescription || currentZone != reglement.titres[i].contents[j].idZone) {
                    index++;
                    currentPrescription = reglement.titres[i].contents[j].idPrescription;
                    currentZone = reglement.titres[i].contents[j].idZone;
                }
                let strIndex;
                if(index < 10) {
                    strIndex = "00" + index.toString();
                } else if(index < 100) {
                    strIndex = "0" + index.toString();
                } else {
                    strIndex = index.toString();
                }
                reglement.titres[i].contents[j].idCnig = reglement.titres[i].idCnig + "/contenu" + strIndex;
            }
        }

        const exporter = new XmlExport();
        exporter.export(this.storageService.getReglement());
    }


    getTemplate() {
        return `
            <button title="Exporter un fichier .xml">Exporter</button>
        `;
    }


    registerEvents() {
        super.registerEvents();

        const loadSelector = `.${this.name} button`;
        document.querySelector(loadSelector).addEventListener('click', event => this.export(event));
    }

}

export default ExportButtonComponent;
