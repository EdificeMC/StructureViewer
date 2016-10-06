'use strict'

import sv from './app';
import http from 'axios';

http.get('http://localhost:3000/structures/citun6inr0000813jy7trb6pl?schematic=true')
    .then(res => res.data)
    .then(data => {
        const schematic = data.schematic;
        sv(document.getElementById('structure-model'), schematic, null, true);
    })
