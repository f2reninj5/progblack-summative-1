
Pages.on('switchfrom', 'profile', function () {
    // reset and hide the create playlist form
    $('#create-playlist-form')[0].reset();
    $('#create-playlist')[0].hidden = true;
});

Pages.on('switchto', 'profile', async function () { await updateProfilePage(); });

/**
 * Update the user details and playlists on the profile page.
 */
async function updateProfilePage() {
    // update elements displaying the username
    for (let element of $('.username')) {
        $(element).text(user.username);
    }
    // update the profile colour variable in the styles
    $(':root').css('--profile', hexToRGB(user.profileColour));
    // update the value of the colour selector
    $('input[type=color]').val(user.profileColour);
    await updateProfilePlaylists();
}

/**
 * Update the user playlists on the profile page.
 */
async function updateProfilePlaylists() {
    // GET user's playlists
    const body = await fetchAndParse(`/user/${user.username}/playlist`, { method: 'GET' });
    if (!body) { return; }

    const playlistContainer = $('#playlist-container');
    const playlists = $('#playlist-container>.playlist');

    // clear div containing playlists apart from the add button
    for (let i = 1; i < playlists.length; i++) {
        playlists[i].remove();
    }

    // generate list of playlists within the container
    for (let playlistData of body) {
        const playlist = $(document.createElement('button')).addClass('playlist');
        const playlistName = $(document.createElement('h4')).text(playlistData.name);
        const songCount = $(document.createElement('small')).text(`Songs: ${playlistData.songCount}`);
        const createdAtDate = new Date(playlistData.createdAt);
        const createdAt = $(document.createElement('small')).text(createdAtDate.toLocaleDateString());
        playlist.append(playlistName, songCount, createdAt);

        playlist.on('click', async function () {
            // GET user's playlist data
            const body = await fetchAndParse(`user/${user.username}/playlist/${playlistData.name}`, { method: 'GET' });
            if (!body) { return; }

            currentPlaylist = body;
            Pages.switchToPage('playlist');
        });

        playlistContainer.append(playlist);
    }
}

// executes when the colour picker input is changed
$('input[type=color]').change(async function () {
    // PUT user with new profile colour
    const body = await fetchAndParse(`/user/${user.username}`, {
        method: 'PUT',
        body: JSON.stringify({ profileColour: $(this).val() }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!body) { return; }

    user = body;
    await updateProfilePage();
});

$('#create-playlist-button').on('click', function () {
    // show create playlist modal
    $('#create-playlist')[0].hidden = false;
});

$('#close-create-playlist-form-button').on('click', function (event) {
    event.preventDefault();
    // hide create playlist modal
    $('#create-playlist')[0].hidden = true;
});

$('#create-playlist-form').submit(async function (event) {
    event.preventDefault();
    const form = $(this)[0];
    const name = $(`#${form.id} > [name="playlist-name"]`).val();

    // POST user's new playlist
    const body = await fetchAndParse(`/user/${user.username}/playlist`, {
        method: 'POST',
        body: JSON.stringify({
            name
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!body) { return; }

    currentPlaylist = body;
    Pages.switchToPage('playlist');
});
