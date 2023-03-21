import Component from '../Core/Component.js';

import EditeurService from '../Services/EditeurService.js';

export class SaveButtonComponent extends Component {

    storageService;

    constructor() {
        super();
        this.name = 'save-btn';

        this.editeurService = new EditeurService();
    }

    save(event) {
        // save current editor
        this.editeurService.actionSave();
    }

    getTemplate() {
        return `
            <button title="Sauvegarder le travail en cours">Sauvegarder</button>
        `;
    }

    registerEvents() {
        super.registerEvents();

        const selector = `.${this.name} button`;
        document.querySelector(selector).addEventListener('click', event => this.save(event));
    }

}

export default SaveButtonComponent;
