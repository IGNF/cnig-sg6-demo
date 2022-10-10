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


    getTemplate() {
        return `
            <div class="app-home">
                <h2>Home</h2>
                ${this.components.find(c => c.name === 'detail-plu')?.getElement().outerHTML}
                ${this.components.find(c => c.name === 'list-titres')?.getElement().outerHTML}
                <div class="app-button">
                    ${this.components.find(c => c.name === 'load-btn')?.getElement().outerHTML}
                    ${this.components.find(c => c.name === 'export-btn')?.getElement().outerHTML}
                </div>
            </div>
        `;
    }


    registerEvents() {
        super.registerEvents();

        this.components.forEach((component) => {
            component.registerEvents();
        });

        const saveSelector = `.${this.name} .btn-save`;
        document.querySelector(saveSelector)?.addEventListener('click', event => this.save(event));

        const exportSelector = `.${this.name} .btn-export`;
        document.querySelector(exportSelector)?.addEventListener('click', event => this.export(event));
    }

}

export default HomePage;
