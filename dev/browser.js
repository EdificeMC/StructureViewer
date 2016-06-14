'use strict'

import sv from '../src/browser';
import structureSchematic from './testStructure.json'

sv(document.getElementById('structure-model'), structureSchematic);
