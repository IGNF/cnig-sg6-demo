import HomePage from './Pages/HomePage.js';

import StorageService from './Services/StorageService.js';

import { map } from 'rxjs';

export class App {

    rootElement;

    storageService;

    component;

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
