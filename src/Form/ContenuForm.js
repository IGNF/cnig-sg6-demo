import Component from '../Core/Component.js';
import DialogService from '../Services/DialogService.js';
import EditeurService from '../Services/EditeurService.js';
import StorageService from '../Services/StorageService.js';

class ContenuForm extends Component {

    form;

    contenu;

    constructor(contenu) {
        super();
        this.name = 'form-contenu';

        this.contenu = contenu;

        this.storageService = new StorageService();
        this.dialogService = new DialogService();
        this.editeurService = new EditeurService();
    }


    valid(event) {
        const selector = `.${this.name} form`;
        const form = document.querySelector(selector);
        for(var i in this.contenu) {
            this.contenu[i].idZone = form.idZone.value;
            this.contenu[i].idPrescription = form.idPrescription.value;
        }
        // reload metadata attribute
        for(var i in this.contenu) {
            this.editeurService.updateContenuNode(this.contenu[i]);
        }
        
        this.dialogService.close();
    }


    close(event) {
        this.dialogService.close();
    }


    getTemplate() {
        var id = "";
        var titre = this.getTitle();
        for(var i in this.contenu) {
            id += this.contenu[i].id + " ; ";
            if(!this.contenu[i].idZone) {
                this.contenu[i].idZone = titre.idZone;
            }
        }
        id = id.replace(/; $/,"");

        var idZone = "";
        var idPrescription = "";

        if(this.contenu.length == 1) {
            idZone = this.contenu[0].idZone;
            idPrescription = this.contenu[0].idPrescription;
        }

        return `
            <h4>Modifier le contenu</h4>
            <form>
                <label for="id" class="hidden">Identifiant</label>
                <input id="id" class="hidden" type="string" value="${id}" readonly>
                <label for="idZone">Zone (ex : U, Ua, etc.) ou la mention porteeGenerale si toutes les zones sont concernées</label>
                <input id="idZone" type="string" value="${idZone}" placeholder="U">
                <label for="idPrescription">Prescription (05-01, ...)</label>
                <input id="idPrescription" type="string" value="${idPrescription}">
            </form>
            <div class="form-action">
                <div class="separator"></div>
                <button class="btn-valid">Valider</button>
                <button class="btn-close">Annuler</button>
            </div>
        `;
    }


    registerEvents() {
        super.registerEvents();

        const validSelector = `.${this.name} .btn-valid`;
        document.querySelector(validSelector).addEventListener('click', event => this.valid(event));

        const closeSelector = `.${this.name} .btn-close`;
        document.querySelector(closeSelector).addEventListener('click', event => this.close(event));
    }

    getTitle() {
        let idContenu = this.contenu[0].id;
        let titres = this.storageService.reglement.titres;
        for(var i in titres) {
            for(var j in titres[i].contents) {
                if(idContenu == titres[i].contents[j].id) {
                    return titres[i];
                }
            }
        }
    }

}

export default ContenuForm;
