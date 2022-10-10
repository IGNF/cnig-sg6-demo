import Component from '../Core/Component';
import StorageService from '../Services/StorageService';

import XmlImport from '../Import/XmlImport';

export class LoadComponent extends Component {

    storageService;

    constructor() {
        super();
        this.name = 'load-btn';

        this.storageService = new StorageService();
    }

    loadFile(event) {
        console.log('loadfile', event);
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
        }
        reader.readAsText(event.target.files[0]);
    }

    getTemplate() {
        return `
            <div class="card">
                <form class="load-form">
                    <button class="btn-load">Charger</button>
                    <input style="display: none;" value="Charger" type="file" id="input" accept=".xml"/>
                </form>
            </div>
        `;
    }

    registerEvents() {
        super.registerEvents();

        const selector = `.${this.name} #input`;
        document.querySelector(selector).addEventListener('change', event => this.loadFile(event));

        const loadSelector = `.${this.name} .btn-load`;
        document.querySelector(loadSelector).addEventListener('click', (event) => {
            // stop form
            event.preventDefault();
            document.querySelector(selector).click();
        });
    }

}

export default LoadComponent;
