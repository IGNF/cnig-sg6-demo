import Component from '../Core/Component';
import Titre from '../Model/Titre';

export class EditTitreComponent extends Component {

    titre;

    constructor(titre) {
        super();
        this.name = 'edit-titre';

        this.init(titre);
    }

    init(titre) {
        this.titre = titre;
    }

    getTemplate() {
        if (!this.titre) {
            return '<div>edit-titre</div>';
        }

        return '<div>edit-titre</div>';
    }

}

export default EditTitreComponent;
