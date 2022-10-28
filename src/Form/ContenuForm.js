import Component from '../Core/Component';
import DialogService from '../Services/DialogService';
import EditeurService from '../Services/EditeurService';
import StorageService from '../Services/StorageService';

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

        this.contenu.id = form.id.value;
        this.contenu.href = form.href.value;
        this.contenu.idZone = form.idZone.value;
        this.contenu.idPrescription = form.idPrescription.value;

        // reload metadata attribute
        this.editeurService.updateContenuNode(this.contenu);
        
        this.dialogService.close();
    }


    close(event) {
        this.dialogService.close();
    }


    getTemplate() {
        return `
            <h4>Modifier le contenu</h4>
            <form>
                <label for="id">Identifiant</label>
                <input id="id" type="string" value="${this.contenu.id}" readonly>
                <label for="href">Référence interne</label>
                <input id="href" type="string" value="${this.contenu.href}">
                <label for="idZone">Zone (U, Ua, ...)</label>
                <input id="idZone" type="string" value="${this.contenu.idZone}">
                <label for="idPrescription">rescription (05-01, ...)</label>
                <input id="idPrescription" type="string" value="${this.contenu.idPrescription}">
            </form>
            <div class="form-action">
                <div class="separator"></div>
                <button class="btn-valid">Modifier</button>
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

}

export default ContenuForm;
