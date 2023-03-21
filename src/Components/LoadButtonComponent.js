import Component from '../Core/Component.js';
import StorageService from '../Services/StorageService.js';

import XmlImport from '../Import/XmlImport.js';
import EditeurService from '../Services/EditeurService.js';

export class LoadButtonComponent extends Component {

    storageService;

    constructor() {
        super();
        this.name = 'load-btn';

        this.storageService = new StorageService();
        this.editeurService = new EditeurService();
    }

    loadFile(event) {
        if (event.target.files.length !== 1) {
            console.error('no file selected');
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target.result;

            const loader = new XmlImport();
            const reglement = loader.load(result);
            this.storageService.save(reglement);

            this.editeurService.setContent('');
            this.editeurService.toggleEditorMode();
        }
        reader.readAsText(event.target.files[0]);
    }

    getTemplate() {
        return `
            <button title="Importer un fichier .xml">Importer</button>
            <form class="load-form" style="display: none;">
                <input type="file" id="input" accept=".xml"/>
            </form>
        `;
    }

    registerEvents() {
        super.registerEvents();

        const selector = `.${this.name} #input`;
        document.querySelector(selector).addEventListener('change', event => this.loadFile(event));

        const loadSelector = `.${this.name} button`;
        document.querySelector(loadSelector).addEventListener('click', (event) => {
            document.querySelector(selector).click();
        });
    }

}

export default LoadButtonComponent;
