import './style.scss';

import { getDataFromApi } from './js/getDataFromApi';
import { postEntries } from './js/postEntries';

document.addEventListener('DOMContentLoaded', function() {
    var section = document.getElementById('pac_wrap');
    if (section) {
        getDataFromApi();
    }

    const nonceElement = document.getElementById('wpApiNonce');
    if (nonceElement) {
        const wpApiSettings = {
            nonce: nonceElement.getAttribute('data-nonce')
        };

        var updatePostsButton = document.querySelector('#updatePosts');
        if (updatePostsButton) {
            updatePostsButton.addEventListener('click', function() {
                postEntries(wpApiSettings); // Przekazanie wpApiSettings
            });
        }
    } else {
        console.error('Element z identyfikatorem wpApiNonce nie został znaleziony.');
    }
});
