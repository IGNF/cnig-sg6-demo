import Component from '../Core/Component.js';
import DialogService from '../Services/DialogService.js';
import StorageService from '../Services/StorageService.js';

class ReglementForm extends Component {

    form;

    reglement;

    constructor(reglement) {
        super();
        this.name = 'form-reglement';

        this.reglement = reglement;

        this.storageService = new StorageService();
        this.dialogService = new DialogService();
    }


    valid(event) {
        const selector = `.${this.name} form`;
        const form = document.querySelector(selector);

        this.reglement.id = form.id.value;
        this.reglement.nom = form.nom.value;
        this.reglement.lien = form.lien.value;
        this.reglement.idUrba = form.idUrba.value;
        this.reglement.inseeCommune = form.inseeCommune.value;
        this.reglement.sirenIntercomm = form.sirenIntercomm.value;

        this.storageService.save(this.reglement);
        this.dialogService.close();
    }


    close(event) {
        this.dialogService.close();
    }


    getTemplate() {
        var nom = this.reglement.nom;
        if(nom == "Renseignez la fiche") {
            nom = "";
        }
        return `
            <h4>Modifier le reglement</h4>
            <form>
                <label for="id" class="hidden">Identifiant</label>
                <input type="string" value="${this.reglement.id}" id="id" class="hidden">
                <label for="nom">Nom du réglement</label>
                <input type="string" value="${nom}" id="nom" placeholder="PLU Ancenis">
                <label for="lien">Lien, ressource web ou GPU</label>
                <input type="string" value="${this.reglement.lien}" id="lien" placeholder="https://statics.teams.cdn.office.net/evergreen-assets/safelinks/1/atp-safelinks.html">
                <label for="idUrba">Identifiant d'urbanisme</label>
                <input type="string" value="${this.reglement.idUrba}" id="idUrba" placeholder="44003_PLU_20200224">
                <label for="inseeCommune">Code INSEE des communes concernées</label>
                <input type="string" value="${this.reglement.inseeCommune}" id="inseeCommune" placeholder="44003">
                <label for="sirenIntercomm">Code SIREN de l'intercommunalité</label>
                <input type="string" value="${this.reglement.sirenIntercomm}" id="sirenIntercomm">
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

}

export default ReglementForm;
