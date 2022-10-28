import { debounceTime, Subject } from 'rxjs';

// load tinymce icon, theme, skin, plugin
import tinymce from 'tinymce';
import 'tinymce/models/dom';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/skins/ui/oxide/skin.css';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/code';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/emoticons/js/emojis';
import 'tinymce/plugins/image';
import 'tinymce/plugins/media';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/table';
import 'tinymce/plugins/emoticons';

import StorageService from './StorageService';
import HtmlConverterService from './HtmlConverterService';
import DialogService from './DialogService';
import TitreForm from '../Form/TitreForm';
import ContenuForm from '../Form/ContenuForm';

class EditeurService {

    storageService;

    saveEvent = new Subject();

    zoneVisibility = true;

    prescriptionVisibility = true;

    constructor() {
        if (EditeurService.instance) {
            return EditeurService.instance;
        }

        this.storageService = new StorageService();
        this.dialogService = new DialogService();
        this.htmlConverterService = new HtmlConverterService();

        EditeurService.instance = this;
    }


    updateTitreNode(titre) {
        const nodeSelected = this.getSelection();
        if (!nodeSelected.tagName.match('H[1-6]')) {
            return;
        }
        this.htmlConverterService.updateTitreNode(nodeSelected, titre);
    }


    updateContenuNode(contenu) {
        const nodeSelected = this.getSelection();
        if (nodeSelected.tagName.match('H[1-6]')) {
            return;
        }
        this.htmlConverterService.updateContenuNode(nodeSelected, contenu);
    }


    loadTitle(title = null) {
        if (title !== null) { this.activeTitle = title; }
        if (this.actionTitle === null) { return; }
        this.setContent(this.activeTitle.toHtml(), { format: 'raw' });
    }


    getSelection() {
        return tinymce.activeEditor.selection.getNode();
    }


    getContent() {
        return tinymce.activeEditor.getContent();
    }


    setContent(content, options) {
        return tinymce.activeEditor.setContent(content, options);
    }


    init(id) {
        tinymce.init({
            selector: `textarea#${id}`,
            setup: (editor) => { return this.setup(editor); },
            content_style: this.getContentStyle(),
            language: 'fr_FR',
            theme: 'silver',
            height: 820,
            plugins: 'image link media table emoticons',
            menubar: 'edit insert format table',
            toolbar: 'styles pluRule toggleZone togglePrescription',
            extended_valid_elements: this.getExtendedValidElements(),
            menu: {
                edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
                insert: { title: 'Insert', items: 'image link media addcomment pageembed template codesample | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime' },
                format: { title: 'Format', items: 'bold italic underline codeformat | styles align lineheight | forecolor | language | removeformat' },
                table: { title: 'Table', items: 'inserttable | cell row column | advtablesort | tableprops deletetable' }
            },
            style_formats: [
                { title: 'Titre', block: 'h1', classes: 'plu-title' },
                { title: 'Titre niveau 2', block: 'h2' },
                { title: 'Titre niveau 3', block: 'h3' },
                { title: 'Titre niveau 4', block: 'h4' },
                { title: 'Article', block: 'div', classes: 'plu-article' },
                { title: 'Paragraphe', block: 'p', classes: 'plu-paragraph' }
            ]
        });
        this.saveEvent.pipe(
            debounceTime(60 * 1000)
        ).subscribe(() => {
            this.actionSave();
        });
    }


    getExtendedValidElements() {
        return [
            'div[class,id,data-href,data-idzone,data-idprescription,data-intitule,data-niveau,data-numero,data-inseecommune]',
            'h1[class,id,data-href,data-idzone,data-idprescription,data-intitule,data-niveau,data-numero,data-inseecommune]',
            'h2[class,id,data-href,data-idzone,data-idprescription,data-intitule,data-niveau,data-numero,data-inseecommune]',
            'h3[class,id,data-href,data-idzone,data-idprescription,data-intitule,data-niveau,data-numero,data-inseecommune]',
            'h4[class,id,data-href,data-idzone,data-idprescription,data-intitule,data-niveau,data-numero,data-inseecommune]',
            'h5[class,id,data-href,data-idzone,data-idprescription,data-intitule,data-niveau,data-numero,data-inseecommune]',
            'h6[class,id,data-href,data-idzone,data-idprescription,data-intitule,data-niveau,data-numero,data-inseecommune]'
        ].join(',');
    }

    getContentStyle() {
        const style = [`
            body {
                font-size: 0.90em;
                line-height: 1;
            }
            h4 {
                background-color: lightgray;
            }
            *[data-idzone]::before, *[data-idprescription]::after {
                content: '';
                position: absolute;
                right: 5px;
                height: 1.5em;
                font-size: 8px;
                text-align: center;
                box-sizing: border-box;
                background: white;
            }
            *[data-idzone]::before {
                color: #bd1e1e8a;
            }
            *[data-idprescription]::after {
                color: #1d0c7391;
            }
            *[data-idzone]:hover::before, *[data-idzone]:active::before, *[data-idprescription]:hover::after, *[data-idprescription]:active::after {
                font-size: 1.0em;
            }
        `];
        if (this.zoneVisibility) {
            style.push(`
                *[data-idzone]::before {
                    content: attr(data-idzone);
                }
                *[data-idzone="porteeGenerale"]::before {
                    content: '';
                }
            `);
        }
        if (this.prescriptionVisibility) {
            style.push(`
                *[data-idprescription]::after {
                    content: attr(data-idprescription);
                }
                *[data-idprescription="nonConcerne"]::after {
                    content: '';
                }
            `);
        }
        return style.join('');
    }


    setup(editor) {

        editor.ui.registry.addButton('pluRule', {
            text: 'Modifier les métadonnées',
            onAction: () => this.actionPluRule()
        });

        editor.ui.registry.addButton('toggleZone', {
            text: 'Voir les zones',
            onAction: () => this.actionToggleZone()
        });

        editor.ui.registry.addButton('togglePrescription', {
            text: 'Voir les prescriptions',
            onAction: () => this.actionTogglePrescription()
        });

        editor.ui.registry.addButton('pluSave', {
            text: 'Sauvegarde sur votre navigateur',
            onAction: () => this.actionSave()
        });

        editor.on('input', (event) => {
            this.saveEvent.next(event);
        });
    }


    actionSave() {
        tinymce.activeEditor.mode.set('readonly');

        setTimeout((event) => {
            tinymce.activeEditor.mode.set('design');
        }, 500);

        const editorContent = this.getContent();
        const newTitre = this.htmlConverterService.recomposeTitre(editorContent);
        if (!newTitre) {
            tinymce.activeEditor.mode.set('design');
            return;
        }
        tinymce.activeEditor.setContent(newTitre.toHtml());

        const reglement = this.storageService.getReglement();
        reglement.replaceTitre(newTitre);
        this.storageService.save(reglement);
    }


    actionPluRule() {
        const selectedNode = tinymce.activeEditor.selection.getNode();
        if (selectedNode.tagName.match('H[1-6]')) {
            // open form titre
            const titre = this.htmlConverterService.newTitleFromSource(selectedNode);
            const form = new TitreForm(titre);
            this.dialogService.open(form);
            return;
        }
        // open form prescription
        const contenu = this.htmlConverterService.newContenuFromSource(selectedNode);
        const form = new ContenuForm(contenu);
        this.dialogService.open(form);
    }
    actionToggleZone() {
        this.zoneVisibility = !this.zoneVisibility;
        tinymce.activeEditor.iframeElement.contentDocument.getElementsByTagName('style')[1].innerHTML = this.getContentStyle();
    }


    actionTogglePrescription() {
        this.prescriptionVisibility = !this.prescriptionVisibility;
        tinymce.activeEditor.iframeElement.contentDocument.getElementsByTagName('style')[1].innerHTML = this.getContentStyle();
    }

}

export default EditeurService;
