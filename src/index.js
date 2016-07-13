'use strict'

import sv from './app';
import structureSchematic from '../teststructures/1.json';

sv(document.getElementById('structure-model'), structureSchematic, true);
