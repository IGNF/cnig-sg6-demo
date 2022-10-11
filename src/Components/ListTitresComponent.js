import Component from '../Core/Component';
import Reglement from '../Model/Reglement';

import EditTitreComponent from './EditTitreComponent';

import StorageService from '../Services/StorageService';
import TitreForm from '../Form/TitreForm';
import DialogService from '../Services/DialogService';
import Titre from '../Model/Titre';

export class ListTitresComponent extends Component {

    reglement;

    editTitre;

    storageService;

    constructor(reglement) {
        super();
        this.name = 'list-titres';

        this.init(reglement);

        this.storageService = new StorageService();
        this.dialogService = new DialogService();
    }


    init(reglement = null) {
        this.reglement = reglement;
        this.editTitre = new EditTitreComponent();
    }


    add(event) {
        const form = new TitreForm(new Titre());
        this.dialogService.open(form);
    }


    update(event) {
        const id = event.target.getAttribute('idtitle');
        const reglement = this.storageService.getReglement();
        const titre = reglement.getTitreById(id);

        const form = new TitreForm(titre);
        this.dialogService.open(form);
    }


    delete(event) {
        const id = event.target.getAttribute('idtitle');
        const reglement = this.storageService.getReglement();

        reglement.removeTitre(id);
        this.storageService.save(reglement);
    }


    openEditor(event) {

    }


    getTemplate() {
        if (!this.reglement) {
            return 'list-titres';
        }
        function listFromTitle(title) {
            if (title.niveau > 1) {
                return '';
            }
            let sublist = '';
            if (title.children && title.children.length > 0) {
                sublist = title.children.map(subtitle => listFromTitle(subtitle)).join('');
            }
            return `
                <li id="${title.id}"
                    niveau="${title.niveau}"
                    class="list-item">
                    ${title.intitule}
                    <span class="separator"></span>
                    <button idtitle="${title.id}" class="btn-update">Modifier</button>
                    <button idtitle="${title.id}" class="btn-delete">Supprimer</button>
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
                    <button class="btn-add">Ajouter</button>
                </div>
                ${this.editTitre?.getElement().innerHTML}
            </div>
        `;
        return template;
    }


    registerEvents() {
        super.registerEvents();
        
        const clickSelector = `.${this.name} .list-item`;
        const listItem = Array.from(document.querySelectorAll(clickSelector));
        listItem.forEach((item) => {
            item.addEventListener('click', event => this.openEditor(event));
        });

        const updateSelector = `.${this.name} .list-item .btn-update`;
        const updateButtons = Array.from(document.querySelectorAll(updateSelector));
        updateButtons.forEach((item) => {
            item.addEventListener('click', event => this.update(event));
        });

        const deleteSelector = `.${this.name} .list-item .btn-delete`;
        const deleteButtons = Array.from(document.querySelectorAll(deleteSelector));
        deleteButtons.forEach((item) => {
            item.addEventListener('click', event => this.delete(event));
        });

        const addSelector = `.${this.name} .btn-add`;
        document.querySelector(addSelector)?.addEventListener('click', event => this.add(event));
    }

}

export default ListTitresComponent;
