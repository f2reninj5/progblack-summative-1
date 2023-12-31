
let playlist = {};

function updateUserProfile() {
    for (element of $('.username')) {
        $(element).text(user.username);
    }
    $(':root').css('--profile', hexToRGB(user.profileColour));
}

async function updateUserPlaylists() {
    // const response = await fetch(`/user/${user.username}/playlist`, { method: 'GET' }); // missing method in api
    // if (!response.ok) { return; } // handle errors later
    // const body = await response.json();
    const playlistContainer = $('#playlist-container');
    const addButton = $('#playlist-container>*').first();
    playlistContainer.html(addButton);
    // for (let playlist of body) {

    // }
}

$('input[type=color]').change(async function () {
    const response = await fetch(`/user/${user.username}`, {
        method: 'PUT',
        body: JSON.stringify({ profileColour: $(this).val() }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    console.log(response);
    if (!response.ok) { return; } // handle errors later
    const body = await response.json();
    user = body;
    updateUserProfile();
});

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

$('#create-playlist-button').on('click', function () {
    $('#create-playlist')[0].hidden = false;
});

$('#close-create-playlist-form-button').on('click', function (event) {
    event.preventDefault();
    $('#create-playlist')[0].hidden = true;
});

$('#create-playlist-form').submit(async function (event) {
    event.preventDefault();
    const form = $(this)[0];
    const name = $(`#${form.id} > [name="playlist-name"]`).val();
    const response = await fetch(`/user/${user.username}/playlist`,
        {
            method: 'POST',
            body: JSON.stringify({
                name
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    if (!response.ok) { return; } // handle errors later
    const body = await response.json();
    playlist = body;
    // updateUserPlaylists();
    // updatePlaylist();
    // PageManager.switchToPage('search')
});
