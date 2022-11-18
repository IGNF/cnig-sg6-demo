# SG6 Editeur PLU au format CNIG

## Lien vers la demo

https://ignf.github.io/cnig-sg6-demo/examples/

## Fichiers de tests

Fichiers fonctionnels :

* [examples/data/15079_reglement_20190128.xml](examples/data/15079_reglement_20190128.xml)

Fichier non valide généré à corriger :

* [examples/data/issue_7.xml](examples/data/issue_7.xml) (`<br>` => `<br />`)

## Modèle

### Schéma UML

![MCD structuration-reglement-urbanisme](https://raw.githubusercontent.com/cnigfr/structuration-reglement-urbanisme/master/schemas/220830_MCD%20SRU.png)

https://github.com/cnigfr/structuration-reglement-urbanisme/blob/master/schemas/220830_MCD%20SRU.png

### Schéma XSD

* https://github.com/cnigfr/structuration-reglement-urbanisme/blob/master/schemas/reglementPLU.xsd (**en attente de correction**)
* https://raw.githubusercontent.com/cnigfr/structuration-reglement-urbanisme/master/schemas/old/reglementDU.xsd (**utilisé par l'exemple, convention de nommage définitive non respectée**)

### Validation des XML

Il convient d'utiliser des fichiers XML valide. L'outil [www.freeformatter.com - XML Validator - XSD (XML Schema)](https://www.freeformatter.com/xml-validator-xsd.html) pourra aider.


