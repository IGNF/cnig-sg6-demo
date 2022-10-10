import HomePage from './Pages/HomePage';
import XmlImport from './Import/XmlImport';

import StorageService from './Services/StorageService';
import { map } from 'rxjs';

export class App {

    rootElement;

    rootComponent;

    storageService;


    constructor() {
        // load from localstorage at opening
        setTimeout(() => {
            this.storageService.loadFromLocalStorage();
        }, 200);

        this.storageService = new StorageService();

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
        if (this.rootComponent) {
            this.rootComponent.removeAll();
        }
        const component = new HomePage(reglement);
        this.rootElement.appendChild(component.getElement());
        component.registerEvents();
        this.rootComponent = component;
    }


}

export default App;
