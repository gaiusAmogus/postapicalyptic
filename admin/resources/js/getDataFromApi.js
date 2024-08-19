export function getDataFromApi() {

    function processData(data) {
        
        var processedData = [];

        data.forEach(function(item) {
            var processedItem = {
                id: item.API_ID,
                title: item.title,
                image: item.thumbnail,
                content: item.content,
                author: item.author,
                categories: item.categories.join(', '),
                tags: item.tags.join(', '),
                acfField1: item.acf_field_1,
                acfField2: item.acf_field_2
            };
            processedData.push(processedItem);
        });

        return processedData;
    }

    function renderDatesTable(data) {
        var tableBody = document.querySelector('#pac_results tbody');
        var tableRows = '';

        data.forEach(function(item) {
            tableRows += '<tr>';
                tableRows += '<td class="pac__id">' + item.id + '</td>';
                if (item.image) {
                    tableRows += '<td class="pac__img"><img src="' + item.image + '" data-img="' + item.image + '"></td>';
                } else {
                    tableRows += '<td class="pac__img"></td>';
                }
                tableRows += '<td class="pac__title"><h4>' + (item.title ? item.title.trim() : '') + '</h4></td>';
                tableRows += '<td class="pac__author">' + (item.author ? item.author : '') + '</td>';
                tableRows += '<td class="pac__categories">' + (item.categories ? item.categories : '') + '</td>';
                tableRows += '<td class="pac__tags">' + (item.tags ? item.tags : '') + '</td>';
                tableRows += '<td class="pac__acfField pac__acfField_1">' + (item.acfField1 ? item.acfField1 : '') + '</td>';
                tableRows += '<td class="pac__acfField pac__acfField_2">' + (item.acfField2 ? item.acfField2 : '') + '</td>';
                tableRows += '<td class="pac__content">' + (item.content ? item.content : '') + '</td>';
            tableRows += '</tr>';
        });

        tableBody.innerHTML += tableRows;
    }

    function fetchData() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost/postapicalyptic/wp-content/themes/twentytwentyfour/posts.json', true);
        xhr.responseType = 'json';

        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                var processedData = processData(xhr.response);
                renderDatesTable(processedData);
            } else {
                var tableBody = document.querySelector('#pac_results tbody');
                tableBody.innerHTML += '<tr><td colspan="9">Wystąpił błąd podczas pobierania danych z API.</td></tr>';
            }
        };

        xhr.onerror = function() {
            var tableBody = document.querySelector('#pac_results tbody');
            tableBody.innerHTML += '<tr><td colspan="9">Wystąpił błąd podczas pobierania danych z API.</td></tr>';
        };

        xhr.send();
    }

    fetchData();
}
