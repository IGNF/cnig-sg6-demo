import Component from '../Core/Component';
import StorageService from '../Services/StorageService';

import Reglement from '../Model/Reglement';

export class NouveauButtonComponent extends Component {

    storageService;

    constructor() {
        super();
        this.name = 'new-btn';

        this.storageService = new StorageService();
    }

    newReglement(event) {
        const reglement = new Reglement();
        this.storageService.save(reglement);
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
