import Component from '../Core/Component';
import Reglement from '../Model/Reglement';

import DetailPluComponent from '../Components/DetailPluComponent';
import ListTitresComponent from '../Components/ListTitresComponent';
import StorageService from '../Services/StorageService';

export class HomePage extends Component {

    detailPlu;

    listTitres;

    storageService;

    constructor(reglement = null) {
        super();
        this.name = 'home-page';

        this.init(reglement);

        this.storageService = new StorageService();
    }


    init(reglement = null) {

        this.detailPlu = new DetailPluComponent(reglement);
        this.listTitres = new ListTitresComponent(reglement);
    }

    save() {
        console.log('save');
    }
    load() {
        console.log('load');
    }
    export() {
        console.log('export');

    }


    getTemplate() {
        return `
            <div class="app-home">
                <h2>Home</h2>
                ${this.detailPlu?.getElement().outerHTML}
                ${this.listTitres?.getElement().outerHTML}
                <div class="app-button">
                    <button class="btn-save">Sauvegarde</button>
                    <button class="btn-load">Chargement</button>
                    <button class="btn-export">Export</button>
                </div>
            </div>
        `;
    }


    registerEvents() {
        super.registerEvents();

        this.detailPlu.registerEvents();
        this.listTitres.registerEvents();

        const saveSelector = `.${this.name} .btn-save`;
        document.querySelector(saveSelector)?.addEventListener('click', event => this.save(event));

        const loadSelector = `.${this.name} .btn-load`;
        document.querySelector(loadSelector)?.addEventListener('click', event => this.load(event));

        const exportSelector = `.${this.name} .btn-export`;
        document.querySelector(exportSelector)?.addEventListener('click', event => this.export(event));
    }

}

export default HomePage;
