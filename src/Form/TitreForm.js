import { Subject } from 'rxjs';
import Component from '../Core/Component.js';
import DialogService from '../Services/DialogService.js';
import EditeurService from '../Services/EditeurService.js';
import StorageService from '../Services/StorageService.js';

class TitreForm extends Component {

    form;

    titre;

    onSave = new Subject();

    constructor(titre, previousId) {
        super();
        this.name = 'form-titre';
        //identifiant du titre après lequel il faut ajouter le nouveau titre
        this.previousId = previousId;

        this.titre = titre;

        this.storageService = new StorageService();
        this.dialogService = new DialogService();
        this.editeurService = new EditeurService();
    }


    valid(event) {
        let scrollTop = document.getElementById("title-list").scrollTop;

        const selector = `.${this.name} form`;
        const form = document.querySelector(selector);
        
        if (form.niveau.value === '') {
            alert("Le niveau du titre doit être renseigné");
            return;
        }

        if (form.niveau.value < 1 || form.niveau.value > 4) {
            alert("Le niveau du titre doit être compris entre 1 et 4");
            return;
        }
        
        if( form.idZone.value === '') {
            alert("La zone doit être renseignée");
            return;
        }

        this.titre.id =             form.id.value;
        this.titre.intitule =       form.intitule.value;
        this.titre.niveau =         parseInt(form.niveau.value);
        this.titre.numero =         form.numero.value;
        this.titre.idZone =         form.idZone.value;
        this.titre.idSousZone =     form.idSousZone.value;
        this.titre.idPrescription = form.idPrescription.value;

        // save titre dans reglement
        const reglement = this.storageService.getReglement();
        const existing = reglement.getTitreById(this.titre.id);
        if (existing) {
            // mise à jour des attributs par copie
            // on en touche pas au children / contents
            reglement.updateTitre(this.titre);
        } else {
            reglement.insertTitre(this.titre, this.previousId);
            scrollTop += 50;
        }
        
        this.onSave.next(this.titre);

        this.storageService.save(reglement);

        // reload metadata attribute
        this.editeurService.updateTitreNode(this.titre);
        
        this.editeurService.setContent(this.getUpdatedContent());


        this.close();

        for(var i=0; i<document.getElementById("title-list").children.length-1; i++){
            if(document.getElementById("title-list").children[i+1].getAttribute("niveau") <= document.getElementById("title-list").children[i].getAttribute("niveau")) {
                document.getElementById("title-list").children[i].children[1].classList.add("hidden");
            } else{
                document.getElementById("title-list").children[i].children[1].classList.remove("hidden");
            }
        }

        document.getElementById("title-list").scrollTo(0, scrollTop);

        document.getElementById(this.titre.id).children[0].click();

    }


    close(event) {
        this.dialogService.close();
    }

    checkZoneInput(event) {
        var elem = document.getElementById("idZone");
        var niveau = document.getElementById("niveau").value;

        if(niveau != "1") {
            let titres = this.storageService.getReglement().titres;
            let check = false;
            for(let i = titres.length-1; i>-1; i--) {
                if(titres[i].id == this.previousId) {
                    check = true;
                }
                if(check) {
                    if(titres[i].niveau < Number(niveau)) {
                        elem.value = titres[i].idZone;
                        break;
                    }
                }
            }       
        } else {
            elem.value = "";
        }
    }

    getTemplate() {
        return `
            <h4>Renseigner le titre</h4>
            <form>
                <label for="id" class="hidden">Identifiant</label>
                <input id="id" class="hidden" type="string" value="${this.titre.id || ''}" readonly>
                <label for="intitule">Intitulé</label>
                <input id="intitule" type="string" value="${this.titre.intitule || ''}" placeholder="Titre I : dispositions générales">
                <label for="niveau">Niveau du titre dans la hiérarchie (Ex : 1, 2, 3, etc.)</label>
                <input id="niveau" type="number" min="1" max="4" value="${this.titre.niveau || 1}">
                <label for="numero">Numéro</label>
                <input id="numero" type="string" value="${this.titre.numero || ''}" placeholder="Numéro du titre dans l’arborescence du règlement (Ex : I.1.4.2)">
                <label for="idZone">Zone (ex : U, Ua, etc.) ou la mention porteeGenerale si toutes les zones sont concernées</label>
                <input id="idZone" type="string" value="${this.titre.idZone || ''}" placeholder="U">
                <label for="idSousZone">Sous-zone (ex : UE1, UE2, etc.)</label>
                <input id="idSousZone" type="string" value="${this.titre.idSousZone || ''}" placeholder="UE1">
                <label for="idPrescription">Identifiant de prescription si nécessaire</label>
                <input id="idPrescription" type="string" value="${this.titre.idPrescription || ''}">
            </form>
            <div class="form-action">
                <div class="separator"></div>
                <button class="btn-valid">Mettre à jour / Créer le titre</button>
                <button class="btn-close">Annuler</button>
            </div>
        `;
    }


    registerEvents() {
        document.getElementById("niveau").addEventListener('change', event => this.checkZoneInput(event));

        const validSelector = `.${this.name} .btn-valid`;
        document.querySelector(validSelector).addEventListener('click', event => this.valid(event));

        const closeSelector = `.${this.name} .btn-close`;
        document.querySelector(closeSelector).addEventListener('click', event => this.close(event));
    }

    getUpdatedContent() {
        var html = this.editeurService.getContent();
        var ind1 = html.search(/\<h[0-9]/) + 2;
        var niveauActuel = html.substring(ind1, ind1+1);
        

        if(ind1 != 1 && this.titre.niveau.toString() != niveauActuel) {
            html = html.replace(/<h[0-9]/, "<h" + this.titre.niveau.toString());
        }

        var m = html.match(/\<h.*\<\/h/);
        if(m) {
            var ind2 = m[0].search(/\>/)+1;
            var intituleActuel = m[0].substring(ind2, m[0].length-3);

            if(this.titre.intitule != intituleActuel) {
                html = html.replace(m[0], m[0].replace(intituleActuel + "</h", this.titre.intitule + "</h"));
            }
        }
        return html;
    }

}

export default TitreForm;
