import HomePage from './Pages/HomePage';
import XmlImport from './Import/XmlImport';

import StorageService from './Services/StorageService';
import HtmlConverterService from './Services/HtmlConverterService';

import { map } from 'rxjs';

export class App {

    rootElement;

    storageService;

    component;

    constructor() {
        // load from localstorage at opening
        setTimeout(() => {
            this.storageService.loadFromLocalStorage();
            // toFlatHTML
            const titre = this.storageService.getReglement().titres[1];
            const flatHTML = titre.toHtml();
            console.log('flatHTML');
            console.log(flatHTML);
            // parse flatHTML
            const newTitre = this.htmlConverterService.createTitre(flatHTML);
            console.log(newTitre.toHtml());
            // to XML
            // console.log(newTitre.toXml());
            console.log('must be true', newTitre.toHtml() == titre.toHtml());
        }, 200);

        this.storageService = new StorageService();

        this.htmlConverterService = new HtmlConverterService();

        this.storageService.change.pipe(
            map(reglement => this.change(reglement))
        ).subscribe();
    }


    appendToHTML(htmlSelector) {
        const element = document.getElementById(htmlSelector);
        if (!element) {
            throw new Error(`Impossible de trouver ${htmlSelector}`);
        }
        this.rootElement = element;
        this.change();
    }


    change(reglement = null) {
        if (this.component) {
            this.component.change(reglement);
            return;
        }
        this.component = new HomePage(reglement);
        this.rootElement.appendChild(this.component.getElement());
        this.component.registerEvents();
    }


}

export default App;
