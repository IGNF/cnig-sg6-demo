import Component from '../Core/Component';
import Reglement from '../Model/Reglement';

import DetailPluComponent from '../Components/DetailPluComponent';
import ListTitresComponent from '../Components/ListTitresComponent';

export class HomePage extends Component {

    detailPlu;
    listTitres;

    constructor(reglement = null) {
        super();
        this.name = 'home-page';

        this.init(reglement);
    }


    init(reglement = null) {

        this.detailPlu = new DetailPluComponent(reglement);
        this.listTitres = new ListTitresComponent(reglement);
    }


    getTemplate() {
        return `
            <div class="app-home">
                <h2>Home</h2>
                ${this.detailPlu?.getElement().innerHTML}
                ${this.listTitres?.getElement().innerHTML}
            </div>
        `;
    }

}

export default HomePage;
