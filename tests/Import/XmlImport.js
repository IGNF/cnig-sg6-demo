import 'mocha';

import path from "path"
const PROJECT_DIR = path.resolve();

import { expect } from 'chai';
import fs from 'fs';
import XmlImport from '../../src/Import/XmlImport.js';

describe('Test XmlImport', () => {
  it('Test examples/data/15079_reglement_20190128.xml', () => {
    expect("meuh").to.equal("meuh");
    const xmlImport = new XmlImport();
    const xmlString = fs.readFileSync(PROJECT_DIR+'/examples/data/15079_reglement_20190128.xml','utf-8');
    const reglement = xmlImport.load(xmlString);
    expect(reglement).to.be.an('object');
    // check id
    expect(reglement).to.haveOwnProperty('id');
    expect(reglement.id).to.equals('https://www.geoportail-urbanisme.gouv.fr/document/by-id/cd22628fc5f7f6f8fa21ea49ceb4cc8d');

    // check titres
    expect(reglement).to.haveOwnProperty('titres');
    expect(reglement.titres).to.be.an('array');
    expect(reglement.titres).length(12);
  });

  // it('Test examples/data/issue_7.xml', () => {
  //   const xmlImport = new XmlImport();
  //   const xmlString = fs.readFileSync(PROJECT_DIR+'/examples/data/issue_7.xml','utf-8');
  //   const reglement = xmlImport.load(xmlString);
  //   expect(reglement).to.be.an('object');
  //   // check id
  //   expect(reglement).to.haveOwnProperty('id');
  //   expect(reglement.id).to.equals('idReglementDu1667901292749');

  //   // check titres
  //   expect(reglement).to.haveOwnProperty('titres');
  //   expect(reglement.titres).to.be.an('array');
  //   expect(reglement.titres).length(1);
  // });
});
