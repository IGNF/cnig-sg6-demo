import Component from '../Core/Component';

import DetailPluComponent from '../Components/DetailPluComponent';
import ListTitresComponent from '../Components/ListTitresComponent';
import LoadButtonComponent from '../Components/LoadButtonComponent';
import ExportButtonComponent from '../Components/ExportButtonComponent';

import StorageService from '../Services/StorageService';
import NouveauButtonComponent from '../Components/NouveauButtonComponent';
import DialogService from '../Services/DialogService';

export class HomePage extends Component {

    components = [];

    storageService;

    dialogService;

    constructor(reglement = null) {
        super();
        this.name = 'home-page';

        this.init(reglement);

        this.dialogService = new DialogService();
        this.storageService = new StorageService();
    }


    init(reglement = null) {

        this.components = [
            new DetailPluComponent(reglement),
            new ListTitresComponent(reglement),
            new NouveauButtonComponent(),
            new LoadButtonComponent(),
            new ExportButtonComponent()
        ];
    }


    change(reglement = null) {

        this.refreshComponent('detail-plu', reglement, DetailPluComponent);
        this.refreshComponent('list-titres', reglement, ListTitresComponent);
    }


    refreshComponent(name, reglement, componentClass) {
        // remove
        const index = this.components.findIndex(c => c.name === name);
        const component = this.components.splice(index, 1)[0];
        const selector = `.${this.name} .${component.name}`;
        const element = document.querySelector(selector);
        const parent = element.parentNode;
        element.remove();

        // add
        const newComponent = new componentClass(reglement);
        this.components.push(newComponent);
        parent.appendChild(newComponent.getElement());
        newComponent.registerEvents();
    }


    getTemplate() {
        return `
            <div class="toolbar">
                <div class="toolbar-title">
                    <h1>Plu:ReglementDU</h1>
                    <p>Outils d'export de réglement d'urbanisme au format CNIG/XML</p>
                </div>
                <div class="separator"></div>
                ${this.components.find(c => c.name === 'new-btn')?.getElement().outerHTML}
                ${this.components.find(c => c.name === 'load-btn')?.getElement().outerHTML}
                ${this.components.find(c => c.name === 'export-btn')?.getElement().outerHTML}
            </div>
            <div class="app-home-content">
                ${this.components.find(c => c.name === 'detail-plu')?.getElement().outerHTML}
                ${this.components.find(c => c.name === 'list-titres')?.getElement().outerHTML}
            </div>
            <div class="app-content-editor">
                <textarea id="app-tinymce"></textarea>
            </div>
        `;
    }


    registerEvents() {
        super.registerEvents();

        this.components.forEach((component) => {
            component.registerEvents();
        });


        document.addEventListener('keyup', (event) => {
            if (event.key == 'Escape') {
                this.dialogService.close();
            }
        });
    }

}

export default HomePage;
