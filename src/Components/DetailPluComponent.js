import Component from '../Core/Component';

export class DetailPluComponent extends Component {

    constructor(reglement) {
        super();
        this.name = 'detail-plu';
        
        this.init(reglement);
    }

    init(reglement = null) {
        this.reglement = reglement;
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
            </div>
        `;
    }

}

export default DetailPluComponent;
