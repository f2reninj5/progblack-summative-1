
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
};

function onSearch() {
    const inputValue = $('#search-input').val();
    if (!inputValue) { return; }
    const searchURL = LastFMRequestBuilder.methods.track.search(inputValue);

    $.post(searchURL, (response) => {
        const trackMatches = response.results.trackmatches.track;
        $('#results').html('');

        for (let track of trackMatches) {
            let div = $(document.createElement('div')).addClass('search-result');
            let p = $(document.createElement('p'));
            let button = $(document.createElement('button'));
            button.text('+');
            button.on('click', () => {
                console.log(track.url);
            });
            // The jQuery text() method escapes any HTML that might be present in the text data
            p.text(`${track.artist} - ${track.name}`);
            div.append(p, button);
            $('#results').append(div);
        }
    });
}

// $('#search-button').on('click', onSearch);
$('#search-input').on('input', onSearch);
