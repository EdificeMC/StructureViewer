'use strict'

import sv from './app';
import http from 'axios';

http.get('https://api.edificemc.com/structures/ciu0k8ah00009agl02naz1euj?schematic=true')
    .then(res => res.data)
    .then(data => {
        const schematic = data.schematic;
        sv(document.getElementById('structure-model'), schematic, null, true);
    })
