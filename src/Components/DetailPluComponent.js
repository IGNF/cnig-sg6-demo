import Component from '../Core/Component';
import ReglementForm from '../Form/ReglementForm';

import DialogService from '../Services/DialogService';

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
        const selector = `.${this.name} .app-content`;
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
                <div class="app-header">
                    <h2>${this.reglement.nom}</h2>
                    <div class="separator"></div>
                    <button class="btn-reduce">Reduire</buttton>
                </div>
                <div class="app-content">
                    <p>${this.reglement.typeDoc}</p>
                    <p>${this.reglement.idUrba}</p>
                    <p>
                        Document disponible sur le géoportail de l'urbanisme
                        <a href="${this.reglement.lien}" target="_blanck">ici</a>
                    </p>
                    <button class="btn-update">Modifier</button>
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
