import { debounceTime, Subject } from 'rxjs';

// load tinymce icon, theme, skin, plugin
import tinymce from 'tinymce';
import 'tinymce/models/dom/index.js';
import 'tinymce/icons/default/index.js';
import 'tinymce/themes/silver/index.js';
import 'tinymce/skins/ui/oxide/skin.css';
import 'tinymce/plugins/advlist/index.js';
import 'tinymce/plugins/code/index.js';
import 'tinymce/plugins/emoticons/index.js';
import 'tinymce/plugins/emoticons/js/emojis.js';
import 'tinymce/plugins/image/index.js';
import 'tinymce/plugins/media/index.js';
import 'tinymce/plugins/link/index.js';
import 'tinymce/plugins/lists/index.js';
import 'tinymce/plugins/table/index.js';
import 'tinymce/plugins/emoticons/index.js';

import StorageService from './StorageService.js';
import HtmlConverterService from './HtmlConverterService.js';
import DialogService from './DialogService.js';
import TitreForm from '../Form/TitreForm.js';
import ContenuForm from '../Form/ContenuForm.js';

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


    getSelection() {
        return tinymce.activeEditor.selection.getNode();
    }


    getContent() {
        return tinymce.activeEditor.getContent();
    }


    setContent(content, options) {
        return tinymce.activeEditor.setContent(content, options);
    }


    toggleEditorMode(mode = 'readonly') {
        tinymce.activeEditor.mode.set(mode);
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
            *[data-idzone]::before, *[data-idprescription]::before {
                content: '';
                position: absolute;
                right: 5px;
                height: 1.5em;
                font-size: 11px;
                text-align: right;
                box-sizing: border-box;
                background: white;
                white-space: pre-wrap;
                z-index: 2;
            }
            *[data-idzone]::before {
                color: #bd1e1e8a;
            }
            *[data-idzone]:hover::before, *[data-idprescription]:hover::before,
            *[data-idzone]:active::before, *[data-idprescription]:active::before {
                font-size: 18px;
                height: 2.5em;
                z-index: 3;
            }
        `];
        let content = '';
        if (this.zoneVisibility) {
            content += 'attr(data-idzone)';
        }
        content += ' "\\A" ';
        if (this.prescriptionVisibility) {
            content += 'attr(data-idprescription)';
        }
        style.push(`
            *[data-idzone]::before, *[data-idprescription]::before {
                content: ${content}
            }
        `);
        return style.join('');
    }


    setup(editor) {

        // start with readonly mode
        editor.mode.set('readonly');

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
        // TODO get last titre 
        const contenu = this.htmlConverterService.newContenuFromSource(selectedNode);
        const form = new ContenuForm(contenu);
        this.dialogService.open(form);
    }


    actionToggleZone() {
        this.zoneVisibility = !this.zoneVisibility;
        const styles = Array.from(tinymce.activeEditor.iframeElement.contentDocument.getElementsByTagName('style'));
        if (styles && styles.length > 1) {
            styles[1].innerHTML = this.getContentStyle();
        }
    }


    actionTogglePrescription() {
        this.prescriptionVisibility = !this.prescriptionVisibility;
        const styles = Array.from(tinymce.activeEditor.iframeElement.contentDocument.getElementsByTagName('style'));
        if (styles && styles.length > 1) {
            styles[1].innerHTML = this.getContentStyle();
        }
    }

}

export default EditeurService;
