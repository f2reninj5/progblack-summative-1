
const user = {};

$.ajax({
    type: 'POST',
    url: '/register',
    data: JSON.stringify({ username: 'fn', password: 'test' }),
    contentType: 'application/json',
    success: function (response) {
        console.log(response);
    }
});

$.ajax({
    type: 'POST',
    url: '/session/login',
    success: function (response) {
        console.log(response.username);
    }
});

class LastFMRequestBuilder {
    static host = 'https://ws.audioscrobbler.com/2.0/?';
    static api_key = 'a5f946a067f8945ab819fdb99a0a33ae';
    static format = 'json';

    static methods = {
        track: {
            search: (track) => this.buildURL('track.search', { track })
        }
    };

    static buildURL(method, params) {
        const searchParams = new URLSearchParams({
            api_key: this.api_key,
            format: this.format,
            method: method,
            ...params
        });
        return this.host + searchParams.toString();
    }
}

$('#search-input').val('hello world');
onSearch();

function onSearch() {
    const inputValue = $('#search-input').val();
    if (!inputValue) { return; }
    const searchURL = LastFMRequestBuilder.methods.track.search(inputValue);

    $.post(searchURL, (response) => {
        const trackMatches = response.results.trackmatches.track;
        $('#search-result-container').html('');

        for (let track of trackMatches) {
            let div = $(document.createElement('div')).addClass('search-result');
            let artist = $(document.createElement('p'));
            let title = $(document.createElement('p'));
            let button = $(document.createElement('button'));
            // Icon from Google Fonts API
            let icon = $(document.createElement('span')).addClass('material-symbols-rounded');
            icon.html('add_circle');

            button.append(icon);
            button.on('click', function () {
                let span = $(this).children('span').first();
                let iconId = span.html();
                if (iconId === 'check_circle' || iconId === 'cancel') {
                    span.html('add_circle');
                }
                else {
                    $(this).children('span').first().html('check_circle');
                }
            });
            button.hover(function () {
                let span = $(this).children('span').first();
                if (span.html() === 'check_circle') {
                    span.html('cancel');
                }
            }, function () {
                let span = $(this).children('span').first();
                if (span.html() === 'cancel') {
                    span.html('check_circle');
                }
            });

            // The jQuery text() method escapes any HTML that might be present in the text data
            artist.text(track.artist);
            title.text(track.name);
            div.append(artist, title, button);
            $('#search-result-container').append(div);
            $('#search-result-container').append(document.createElement('hr'));
        }
    });
}

// $('#search-button').on('click', onSearch);
$('#search-input').on('input', onSearch);
// `function` notation gives correct value of `this`
$('#search-input').on('click', function () {
    $(this).focus();
    $(this).select();
});
