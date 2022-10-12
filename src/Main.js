const conf = {
    version: '1.0.0-beta'
};

export const REVISION = conf.version;

export { default as Application } from 'App';

export { default as Editeur } from 'Core/Editeur';
export { default as XmlImport } from 'Import/XmlImport';

export { default as DetailPluComponent } from 'Components/DetailPluComponent';

export { default as DetailTitreComponent } from 'Components/DetailTitreComponent';
export { default as ListTitresComponent } from 'Components/ListTitresComponent';
