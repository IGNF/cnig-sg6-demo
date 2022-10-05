import Component from '../Core/Component';
import Reglement from '../Model/Reglement';

import EditTitreComponent from './EditTitreComponent';

export class ListTitresComponent extends Component {

    reglement;

    editTitre;

    constructor(reglement) {
        super();
        this.name = 'list-titres';

        this.init(reglement);
    }

    init(reglement = null) {
        this.reglement = reglement;

        this.editTitre = new EditTitreComponent();
    }


    ouiche() {
        console.log('on dit ouiche lorraine');
    }


    getTemplate() {
        if (!this.reglement) {
            return 'list-titres';
        }
        function baba() {
            this.ouiche();
        }
        function listFromTitle(title) {
            if (title.niveau > 2) {
                return '';
            }
            let sublist = '';
            if (title.children && title.children.length > 0) {
                sublist = title.children.map(subtitle => listFromTitle(subtitle)).join('');
            }
            return `
                <li id="${title.id}
                    niveau="${title.niveau}"
                    class="list-item"
                    onClick="baba()">
                    ${title.intitule}
                    <ul>${sublist}</ul>
                </li>
            `;
        }
        const content = this.reglement.titres.map(title => listFromTitle(title)).join('');

        const template = `
            <div class="app-card">
                <div class="app-header">
                    <h2>Sommaire</h2>
                </div>
                <div class="app-content">
                    <ul>${content}</ul>
                </div>
                ${this.editTitre?.getElement().innerHTML}
            </div>
        `;
        return template;
    }

}

export default ListTitresComponent;
