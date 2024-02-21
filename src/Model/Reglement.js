import Contenu from "./Contenu.js";
import Titre from "./Titre.js";

class Reglement {

    // attributes (form)
    id;
    nom;
    lien;

    // gpu attributes
    idUrba;
    // une ou plusieurs commune (cf PLUi)
    inseeCommune;

    sirenIntercomm;

    // liste de Zone
    titres;

    // hors model
    // html pour comparer (?)
    htmlContent;

    //id du titre actuellement affiché dans l'éditeur
    //idTitreActuel

    constructor() {
        this.id = `idReglementPlu${Math.floor(Math.random()*Date.now())}`;
        this.nom = 'Renseignez le Document d\'Urbanisme';
        this.lien = '';
        this.idUrba = '';
        this.inseeCommune = '';
        this.sirenIntercomm = '';
        this.titres = [];
    }

    serialize() {

    }

    unserialise(data) {
        if (data === null) {
            return null;
        }
        this.id = data.id;
        this.nom = data.nom;
        this.lien = data.lien;
        this.idUrba = data.idUrba;
        this.inseeCommune = data.inseeCommune
        this.sirenIntercomm = data.sirenIntercomm
        this.titres = data.titres.map(titreData => new Titre().unserialise(titreData));
        this.htmlContent = data.htmlContent;
        return this;
    }


    getTitreById(id) {
        const index = this.titres.findIndex(t => t.id === id);
        if (index !== -1) {
            return this.titres[index];
        }
        for (const index in this.titres) {
            const titre = this.titres[index].findTitreById(id);
            if (titre) { return titre; }
        }
    }


    getTitreChildrenId(id) {
        let childrenId = [];
        let niv;
        let ind;
        for(let i in this.titres) {   
            if(this.titres[i].id == id) {
                niv = this.titres[i].niveau;
                ind = Number(i);
                break;
            }
        }
        for(let i = ind+1; i < this.titres.length; i++ ) {
            if(this.titres[i].niveau > niv) {
                childrenId.push(this.titres[i].id);
            } else {
                break;
            }
        }
        return childrenId;
    }


    removeTitre(id) {
        const index = this.titres.findIndex(t => t.id === id);
        if (index === -1) {
            return;
        }
        this.titres.splice(index, 1);
    }


    replaceTitre(titre) {
        const index = this.titres.findIndex(t => t.id === titre.id);
        if (index === -1) {
            this.titres.push(titre);
            return;
        }
        this.titres.splice(index, 1, titre);
    }

    updateTitre(formData) {
        const existing = this.getTitreById(formData.id);
        if (!existing) {
            return;
        }
        existing.intitule = formData.intitule;
        existing.niveau = formData.niveau;
        existing.numero = formData.numero;
        existing.href = formData.href;
        existing.idZone = formData.idZone;
        existing.idSousZone = formData.idSousZone;
        existing.idPrescription = formData.idPrescription;
        return;
    }

    insertTitre(titre, previousId) {
        const contenu = new Contenu();
        contenu.htmlContent = `
            <h${titre.niveau}>${titre.intitule}</h${titre.niveau}>
        `;
        titre.contents.push(contenu);

        if(!previousId) {
            this.titres.unshift(titre);
            return;
        }

        for(let i in this.titres) {
            if(this.titres[i].id == previousId) {
                this.titres.splice(Number(i)+1, 0, titre);
                break;                
            }
        }
    }


    isMovableDown(id) {
        let niv = this.getTitreById(id).niveau
        let movable = false;
        let ind = -1;
        for(var i in this.titres) {
            if(this.titres[i].id == id) {
               ind = i;
            }
            if(ind > -1 && i > ind && this.titres[i].niveau < niv) {
                break;
            }
            if(ind > -1 && i > ind && this.titres[i].niveau == niv) {
                movable = true;
                break;
            }
        }
        return movable;
    }

    isMovableUp(id) {
        let niv = this.getTitreById(id).niveau
        let movable = false;
        let ind = -1;
        for(var i = this.titres.length-1; i > -1; i--) {
            if(this.titres[i].id == id) {
               ind = i;
            }
            if(ind > -1 && i < ind && this.titres[i].niveau < niv) {
                break;
            }
            if(ind > -1 && i < ind && this.titres[i].niveau == niv) {
                movable = true;
                break;
            }
        }
        return movable;
    }


    moveDownTitre(id) {
        if(!this.isMovableDown(id)) {
            return;
        }

        let childrenId = this.getTitreChildrenId(id);
        let nextTitleChildrenId = false;
        let orderedTitles = [];
        let ind;
        let insert = false;
        let insertFct = function(titres) {
            orderedTitles.push(titres[ind]);
            for(var i in childrenId) {
                for(var j in titres) {
                    if(childrenId[i] == titres[j].id) {
                        orderedTitles.push(titres[j]);
                    }
                } 
            }
        }

        for(var i in this.titres) {
            if(this.titres[i].id != id) {
                let push = true;
                for(var j in childrenId) {
                    if(childrenId[j] == this.titres[i].id) {
                        push = false;
                        break;
                    } 
                }
                if(push) {
                    orderedTitles.push(this.titres[i]);
                    if(insert && !nextTitleChildrenId) {
                        nextTitleChildrenId = this.getTitreChildrenId(this.titres[i].id);    
                    } else if(insert && nextTitleChildrenId.length) {
                        nextTitleChildrenId.shift();
                    }
                    if(insert && nextTitleChildrenId && !nextTitleChildrenId.length) {
                        insertFct(this.titres);
                        insert = false;
                    }
                }
            } else {
                ind = i;
                insert = true;
            }
        }

        this.titres = orderedTitles;
    }


    moveUpTitre(id) {
        if(!this.isMovableUp(id)) {
            return;
        }

        let childrenId = this.getTitreChildrenId(id);
        let orderedTitles = [];
        let ind;
        let niv = this.getTitreById(id).niveau
        let insertFct = function(titres) {
            for(var i = childrenId.length-1; i > -1; i--) {
                for(var j in titres) {
                    if(childrenId[i] == titres[j].id) {
                        orderedTitles.push(titres[j]);
                    }
                } 
            }
            orderedTitles.push(titres[ind]);
        }

        for(var i = this.titres.length-1; i > -1; i--) {
            if(this.titres[i].id != id) {
                let push = true;
                for(var j in childrenId) {
                    if(childrenId[j] == this.titres[i].id) {
                        push = false;
                        break;
                    } 
                }
                if(push) {
                    orderedTitles.push(this.titres[i]);
                    if(ind > -1 && this.titres[i].niveau == niv) {
                        insertFct(this.titres);
                        ind = -1;
                    }
                }
            } else {
                ind = i;
            }
        }

        this.titres = orderedTitles.reverse();
    }


    toSimpleContent() {
        const content = this.titres.map(titre => titre.toSimpleContent()).join('');
        return `
            ${content}
        `;
    };


    toHtml() {
        const content = this.titres.map(titre => titre.toHtml()).join('');
        return `
            <div id="${this.id}" nom="${this.nom}" lien="${this.lien}"
                idUrba="${this.idUrba}" inseeCommune="${this.inseeCommune}" sirenIntercomm="${this.sirenIntercomm}" >
                ${content}
            </div>
        `;
    };


    toXml() {
        const content = this.titres.map(titre => titre.toXml()).join('');
        const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
            <plu:ReglementPLU xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
                xmlns:plu="https://cnig.gouv.fr/reglementPLU"
                xsi:schemaLocation="https://cnig.gouv.fr/reglementPLU https://raw.githubusercontent.com/IGNF/cnig-sg6-demo/master/examples/data/reglementPLU.XSD"
                id="${this.id}" nom="${this.nom}" lien="${this.lien}"
                idUrba="${this.idUrba}" inseeCommune="${this.inseeCommune}" sirenIntercomm="${this.sirenIntercomm}">
                ${content}
            </plu:ReglementPLU>
        `;
        return this.prettifyXml(this.sanitizeXml(xmlString));
    };


    sanitizeXml(string) {
        return string.trim()
            .replace(/\p{C}/gu, '')
            .replace(/\u00a0/g, ' ')
            .replace(/            /g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/ data-[^=]*="[^"]*"/g, '')
            .replace(/<(img|colgroup|col|source|hr) ([^>]*[^\/])\/?>/g, '<$1 $2/>')
            .replace(/<hr>/g, '<hr/>')
            .replace(/<br>/g, '<br/>')
            .replace(/( )?xmlns="http:\/\/www.w3.org\/1999\/xhtml"/g, '')
            .replace(/xmlns:xsi="http:\/\/www.w3.org\/2001\/XMLSchema-instance"/g, 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.w3.org/1999/xhtml"');
    }


    prettifyXml(xml, tab = null) {
        // tab = optional indent value, default is tab (\t)
        let formatted = '';
        let indent = '';
        tab = tab || '\t';
        xml.split(/>\s*</).forEach(function (node) {
            if (node.match(/^\/\w/)) {
                indent = indent.substring(tab.length);
            }
            formatted += indent + '<' + node + '>\r\n';
            if (node.match(/^<?\w[^>]*[^\/]$/)) {
                indent += tab;
            }
        });
        return formatted.substring(1, formatted.length - 3);
    }

}

export default Reglement;
