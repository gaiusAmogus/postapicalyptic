import './style.scss';

import { getDataFromApi } from './js/getDataFromApi';

document.addEventListener('DOMContentLoaded', function() {
    var section = document.getElementById('pac_wrap');
    if(section){
        getDataFromApi();
    }
});