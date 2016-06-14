'use strict'

import sv from '../src/app';
import structureSchematic from './testStructure.json'

sv(document.getElementById('structure-model'), structureSchematic);
