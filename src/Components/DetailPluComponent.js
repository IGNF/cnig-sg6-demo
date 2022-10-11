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
        console.log('openForm', event);
        const form = new ReglementForm(this.reglement);

        this.dialogService.open(form);
    }


    getTemplate() {
        if (!this.reglement) {
            return 'detail-plu';
        }
        return `
            <div class="app-card">
                <div class="app-header">
                    <h2>${this.reglement.nom}</h2>
                </div>
                <div class="app-content">
                    <ul>
                        <li>id: ${this.reglement.id}</li>
                        <li>nom: ${this.reglement.nom}</li>
                        <li>lien: ${this.reglement.lien}</li>
                        <li>idUrba: ${this.reglement.idUrba}</li>
                        <li>typeDoc: ${this.reglement.typeDoc}</li>
                    </ul>
                </div>
                <button class="btn-update">Modifier</button>
            </div>
        `;
    }

    registerEvents() {
        const selector = `.${this.name} button`;
        document.querySelector(selector)?.addEventListener('click', event => this.openForm(event));
    }

}

export default DetailPluComponent;
