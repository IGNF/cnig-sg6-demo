import FileSaver from 'file-saver';

class XmlExport {

    constructor() {
    }


    export(reglement) {

        const txt = reglement.toXml();
        const blob = new Blob([txt], { type: 'application/xml' });

        const filename = reglement.idUrba || reglement.nom;

        FileSaver.saveAs(blob, `export_${filename}.xml`);
    }

}

export default XmlExport;
