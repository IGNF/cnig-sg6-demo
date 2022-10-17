import Component from '../Core/Component';
import Reglement from '../Model/Reglement';

import DetailPluComponent from '../Components/DetailPluComponent';
import ListTitresComponent from '../Components/ListTitresComponent';
import LoadButtonComponent from '../Components/LoadButtonComponent';
import StorageService from '../Services/StorageService';
import ExportButtonComponent from '../Components/ExportButtonComponent';

export class HomePage extends Component {

    components = [];

    storageService;

    constructor(reglement = null) {
        super();
        this.name = 'home-page';

        this.init(reglement);

        this.storageService = new StorageService();
    }


    init(reglement = null) {

        this.components = [
            new DetailPluComponent(reglement),
            new ListTitresComponent(reglement),
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
            <div class="app-home">
                <div class="toolbar">
                    <div class="toolbar-title">
                        <h1>Plu:ReglementDU</h1>
                        <p>Outils d'export de PLU au format XML CNIG</p>
                    </div>
                    <div class="separator"></div>
                    ${this.components.find(c => c.name === 'load-btn')?.getElement().outerHTML}
                    ${this.components.find(c => c.name === 'export-btn')?.getElement().outerHTML}
                </div>
                <div>
                    ${this.components.find(c => c.name === 'detail-plu')?.getElement().outerHTML}
                    ${this.components.find(c => c.name === 'list-titres')?.getElement().outerHTML}
                </div>
                <!--
                <div class="app-content-editor">
                    <textarea id="app-tinymce"></textarea>
                </div>
                -->
            </div>
        `;
    }


    registerEvents() {
        super.registerEvents();

        this.components.forEach((component) => {
            component.registerEvents();
        });
    }

}

export default HomePage;
