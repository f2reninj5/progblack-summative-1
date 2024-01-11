
let playlists = {};
let displayPlaylist = {};
let songResults = [];

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

function createSongRemoveButton() {
    const button = $(document.createElement('button'));
    const icon = $(document.createElement('span')).addClass('material-symbols-rounded');
    icon.html('cancel');
    button.html(icon);

    return button;
}

function updatePlaylist() {
    for (let element of $('.playlist-name')) {
        $(element).text(displayPlaylist.name);
    }

    const songContainer = $('#playlist-song-container');
    songContainer.html('');
    const createdAt = new Date(displayPlaylist.createdAt);
    $('#created-at').text(createdAt.toLocaleDateString());
    $('#song-count').text(displayPlaylist.songs.length);

    for (let i = 0; i < displayPlaylist.songs.length; i++) {
        const song = displayPlaylist.songs[i];
        const div = $(document.createElement('div')).addClass(['song-listing', 'playlist-listing']);
        const index = $(document.createElement('p')).text(i + 1);
        const title = $(document.createElement('p')).text(song.title);
        const artist = $(document.createElement('p')).text(song.artist);
        const removeButton = createSongRemoveButton();
        div.append(index, title, artist, removeButton);
        songContainer.append(div);
    }
}

function createSongAddButton(track) {
    const button = $(document.createElement('button'));
    const icon = $(document.createElement('span')).addClass('material-symbols-rounded');
    icon.html('add_circle');
    button.html(icon);

    button.on('click', async function () {
        const span = $(this).children('span').first();
        const iconId = span.html();
        if (iconId === 'hourglass') {
            return;
        }
        else if (iconId === 'check_circle' || iconId === 'cancel') {
            span.html('add_circle');
        }
        else if (iconId === 'add_circle') {
            span.html('hourglass');

            const response = await fetch(`/user/${user.username}/playlist/${displayPlaylist.name}/song`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        artist: track.artist,
                        title: track.name
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            if (!response.ok) {
                return; // handle errors later
            }
            const body = await response.json();
            displayPlaylist = body;

            span.html('check_circle');
        }
    });
    button.hover(
        // on hover
        function () {
            const span = $(this).children('span').first();
            if (span.html() === 'check_circle') {
                span.html('cancel');
            }
        },
        // off hover
        function () {
            const span = $(this).children('span').first();
            if (span.html() === 'cancel') {
                span.html('check_circle');
            }
        }
    );

    return button;
}

function updateSongResults() {
    $('#search-result-container').html('');

    for (const track of songResults) {
        const div = $(document.createElement('div')).addClass(['song-listing', 'search-listing']);
        const artist = $(document.createElement('p'));
        const title = $(document.createElement('p'));
        const button = createSongAddButton(track);

        // The jQuery text() method escapes any HTML that might be present in the text data
        artist.text(track.artist);
        title.text(track.name);
        div.append(artist, title, button);
        $('#search-result-container').append(div, document.createElement('hr'));
    }

    if (songResults.length === 0) {
        displayNoSearchResults();
    }
}

function stallSearchResults() {
    const span = $(document.createElement('span'))
        .addClass('material-symbols-rounded')
        .text('hourglass');
    const div = $(document.createElement('div'))
        .addClass('search-dialogue')
        .append(span);
    $('#search-result-container').html(div);
}

function displayNoSearchResults() {
    const span = $(document.createElement('span'))
        .addClass('material-symbols-rounded')
        .text('error');
    const p = $(document.createElement('p'))
        .text('No results found.');
    const div = $(document.createElement('div'))
        .addClass('search-dialogue')
        .append(span, p);
    $('#search-result-container').html(div);
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
    if (!inputValue) {
        return displayNoSearchResults();
    }
    const response = await fetch(`/song/${inputValue}`, { method: 'GET' });
    if (!response.ok) { return; } // handle errors later
    const body = await response.json();
    songResults = body;
    updateSongResults();
}


let debounceSearch = false;
let lastSearch = '';

// $('#search-button').on('click', onSearch);
$('#search-input').on('input', function () {
    stallSearchResults();
    if (!debounceSearch) {
        debounceSearch = true;
        onSearch();
        lastSearch = $('#search-input').val();
        setTimeout(() => {
            debounceSearch = false;
            if ($('#search-input').val() !== lastSearch) {
                onSearch();
            }
        }, 1000);
    }
});
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
