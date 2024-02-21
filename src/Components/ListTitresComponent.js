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
        var id = event.target.parentElement.getAttribute("id");
        const reglement = this.storageService.getReglement();
        const titre = reglement.getTitreById(id);

        if(event.target.classList.contains("chevron-up")) {
            event.target.classList.replace("chevron-up", "chevron-down");
            event.target.innerHTML = "&#8964;";
            titre.displayChildren = false;
        } else {
            event.target.classList.replace("chevron-down", "chevron-up");
            event.target.innerHTML= "&#8963;";
            titre.displayChildren = true;
        }

        let childrenId = reglement.getTitreChildrenId(id);
        for(var i in childrenId) {
            let t = reglement.getTitreById(childrenId[i]);
            if(t.niveau == titre.niveau + 1) {
                t.hidden = !titre.displayChildren;
            }
        }

        //this.storageService.save(reglement);
        
        var niveau = event.target.parentElement.getAttribute("niveau");
        var liste =  event.target.parentElement.parentElement.children;

        var test = false;
        for(var i in liste) {
            if(!liste[i].getAttribute) {
                this.storageService.save(reglement);
                return;
            }
            if(test && liste[i].getAttribute("niveau") <= niveau) {
                test = false;
            }
            if(test && liste[i].getAttribute("niveau") > niveau) {
                liste[i].classList.toggle("hidden" + niveau);
                let t =  reglement.getTitreById(liste[i].getAttribute("id"));
                t.hiddenClass = [];
                for(var j in liste[i].classList) {
                    if(typeof liste[i].classList[j] == "string" && liste[i].classList[j].match("hidden")) {
                        t.hiddenClass.push(liste[i].classList[j]);
                    }
                }
            }
            if(liste[i].getAttribute("id") == id){
                test = true;
            } 
        }
        this.storageService.save(reglement);
    }


    add(event) {
        this.editeurService.actionSave();
        this.editeurService.setContent("");
        this.reglement.idTitreAtuel = "";
        const newTitre = new Titre();
        newTitre.niveau = 1;
        const form = new TitreForm(newTitre);
        this.dialogService.open(form);
    }


    update(event) {
        const id = event.target.getAttribute('idtitle');
        const reglement = this.storageService.getReglement();
        const titre = reglement.getTitreById(id);

        const form = new TitreForm(titre, event.target.getAttribute("idtitle"));
        this.dialogService.open(form);
    }


    delete(event) {
        if(confirm("Attention, le titre va être supprimé.")) {
            const id = event.target.getAttribute('idtitle');
            const reglement = this.storageService.getReglement();
            let childrenId = reglement.getTitreChildrenId(id);

            reglement.removeTitre(id);
            this.editeurService.setContent("");
            this.storageService.save(reglement);

            if(childrenId.length) {
                if(confirm("Le titre a été supprimé. Voulez-vous également supprimer les titres de niveau inférieur qui lui étaient associés ?")) {
                    for(let i in childrenId) {
                        reglement.removeTitre(childrenId[i]);
                    }
                    this.editeurService.setContent("");
                    this.storageService.save(reglement);  
                } else {
                    return;
                }
            }
        } else {
            return;
        }
    }


    insert(event) {
        let scrollTop = document.getElementById("title-list").scrollTop;
        this.editeurService.actionSave();
        this.editeurService.setContent("");
        this.reglement.idTitreAtuel = "";
        const newTitre = new Titre();
        newTitre.niveau = 1;
        const form = new TitreForm(newTitre, event.target.getAttribute("idtitle"));
        this.dialogService.open(form);
        document.getElementById("title-list").scrollTo(0, scrollTop);
    }


    up(event) {
        const id = event.target.getAttribute('idtitle');
        const reglement = this.storageService.getReglement();
        reglement.moveUpTitre(id);
        this.storageService.save(reglement);
        this.openEditor(event);
    }


    down(event) {
        const id = event.target.getAttribute('idtitle');
        const reglement = this.storageService.getReglement();
        reglement.moveDownTitre(id);
        this.storageService.save(reglement);
        this.openEditor(event);
    }


    openEditor(event) {
        let scrollTop = document.getElementById("title-list").scrollTop;

        const reglement = this.storageService.getReglement();
        this.editeurService.actionSave();
        // open editor
        const titre = reglement.getTitreById(event.target.getAttribute('idtitle'));
        document.getElementById(event.target.getAttribute('idtitle')).classList.toggle("selected");
        document.getElementById("title-list").scrollTo(0, scrollTop)
        this.editeurService.loadTitle(titre);
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
        function listFromTitle(reglement, title) {
            let sublist = '';
            if (title.children && title.children.length > 0) {
                sublist = title.children.map(subtitle => listFromTitle(subtitle)).join('');
            }

            let btnUpClass = "";
            let btnDownClass = "";

            if(!reglement.isMovableUp(title.id)) {
                btnUpClass = "hidden";
            }
            if(!reglement.isMovableDown(title.id)) {
                btnDownClass = "hidden";
            }

            const buttonPart = `
                <button idtitle="${title.id}" class="btn-update">Modifier</button>
                <button idtitle="${title.id}" class="btn-delete">Supprimer</button>
                <button idtitle="${title.id}" class="btn-insert" title="Insérer un titre">+</button> 
                <div id="orderBtn">
                    <button idtitle="${title.id}" class="btn-up ${btnUpClass}">↑</button> 
                    <button idtitle="${title.id}" class="btn-down ${btnDownClass}">↓</button> 
                </div> 
                
            `;

            let chevron;
            if(title.displayChildren) {
                chevron = `<div class="btn-display chevron-up hidden">&#8963;</div>`;
            } else {
                chevron = `<div class="btn-display chevron-down hidden">&#8964;</div>`;
            }

            let hiddenClass = "";
            for(var i in title.hiddenClass) {
                hiddenClass += title.hiddenClass[i];
            }

            return `
                <li id="${title.id}"
                    niveau="${title.niveau}"
                    class="list-item ${hiddenClass}">
                    <p class="separator" idtitle="${title.id}">${title.intitule}</p>
                    ${chevron}${buttonPart}
                    <ul>${sublist}</ul>
                </li>
            `;
        }
        const content = this.reglement.titres.map(title => listFromTitle(this.reglement, title)).join('');

        const template = `
            <div class="app-card">
                <div class="app-card-header">
                    <h2>Sommaire</h2>
                    <div class="separator"></div>
                </div>
                <div class="app-card-content">
                    <p>
                        Gérer la liste des titres.
                        Cliquer sur un titre pour modifier le contenu.
                    </p>
                    <button class="btn-add" title="Ajouter un titre au début de la liste">+</button>
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

        const insertSelector = `.${this.name} .list-item .btn-insert`;
        const insertButtons = Array.from(document.querySelectorAll(insertSelector));
        insertButtons.forEach((item) => {
            item.addEventListener('click', event => this.insert(event));
        });

        const upSelector = `.${this.name} .list-item .btn-up`;
        const upButtons = Array.from(document.querySelectorAll(upSelector));
        upButtons.forEach((item) => {
            item.addEventListener('click', event => this.up(event));
        });

        const downSelector = `.${this.name} .list-item .btn-down`;
        const downButtons = Array.from(document.querySelectorAll(downSelector));
        downButtons.forEach((item) => {
            item.addEventListener('click', event => this.down(event));
        });

        const addSelector = `.${this.name} .btn-add`;
        document.querySelector(addSelector)?.addEventListener('click', event => this.add(event));

        const selectorReduce = `.${this.name} button.btn-reduce`;
        document.querySelector(selectorReduce)?.addEventListener('click', event => this.reduce(event));
    }

}

export default ListTitresComponent;
