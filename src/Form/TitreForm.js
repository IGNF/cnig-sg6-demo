import { Subject } from 'rxjs';
import Component from '../Core/Component';
import DialogService from '../Services/DialogService';
import EditeurService from '../Services/EditeurService';
import StorageService from '../Services/StorageService';

class TitreForm extends Component {

    form;

    titre;

    onSave = new Subject();

    constructor(titre) {
        super();
        this.name = 'form-titre';

        this.titre = titre;

        this.storageService = new StorageService();
        this.dialogService = new DialogService();
        this.editeurService = new EditeurService();
    }


    valid(event) {
        const selector = `.${this.name} form`;
        const form = document.querySelector(selector);

        if (form.niveau.value === '') {
            alert("Le niveau du titre doit être renseigné");
            return;
        }

        this.titre.id =             form.id.value;
        this.titre.intitule =       form.intitule.value;
        this.titre.niveau =         parseInt(form.niveau.value);
        this.titre.numero =         parseInt(form.numero.value);
        this.titre.href =           form.href.value;
        this.titre.idZone =         form.idZone.value;
        this.titre.idPrescription = form.idPrescription.value;
        this.titre.inseeCommune =   form.inseeCommune.value;

        // save titre dans reglement
        const reglement = this.storageService.getReglement();
        const existing = reglement.getTitreById(this.titre.id);
        if (existing) {
            // mise à jour des attributs par copie
            // on en touche pas au children / contents
            reglement.updateTitre(this.titre);
        } else {
            // cas mise à jour pour les titre de niveau 1
            // les titres de niveau 2+ sont creer au parsing du document
            reglement.addTitre(this.titre);
        }
        
        this.onSave.next(this.titre);

        this.storageService.save(reglement);
        // reload metadata attribute
        this.editeurService.updateTitreNode(this.titre);

        this.close();
    }


    close(event) {
        this.dialogService.close();
    }


    getTemplate() {
        return `
            <h4>Modifier le Titre ${this.titre.niveau}</h4>
            <form>
                <label for="id">Identifiant</label>
                <input id="id" type="string" value="${this.titre.id || ''}" readonly>
                <label for="intitule">Intitulé</label>
                <input id="intitule" type="string" value="${this.titre.intitule || ''}">
                <label class="hidden" for="niveau">Niveau</label>
                <input class="hidden" id="niveau" type="number" value="${this.titre.niveau || 0}">
                <label for="numero">Numéro</label>
                <input id="numero" type="number" value="${this.titre.numero || 0}">
                <label for="href">Lien interne</label>
                <input id="href" type="string" value="${this.titre.href || ''}">
                <label for="idZone">Zone (U, Ua, ect.)</label>
                <input id="idZone" type="string" value="${this.titre.idZone || ''}">
                <label for="idPrescription">Identifiant de prescription si nécessaire</label>
                <input id="idPrescription" type="string" value="${this.titre.idPrescription || ''}">
                <label for="inseeCommune">Code INSEE des communes concernées</label>
                <input id="inseeCommune" type="string" value="${this.titre.inseeCommune || ''}">
            </form>
            <div class="form-action">
                <div class="separator"></div>
                <button class="btn-valid">Mettre à jour / Créer le titre</button>
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
