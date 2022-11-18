import { Subject } from 'rxjs';
import Reglement from '../Model/Reglement.js';

class StorageService {

    reglement;

    change = new Subject();

    constructor() {
        if (StorageService.instance) {
            return StorageService.instance;
        }
        StorageService.instance = this;
    }

    save(reglement) {
        this.reglement = reglement;
        this.saveToLocalStorage();
        this.change.next(this.reglement);
    }

    saveToLocalStorage() {
        localStorage.setItem('reglement', JSON.stringify(this.reglement));
    }

    loadFromLocalStorage() {
        if (localStorage.getItem('reglement')) {
            this.reglement = new Reglement().unserialise(JSON.parse(localStorage.getItem('reglement')));
        }

        this.change.next(this.reglement);
    }

    setReglement(reglement) {
        this.reglement = reglement;
    }

    getReglement() {
        return this.reglement;
    }

}

// export new singleton
export default StorageService;
