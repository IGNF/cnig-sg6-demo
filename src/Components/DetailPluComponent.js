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
                </div>
                <div class="app-content">
                    <p>${this.reglement.typeDoc}</p>
                    <p>${this.reglement.idUrba}</p>
                    <p>
                        Document disponible sur le géoportail de l'urbanisme
                        <a href="${this.reglement.lien}" target="_blanck">ici</a>
                    </p>
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
