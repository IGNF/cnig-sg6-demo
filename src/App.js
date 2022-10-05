import HomePage from './Pages/HomePage';
import XmlImport from './Import/XmlImport';

export class App {

    rootElement;

    rootComponent;

    constructor() {
        this.loadFromLocalStorage();

        setTimeout(() => {
            this.loadFromXML();
        }, 200);
    }


    loadFromLocalStorage() {
        console.log('loadFromLocalStorage', localStorage);
    }


    loadFromXML() {
        console.log('loadFromXML');

        const loader = new XmlImport();
        const reglement = loader.load();

        this.change(reglement);
    }


    init(htmlSelector) {
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
        this.rootComponent = component;
    }


}

export default App;
