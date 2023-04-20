import Component from '../Core/Component.js';
import ReglementForm from '../Form/ReglementForm.js';

import DialogService from '../Services/DialogService.js';

export class DetailPluComponent extends Component {

    constructor(reglement) {
        super();
        this.name = 'detail-plu';
        
        this.init(reglement);

        this.dialogService = new DialogService();
    }

    init(reglement = null) {
        this.reglement = reglement;
    }


    openForm(event) {
        const form = new ReglementForm(this.reglement);

        this.dialogService.open(form);
    }


    reduce(event) {
        const selector = `.${this.name} .app-card-content`;
        const element = document.querySelector(selector);
        if (element.classList.contains('app-content-reduce')) {
            element.classList.remove('app-content-reduce');
        } else {
            element.classList.add('app-content-reduce');
        }
    }


    getTemplate() {
        if (!this.reglement) {
            return `
                <div class="app-card">
                    <p>Charger un fichier XML ou démarrer un nouveau document</p>
                </div>
            `;
        }
        return `
            <div class="app-card">
                <div class="app-card-header">
                    <h2>${this.reglement.nom}</h2>
                    <div class="separator"></div>
                    <button class="btn-update">Renseigner</button>
                    <button class="btn-reduce">Réduire</buttton>
                </div>
                <div class="app-card-content">
                    <p>${this.reglement.idUrba}</p>
                    <p class="${this.reglement.lien != '' ? '' : 'hidden'}">
                        Consultez le <a href="${this.reglement.lien}" target="_blanck">règlement</a> sur le Géoportail de l'Urbanisme
                    </p>
                </div>
            </div>
        `;
    }

    registerEvents() {
        const selector = `.${this.name} button.btn-update`;
        document.querySelector(selector)?.addEventListener('click', event => this.openForm(event));

        const selectorReduce = `.${this.name} button.btn-reduce`;
        document.querySelector(selectorReduce)?.addEventListener('click', event => this.reduce(event));
    }

}

export default DetailPluComponent;
