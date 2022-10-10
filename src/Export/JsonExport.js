import FileSaver from 'file-saver';

class JsonExport {

    constructor() {
    }


    export(reglement) {

        const txt = JSON.stringify(reglement, null, 4);
        const blob = new Blob([txt], { type: 'application/json' });

        const filename = reglement.idUrba || reglement.nom;

        FileSaver.saveAs(blob, `export_${filename}.json`);
    }

}

export default JsonExport;
