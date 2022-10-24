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
import Titre from '../Model/Titre';
import DialogService from './DialogService';
import TitreForm from '../Form/TitreForm';

class EditeurService {

    storageService;

    saveEvent = new Subject();

    constructor() {
        if (EditeurService.instance) {
            return EditeurService.instance;
        }

        this.storageService = new StorageService();
        this.htmlConverterService = new HtmlConverterService();
        this.dialogService = new DialogService();

        EditeurService.instance = this;
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
            language: 'fr_FR',
            theme: 'silver',
            height: 500,
            plugins: 'image link media table emoticons',
            menubar: 'edit insert format table',
            toolbar: 'styles pluRule pluSave',
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
            debounceTime(5000)
        ).subscribe(() => {
            this.actionSave();
        });
    }

    getExtendedValidElements () {
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

    setup(editor) {

        editor.ui.registry.addButton('pluRule', {
            text: 'Voir les métadonnées',
            onAction: () => this.actionPluRule(2)
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

            tinymce.activeEditor.mode.set('design');
        }, 500);
    }


    actionPluRule(niveau) {
        const selectedNode = tinymce.activeEditor.selection.getNode();
        let titre = null;
        if (selectedNode.tagName.match('H[1-6]')) {
            titre = this.htmlConverterService.newTitleFromSource(selectedNode);
        } else {
            titre = new Titre();
        }

        const form = new TitreForm(titre);
        this.dialogService.open(form);
    }

}

export default EditeurService;
