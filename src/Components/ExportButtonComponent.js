import Component from '../Core/Component.js';
import StorageService from '../Services/StorageService.js';

import XmlExport from '../Export/XmlExport.js';
import EditeurService from '../Services/EditeurService.js';

export class ExportButtonComponent extends Component {

    storageService;

    constructor() {
        super();
        this.name = 'export-btn';

        this.storageService = new StorageService();
        this.editeurService = new EditeurService();
    }

    export(event) {
        // save before export
        this.editeurService.actionSave();
        // export
        const exporter = new XmlExport();
        exporter.export(this.storageService.getReglement());
    }


    getTemplate() {
        return `
            <button title="Exporter un fichier .xml">Exporter</button>
        `;
    }


    registerEvents() {
        super.registerEvents();

        const loadSelector = `.${this.name} button`;
        document.querySelector(loadSelector).addEventListener('click', event => this.export(event));
    }

}

export default ExportButtonComponent;
