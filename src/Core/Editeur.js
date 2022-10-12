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
import StorageService from '../Services/StorageService';

class Editeur {

    editor;

    storageService;

    saveEvent = new Subject();

    constructor() {
        this.storageService = new StorageService();

        this.saveEvent.pipe(
            debounceTime(500)
        ).subscribe(() => {
            // TODO
            const editorContent = this.getContent();
            const activeTitre = this.storageService.getActiveTitre();
            activeTitre.contents[0].htmlContent = editorContent;
            console.log('must save', this.storageService.getActiveTitre(), this.getContent());
            this.storageService.saveToLocalStorage();
        });
    }


    getContent() {
        return tinymce.activeEditor.getContent();
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
                { title: 'Article', block: 'div', classes: 'plu-article' },
                { title: 'Paragraphe', block: 'p', classes: 'plu-paragraph' }
            ]
        });
    }

    setup(editor) {
        this.editor = editor;

        editor.ui.registry.addButton('pluRule', {
            text: 'Règles',
            onAction: () => this.actionPluRule()
        });

        editor.ui.registry.addButton('pluSave', {
            text: 'Sauvegarde',
            onAction: () => this.actionSave()
        });

        editor.on('input', (event) => {
            this.saveEvent.next(event);
        });
    }

    actionSave() {
        this.saveEvent.next();
    }

    actionPluRule() {
        this.editor.insertContent('<strong>baba</strong>');
    }

}

export default Editeur;
