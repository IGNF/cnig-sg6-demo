import Component from '../Core/Component';
import StorageService from '../Services/StorageService';

import XmlExport from '../Export/XmlExport';

export class ExportButtonComponent extends Component {

    storageService;

    constructor() {
        super();
        this.name = 'export-btn';

        this.storageService = new StorageService();
    }

    export(event) {
        const exporter = new XmlExport();
        exporter.export(this.storageService.getReglement());
    }


    getTemplate() {
        return `
            <button>Exporter</button>
        `;
    }


    registerEvents() {
        super.registerEvents();

        const loadSelector = `.${this.name} button`;
        document.querySelector(loadSelector).addEventListener('click', event => this.export(event));
    }

}

export default ExportButtonComponent;
