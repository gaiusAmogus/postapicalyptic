export async function postEntries(wpApiSettings) {
    if (!wpApiSettings || !wpApiSettings.nonce) {
        console.error('wpApiSettings lub nonce nie jest zdefiniowany.');
        return;
    }

    const actionBar = document.querySelector('.actionBar');
    if (actionBar) {
        actionBar.classList.add('actionBar--active');
    }

    try {
        const response = await fetch(window.location.origin + '/postapicalyptic/wp-json/wp/v2/posts?per_page=100');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const existingPosts = await response.json();

        const rows = document.querySelectorAll('#pac_results tbody tr');
        const totalRows = rows.length;
        let processedRows = 0;

        for (const row of rows) {
            const itemId = row.querySelector('.pac__id').textContent.trim();

            const pacImg = row.querySelector('.pac__img img')?.getAttribute('data-img') || '';
            const formattedPacImg = pacImg ? await uploadMedia(pacImg, wpApiSettings.nonce) : null;

            const pacTitle = row.querySelector('.pac__title h4').textContent.trim();
            const pacCategories = row.querySelector('.pac__categories').textContent.trim().split(',').map(cat => cat.trim());
            const pacTags = row.querySelector('.pac__tags').textContent.trim().split(',').map(tag => tag.trim());
            const pacAcf1 = row.querySelector('.pac__acfField_1').innerHTML.trim();
            const pacAcf2 = row.querySelector('.pac__acfField_2').innerHTML.trim();
            const pacDesc = row.querySelector('.pac__content').innerHTML.trim();

            // Get or create categories
            let categoryIds = await getCategoryIds(pacCategories, wpApiSettings.nonce);
            for (const catName of pacCategories) {
                if (!categoryIds.includes(catName)) {
                    const newCatId = await createCategory(catName, wpApiSettings.nonce);
                    if (newCatId) {
                        categoryIds.push(newCatId);
                    }
                }
            }

            // Get or create tags
            let tagIds = await getTagIds(pacTags, wpApiSettings.nonce);
            for (const tagName of pacTags) {
                if (!tagIds.includes(tagName)) {
                    const newTagId = await createTag(tagName, wpApiSettings.nonce);
                    if (newTagId) {
                        tagIds.push(newTagId);
                    }
                }
            }

            const postData = {
                'title': pacTitle,
                'status': 'publish',
                'content': pacDesc,
                'featured_media': formattedPacImg ? formattedPacImg.id : null,
                'categories': categoryIds,
                'tags': tagIds,
                'acf': { 
                    post_api_id: itemId,
                    acf_field_1: pacAcf1,
                    acf_field_2: pacAcf2
                }
            };

            const existingEntry = existingPosts.find(post => post.acf.post_api_id === itemId);

            if (existingEntry) {
                await updatePosts(existingEntry.id, postData, wpApiSettings.nonce);
            } else {
                await createNewPosts(postData, wpApiSettings.nonce);
            }

            processedRows++;

            if (processedRows === totalRows) {
                await updateEntriesNotInTable();
            }
        }
    } catch (error) {
        console.error('Błąd podczas pobierania:', error);
    } finally {
        if (actionBar) {
            actionBar.classList.remove('actionBar--active');
            document.querySelector('.actionBar__info').innerHTML += `<p>Aktualizacja została zakończona.</p>`;
        }
    }
}

async function uploadMedia(imageUrl, nonce) {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const formData = new FormData();
        formData.append('file', blob, 'thumb.jpg');

        const uploadResponse = await fetch(window.location.origin + '/postapicalyptic/wp-json/wp/v2/media', {
            method: 'POST',
            headers: {
                'X-WP-Nonce': nonce
            },
            body: formData
        });

        if (!uploadResponse.ok) {
            throw new Error('Error uploading media');
        }

        return uploadResponse.json();
    } catch (error) {
        console.error('Błąd podczas przesyłania mediów:', error);
        return null;
    }
}

async function getCategoryIds(categoryNames, nonce) {
    try {
        const response = await fetch(window.location.origin + '/postapicalyptic/wp-json/wp/v2/categories', {
            headers: { 'X-WP-Nonce': nonce }
        });
        const categories = await response.json();
        const categoryMap = categories.reduce((map, cat) => {
            map[cat.name] = cat.id;
            return map;
        }, {});
        return categoryNames.map(name => categoryMap[name] || null).filter(id => id);
    } catch (error) {
        console.error('Błąd podczas pobierania kategorii:', error);
        return [];
    }
}

async function getTagIds(tagNames, nonce) {
    try {
        const response = await fetch(window.location.origin + '/postapicalyptic/wp-json/wp/v2/tags', {
            headers: { 'X-WP-Nonce': nonce }
        });
        const tags = await response.json();
        const tagMap = tags.reduce((map, tag) => {
            map[tag.name] = tag.id;
            return map;
        }, {});
        return tagNames.map(name => tagMap[name] || null).filter(id => id);
    } catch (error) {
        console.error('Błąd podczas pobierania tagów:', error);
        return [];
    }
}

async function updatePosts(postId, postData, nonce) {
    try {
        const response = await fetch(window.location.origin + '/postapicalyptic/wp-json/wp/v2/posts/' + postId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': nonce
            },
            body: JSON.stringify(postData)
        });

        if (!response.ok) {
            throw new Error('Error updating post');
        }

        const result = await response.json();
        document.querySelector('.actionBar__info').innerHTML += `<p class="actionBar__info__status">Wpis <i>„${result.title.rendered}”</i> <span>został pomyślnie zaktualizowany.</span></p>`;
    } catch (error) {
        document.querySelector('.actionBar__info').innerHTML += `<p class="actionBar__info__status actionBar__info__status--error">Wystąpił błąd podczas aktualizowania wpisu: <b>${error}</b></p>`;
    }
}

async function createNewPosts(postData, nonce) {
    try {
        const response = await fetch(window.location.origin + '/postapicalyptic/wp-json/wp/v2/posts/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': nonce
            },
            body: JSON.stringify(postData)
        });

        if (!response.ok) {
            throw new Error('Error creating new post');
        }

        const result = await response.json();
        document.querySelector('.actionBar__info').innerHTML += `<p class="actionBar__info__status">Nowy wpis <i>„${result.title.rendered}”</i> <span>został pomyślnie utworzony</span></p>`;
    } catch (error) {
        document.querySelector('.actionBar__info').innerHTML += `<p class="actionBar__info__status actionBar__info__status--error">Wystąpił błąd podczas tworzenia nowego wpisu: <b>${error}</b></p>`;
    }
}

async function updateEntriesNotInTable() {
    try {
        const response = await fetch(window.location.origin + '/postapicalyptic/wp-json/wp/v2/posts?per_page=100');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const existingPosts = await response.json();

        const rows = document.querySelectorAll('#pac_results tbody tr');

        for (const post of existingPosts) {
            const postId = post.id;
            const decodedTitle = decodeHtml(post.title.rendered);
        }
    } catch (error) {
        console.error('Błąd podczas aktualizacji wpisów:', error);
    }
}

function decodeHtml(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

async function createCategory(name, nonce) {
    try {
        const existingCategory = await getCategoryByName(name, nonce);
        if (existingCategory) {
            return existingCategory.id;
        }

        const response = await fetch(window.location.origin + '/postapicalyptic/wp-json/wp/v2/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': nonce
            },
            body: JSON.stringify({ name: name })
        });

        if (!response.ok) {
            throw new Error('Error creating category');
        }

        const result = await response.json();
        return result.id;
    } catch (error) {
        console.error('Błąd podczas tworzenia kategorii:', error);
        return null;
    }
}

async function createTag(name, nonce) {
    try {
        const existingTag = await getTagByName(name, nonce);
        if (existingTag) {
            return existingTag.id;
        }

        const response = await fetch(window.location.origin + '/postapicalyptic/wp-json/wp/v2/tags', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': nonce
            },
            body: JSON.stringify({ name: name })
        });

        if (!response.ok) {
            throw new Error('Error creating tag');
        }

        const result = await response.json();
        return result.id;
    } catch (error) {
        console.error('Błąd podczas tworzenia tagu:', error);
        return null;
    }
}

async function getCategoryByName(name, nonce) {
    try {
        const response = await fetch(window.location.origin + '/postapicalyptic/wp-json/wp/v2/categories?search=' + encodeURIComponent(name), {
            headers: { 'X-WP-Nonce': nonce }
        });
        const categories = await response.json();
        return categories.find(cat => cat.name === name) || null;
    } catch (error) {
        console.error('Błąd podczas pobierania kategorii:', error);
        return null;
    }
}

async function getTagByName(name, nonce) {
    try {
        const response = await fetch(window.location.origin + '/postapicalyptic/wp-json/wp/v2/tags?search=' + encodeURIComponent(name), {
            headers: { 'X-WP-Nonce': nonce }
        });
        const tags = await response.json();
        return tags.find(tag => tag.name === name) || null;
    } catch (error) {
        console.error('Błąd podczas pobierania tagów:', error);
        return null;
    }
}
