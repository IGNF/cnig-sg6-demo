import Component from '../Core/Component.js';
import TitreForm from '../Form/TitreForm.js';

import Titre from '../Model/Titre.js';

import StorageService from '../Services/StorageService.js';
import DialogService from '../Services/DialogService.js';
import EditeurService from '../Services/EditeurService.js';

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

    display(event) {
        if(event.originalTarget.classList.contains("chevron-up")) {
            event.originalTarget.classList.replace("chevron-up", "chevron-down");
            event.originalTarget.innerHTML = "&#8964;";
        } else {
            event.originalTarget.classList.replace("chevron-down", "chevron-up");
            event.originalTarget.innerHTML= "&#8963;";
        }

        var id = event.originalTarget.parentElement.getAttribute("id");
        var niveau = event.originalTarget.parentElement.getAttribute("niveau");
        var liste =  event.originalTarget.parentElement.parentElement.children;

        var test = false;
        for(var i in liste) {
            if(!liste[i].getAttribute) {
                return;
            }
            if(test && liste[i].getAttribute("niveau") <= niveau) {
                test = false;
            }
            if(test && liste[i].getAttribute("niveau") > niveau) {
                liste[i].classList.toggle("hidden" + niveau);
            }
            if(liste[i].getAttribute("id") == id){
                test = true;
            } 
        }
    }


    add(event) {
        this.editeurService.actionSave();
        this.editeurService.setContent("");
        const newTitre = new Titre();
        newTitre.niveau = 1;
        const form = new TitreForm(newTitre);
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

        var c = this.editeurService.getContent();
        
        if(c){
            if(c.match(/^<div/)) {
                c = c.replace(/^<div/, "<h" + titre.niveau);
                c = c.replace(/<\/div/, "</h" + titre.niveau);
            }
            if(c.match(/^<p/)) {
                c = c.replace(/^<p/, "<h" + titre.niveau);
                c = c.replace(/<\/p/, "</h" + titre.niveau);
            }
            console.log(c);
            console.log(titre);
            if(!c.match("data-id")) {
                c = c.replace(/<h[0-9]/, '<h' + titre.niveau + ' data-id="' + titre.id + '" data-href="' + titre.href + '" data-idzone="' + titre.idZone + '" data-idprescription="'
                                              + titre.idPrescription + '" data-intitule="' + titre.intitule + '" data-niveau="' + titre.niveau + '" data-numero="' + titre.numero + '"');
            }
            if(!c.match(id)) {
                c = c.replace(c.match(/idContenu[0-9]+/)[0], id);
            }
            this.editeurService.setContent(c);
        }
        this.editeurService.actionSave();
        // open editor
        const newTitre = reglement.getTitreById(id);
        this.editeurService.loadTitle(newTitre);
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
            let sublist = '';
            if (title.children && title.children.length > 0) {
                sublist = title.children.map(subtitle => listFromTitle(subtitle)).join('');
            }
            const buttonPart = `
                <button idtitle="${title.id}" class="btn-update">Modifier</button>
                <button idtitle="${title.id}" class="btn-delete">Supprimer</button>
            `;

            var chevron = `<div class="btn-display chevron-up hidden">&#8963;</div>`;

            return `
                <li id="${title.id}"
                    niveau="${title.niveau}"
                    class="list-item">
                    <p class="separator" idtitle="${title.id}">${title.intitule}</p>
                    ${chevron}${buttonPart}
                    <ul>${sublist}</ul>
                </li>
            `;
        }
        const content = this.reglement.titres.map(title => listFromTitle(title)).join('');

        const template = `
            <div class="app-card">
                <div class="app-card-header">
                    <h2>Sommaire</h2>
                    <div class="separator"></div>
                    <button class="btn-add">Ajouter</button>
                    <button class="btn-reduce">Reduire</buttton>
                </div>
                <div class="app-card-content">
                    <p>
                        Gérer la liste des titres.
                        Cliquer sur un titre pour modifier le contenu.
                    </p>
                    <ul id="title-list">${content}</ul>
                </div>
            </div>
        `;
        return template;
    }


    registerEvents() {
        super.registerEvents();

        if(document.getElementById("title-list")) {
            for(var i=0; i<document.getElementById("title-list").children.length-1; i++){
                if(document.getElementById("title-list").children[i+1].getAttribute("niveau") <= document.getElementById("title-list").children[i].getAttribute("niveau")) {
                    document.getElementById("title-list").children[i].children[1].classList.add("hidden");
                } else{
                    document.getElementById("title-list").children[i].children[1].classList.remove("hidden");
                }
            } 
        }

        // add Editor
        this.editeurService.init('app-tinymce');
        
        const clickSelector = `.${this.name} .list-item p`;
        const listItem = Array.from(document.querySelectorAll(clickSelector));
        listItem.forEach((item) => {
            item.addEventListener('click', event => this.openEditor(event));
        });

        const displaySelector = `.${this.name} .list-item .btn-display`;
        const displayButtons = Array.from(document.querySelectorAll(displaySelector));
        displayButtons.forEach((item) => {
            item.addEventListener('click', event => this.display(event));
        });

        const updateSelector = `.${this.name} .list-item .btn-update`;
        const updateButtons = Array.from(document.querySelectorAll(updateSelector));
        updateButtons.forEach((item) => {
            var fct = function(elem, event){
                item.parentElement.childNodes[1].click();
                elem.update(event);
            }
            item.addEventListener('click', event => fct(this, event));
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
