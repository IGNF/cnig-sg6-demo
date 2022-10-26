import Component from '../Core/Component';
import StorageService from '../Services/StorageService';

import XmlImport from '../Import/XmlImport';
import EditeurService from '../Services/EditeurService';

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
        }
        reader.readAsText(event.target.files[0]);
    }

    getTemplate() {
        return `
            <button>Charger</button>
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
