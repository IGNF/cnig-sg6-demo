import Component from '../Core/Component';
import DialogService from '../Services/DialogService';
import StorageService from '../Services/StorageService';

class TitreForm extends Component {

    form;

    titre;

    constructor(titre) {
        super();
        this.name = 'form-titre';

        this.titre = titre;

        this.storageService = new StorageService();
        this.dialogService = new DialogService();
    }


    valid(event) {
        const selector = `.${this.name} form`;
        const form = document.querySelector(selector);

        this.titre.id =             form.id.value;
        this.titre.intitule =       form.intitule.value;
        this.titre.niveau =         form.niveau.value;
        this.titre.numero =         form.numero.value;
        this.titre.href =           form.href.value;
        this.titre.idZone =         form.idZone.value;
        this.titre.idPrescription = form.idPrescription.value;
        this.titre.inseeCommune =   form.inseeCommune.value;

        // save titre dans reglement
        const reglement = this.storageService.getReglement();
        if (!reglement.getTitreById(form.id.value)) {
            reglement.titres.push(this.titre);
        }
        
        this.storageService.save(reglement);
        this.dialogService.close();
    }


    close(event) {
        this.dialogService.close();
    }


    getTemplate() {
        return `
            <h4>Modifier le reglement</h4>
            <form>
                <label for="id">id</label>
                <input id="id" type="string" value="${this.titre.id || ''}">
                <label for="intitule">intitule</label>
                <input id="intitule" type="string" value="${this.titre.intitule || ''}">
                <label for="niveau">niveau</label>
                <input id="niveau" type="string" value="${this.titre.niveau || ''}">
                <label for="numero">numero</label>
                <input id="numero" type="string" value="${this.titre.numero || ''}">
                <label for="href">href</label>
                <input id="href" type="string" value="${this.titre.href || ''}">
                <label for="idZone">idZone</label>
                <input id="idZone" type="string" value="${this.titre.idZone || ''}">
                <label for="idPrescription">idPrescription</label>
                <input id="idPrescription" type="string" value="${this.titre.idPrescription || ''}">
                <label for="inseeCommune">inseeCommune</label>
                <input id="inseeCommune" type="string" value="${this.titre.inseeCommune || ''}">
            </form>
            <div class="form-action">
                <button class="btn-valid">Valider</button>
                <button class="btn-close">Annuler</button>
            </div>
        `;
    }


    registerEvents() {
        const validSelector = `.${this.name} .btn-valid`;
        document.querySelector(validSelector).addEventListener('click', event => this.valid(event));

        const closeSelector = `.${this.name} .btn-close`;
        document.querySelector(closeSelector).addEventListener('click', event => this.close(event));
    }

}

export default TitreForm;
