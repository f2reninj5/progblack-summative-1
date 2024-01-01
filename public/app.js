
let playlists = {};
let displayPlaylist = {};

async function updateUserProfile() {
    for (let element of $('.username')) {
        $(element).text(user.username);
    }
    $(':root').css('--profile', hexToRGB(user.profileColour));
    $('input[type=color]').val(user.profileColour);
    await updateUserPlaylists();
}

async function updateUserPlaylists() {
    const response = await fetch(`/user/${user.username}/playlist`, { method: 'GET' });
    if (!response.ok) { return; } // handle errors later
    const body = await response.json();
    const playlistContainer = $('#playlist-container');
    const buttons = $('#playlist-container>.playlist');

    for (let i = 1; i < buttons.length; i++) {
        buttons[i].remove();
    }

    for (let playlist of body) {
        const button = $(document.createElement('button')).addClass('playlist');
        const h4 = $(document.createElement('h4')).text(playlist.name);
        const smallCount = $(document.createElement('small')).text(`Songs: ${playlist.songCount}`);
        const createdAt = new Date(playlist.createdAt);
        const smallDate = $(document.createElement('small')).text(createdAt.toLocaleDateString());
        button.append(h4, smallCount, smallDate);
        button.on('click', async function () {
            const response = await fetch(`user/${user.username}/playlist/${playlist.name}`, {
                method: 'GET'
            });
            if (!response.ok) { return; } // handle errors later
            const body = await response.json();
            displayPlaylist = body;
            updatePlaylist();
            PageManager.switchToPage('playlist');
        });
        playlistContainer.append(button);
    }
}

function updatePlaylist() {
    for (let element of $('.playlist-name')) {
        $(element).text(displayPlaylist.name);
    }
    const songContainer = $('#song-container');
    for (let song of displayPlaylist.songs) {
        const div = $(document.createElement('div')).text(song.artist, song.title);
        songContainer.append(div);
    }
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
    await updateUserProfile();
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
    displayPlaylist = body;
    updateUserPlaylists();
    updatePlaylist();
    PageManager.switchToPage('playlist');
    form.reset();
    $('#create-playlist')[0].hidden = true;
});

$('button.profile-return').on('click', function () {
    PageManager.switchToPage('profile');
});

$('button.playlist-return').on('click', function () {
    PageManager.switchToPage('playlist');
});

$('button#add-songs').on('click', function () {
    PageManager.switchToPage('search');
    $('#search-input').focus();
    $('#search-input').select();
});
