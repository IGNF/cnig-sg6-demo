import Component from '../Core/Component.js';
import StorageService from '../Services/StorageService.js';

import Reglement from '../Model/Reglement.js';
import EditeurService from '../Services/EditeurService.js';
export class NouveauButtonComponent extends Component {

    storageService;

    constructor() {
        super();
        this.name = 'new-btn';

        this.storageService = new StorageService();
        this.editeurService = new EditeurService();
    }

    newReglement(event) {
        if(confirm("Attention, si vous n'avez pas exporté votre travail, celui-ci va être perdu. Êtes-vous sûr de vouloir continuer ?")) {
            const reglement = new Reglement();
            this.storageService.save(reglement);

            this.editeurService.setContent('');
            this.editeurService.toggleEditorMode();
            document.getElementsByClassName("btn-update")[0].click();
            
        } else {
            return;
        }
        // const reglement = new Reglement();
        // this.storageService.save(reglement);

        // this.editeurService.setContent('');
        // this.editeurService.toggleEditorMode();
    }

    getTemplate() {
        return `
            <button title="Créer un nouveau règlement d'urbanisme">Nouveau</button>
        `;
    }

    registerEvents() {
        super.registerEvents();

        const selector = `.${this.name} button`;
        document.querySelector(selector).addEventListener('click', event => this.newReglement(event));
    }

}

export default NouveauButtonComponent;
