import Component from '../Core/Component';

import StorageService from '../Services/StorageService';
import TitreForm from '../Form/TitreForm';
import DialogService from '../Services/DialogService';
import Titre from '../Model/Titre';
import Editeur from '../Core/Editeur';
import tinymce from 'tinymce';

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

        const editor = tinymce.activeEditor;
        editor.setContent(titre.getHtmlContent());
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
                    <p idtitle="${title.id}">${title.intitule}</p>
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
                    <h2>Liste des titres</h2>
                    <p>
                        Gérer la liste des titres.
                        Clicker sur un titre pour modifier le contenu
                    </p>
                </div>
                <div class="app-content">
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
        this.editeur = new Editeur();
        this.editeur.init('app-tinymce');
        
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
    }

}

export default ListTitresComponent;
