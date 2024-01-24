
let currentPlaylist = {};

Pages.on('switchto', 'playlist', function () { updatePlaylistPage(); });

$('button#add-songs').on('click', function () { Pages.switchToPage('search'); });

$('button#delete-playlist').on('click', function () {
    createConfirmDialogue('Are you sure you want to delete this playlist?', async function () {
        // DELETE user playlist
        const body = await fetchAndParse(`/user/${user.username}/playlist/${currentPlaylist.name}`, { method: 'DELETE' });
        if (!body) { return; }

        Pages.switchToPage('profile');
    });
});

/**
 * @param {number} index the zero-indexed position of the song within the current playlist
 * @returns a button element
 */
function createSongRemoveButton(index) {
    const icon = $(document.createElement('span')).addClass('material-symbols-rounded').html('cancel');
    const button = $(document.createElement('button'));
    button.html(icon);

    button.on('click', async function () {
        icon.html('hourglass');

        // DELETE song from user's playlist
        const body = await fetchAndParse(`/user/${user.username}/playlist/${currentPlaylist.name}/song/${index}`, { method: 'DELETE' });
        if (!body) { return; }

        currentPlaylist = body;
        updatePlaylistPage();
    });

    return button;
}

/**
 * Update the contents of the playlist page.
 */
function updatePlaylistPage() {
    // update elements displaying the playlist name
    for (let element of $('.playlist-name')) {
        $(element).text(currentPlaylist.name);
    }

    const songContainer = $('#playlist-song-container');
    // clear div containing songs
    songContainer.html('');
    // update playlist information
    const createdAt = new Date(currentPlaylist.createdAt);
    $('#created-at').text(createdAt.toLocaleDateString());
    $('#song-count').text(currentPlaylist.songs.length);

    // generate list of songs within the container
    for (let i = 0; i < currentPlaylist.songs.length; i++) {
        const songData = currentPlaylist.songs[i];
        const songListing = $(document.createElement('div')).addClass(['song-listing', 'playlist-listing']);
        const index = $(document.createElement('p')).text(i + 1).addClass('index');
        const title = $(document.createElement('p')).addClass('clickable').text(songData.title);
        const artist = $(document.createElement('p')).addClass('clickable').text(songData.artist);
        const removeButton = createSongRemoveButton(i);
        songListing.append(index, title, artist, removeButton);

        artist.on('click', function () { displayArtistInfo(songData.artist); });
        title.on('click', function () { displaySongInfo(songData.artist, songData.title); });

        songContainer.append(songListing, document.createElement('hr'));
    }
}
