'use strict'

import sv from './app';
import schem from 'raw!../schematics/citt8qya80000ja3j1siwx0bi.schematic';
import http from 'axios';
import pako from 'pako';

http.get('https://storage.googleapis.com/edifice-structures/citt8qya80000ja3j1siwx0bi.schematic')
    .then(data => {
        console.log('data');
        console.log(data);
        console.log('deflated');
        console.log(pako.deflate(data));
    })

console.log(schem);
// sv(document.getElementById('structure-model'), schematic, null, true);
