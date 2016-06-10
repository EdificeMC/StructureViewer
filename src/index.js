'use strict'

import sv from './app';
import structureSchematic from './testStructure.json'

console.log(document.getElementById('structure-model'));
sv(document.getElementById('structure-model'), structureSchematic);
