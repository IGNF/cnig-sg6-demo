import Component from '../Core/Component';
import StorageService from '../Services/StorageService';

import Reglement from '../Model/Reglement';
import EditeurService from '../Services/EditeurService';

export class NouveauButtonComponent extends Component {

    storageService;

    constructor() {
        super();
        this.name = 'new-btn';

        this.storageService = new StorageService();
        this.editeurService = new EditeurService();
    }

    newReglement(event) {
        const reglement = new Reglement();
        this.storageService.save(reglement);

        this.editeurService.setContent('');
    }

    getTemplate() {
        return `
            <button>Nouveau</button>
        `;
    }

    registerEvents() {
        super.registerEvents();

        const selector = `.${this.name} button`;
        document.querySelector(selector).addEventListener('click', event => this.newReglement(event));
    }

}

export default NouveauButtonComponent;
