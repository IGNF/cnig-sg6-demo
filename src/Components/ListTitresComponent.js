import Component from '../Core/Component';
import TitreForm from '../Form/TitreForm';

import Titre from '../Model/Titre';

import StorageService from '../Services/StorageService';
import DialogService from '../Services/DialogService';
import EditeurService from '../Services/EditeurService';

export class ListTitresComponent extends Component {

    reglement;

    storageService;

    editeur;

    constructor(reglement) {
        super();
        this.name = 'list-titres';

        this.init(reglement);

        this.storageService = new StorageService();
        this.dialogService = new DialogService();
        this.editeurService = new EditeurService();
    }


    init(reglement = null) {
        this.reglement = reglement;
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
        const id = event.target.getAttribute('idtitle');

        const reglement = this.storageService.getReglement();
        const titre = reglement.getTitreById(id);

        this.editeurService.setContent(titre.toHtml(), { format: 'raw' });
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
            return '';
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
                    <p class="separator" idtitle="${title.id}">${title.intitule}</p>
                    <button idtitle="${title.id}" class="btn-update">Modifier</button>
                    <button idtitle="${title.id}" class="btn-delete">Supprimer</button>
                    <ul>${sublist}</ul>
                </li>
            `;
        }
        const content = this.reglement.titres.map(title => listFromTitle(title)).join('');

        const template = `
            <div class="app-card">
                <div class="app-card-header">
                    <h2>Liste des titres</h2>
                    <div class="separator"></div>
                    <button class="btn-reduce">Reduire</buttton>
                </div>
                <div class="app-card-content">
                    <p>
                        Gérer la liste des titres.
                        Clicker sur un titre pour modifier le contenu
                    </p>
                    <ul>${content}</ul>
                    <button class="btn-add">Ajouter</button>
                </div>
            </div>
        `;
        return template;
    }


    registerEvents() {
        super.registerEvents();

        // add Editor
        this.editeurService.init('app-tinymce');
        
        const clickSelector = `.${this.name} .list-item p`;
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

        const selectorReduce = `.${this.name} button.btn-reduce`;
        document.querySelector(selectorReduce)?.addEventListener('click', event => this.reduce(event));
    }

}

export default ListTitresComponent;
