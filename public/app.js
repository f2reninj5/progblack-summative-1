
$('#search-input').val('hello world');
onSearch();

async function onSearch() {
    const inputValue = $('#search-input').val();
    if (!inputValue) { return; }

    const response = await fetch(`/song/${inputValue}`, { method: 'GET' });
    if (!response.ok) { return; } // handle errors later
    const body = await response.json();
    $('#search-result-container').html('');

    for (let track of body) {
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
}

// $('#search-button').on('click', onSearch);
$('#search-input').on('input', onSearch);
// `function` notation gives correct value of `this`
$('#search-input').on('click', function () {
    $(this).focus();
    $(this).select();
});
