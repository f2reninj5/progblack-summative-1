
let searchResults = [];

Pages.on('switchto', 'search', function () { clearSearchResults(); });

Pages.on('switchtoend', 'search', function () { $('#search-input').select(); });

/**
 * @param {{artist: string, name: string}} track 
 * @returns a button element
 */
function createSongAddButton(track) {
    const button = $(document.createElement('button'));
    const icon = $(document.createElement('span')).addClass('material-symbols-rounded').html('add_circle');
    button.html(icon);

    button.on('click', async function () {
        const span = $(this).children('span').first();
        const iconName = span.html();

        // if waiting on a request
        if (iconName === 'hourglass') {
            return;
        }
        // if song just added to current playlist
        else if (iconName === 'check_circle' || iconName === 'cancel') {
            span.html('hourglass');

            const songIndex = currentPlaylist.songs.findLastIndex(
                (song) => song.artist === track.artist && song.title === track.name
            );

            // DELETE song from user's playlist
            const body = await fetchAndParse(`/user/${user.username}/playlist/${currentPlaylist.name}/song/${songIndex}`, { method: 'DELETE', });
            if (!body) { return; }

            currentPlaylist = body;
            span.html('add_circle');
        }
        // if song can be added to current playlist
        else if (iconName === 'add_circle') {
            span.html('hourglass');

            const song = {
                artist: track.artist,
                title: track.name
            };

            // POST new song to user's playlist
            const body = await fetchAndParse(`/user/${user.username}/playlist/${currentPlaylist.name}/song`, {
                method: 'POST',
                body: JSON.stringify(song),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!body) { return; }

            currentPlaylist = body;
            span.html('check_circle');
        }
    });

    button.hover(
        // on hover
        function () {
            const span = $(this).children('span').first();
            // if song just added to current playlist
            if (span.html() === 'check_circle') {
                // show remove icon
                span.html('cancel');
            }
        },
        // off hover
        function () {
            const span = $(this).children('span').first();
            // if showing remove icon
            if (span.html() === 'cancel') {
                // revert to just added icon
                span.html('check_circle');
            }
        }
    );

    return button;
}


function updateSearchResults() {
    // clear div containing songs
    $('#search-result-container').html('');

    // generate list of songs within the container
    for (const track of searchResults) {
        const songListing = $(document.createElement('div')).addClass(['song-listing', 'search-listing']);
        const title = $(document.createElement('p')).addClass('clickable').text(track.name);
        const artist = $(document.createElement('p')).addClass('clickable').text(track.artist);
        const addButton = createSongAddButton(track);
        songListing.append(title, artist, addButton);

        artist.on('click', function () { displayArtistInfo(track.artist); });
        title.on('click', function () { displaySongInfo(track.artist, track.name); });

        $('#search-result-container').append(songListing, document.createElement('hr'));
    }

    if (searchResults.length === 0) {
        displayNoSearchResults();
    }
}

/**
 * Display search prompt
 */
function clearSearchResults() {
    const icon = $(document.createElement('span')).addClass('material-symbols-rounded').html('search');
    const message = $(document.createElement('p')).text('Search for a song!');
    const dialogue = $(document.createElement('div')).addClass('search-dialogue').append(icon, message);
    $('#search-result-container').html(dialogue);
}

/**
 * Display loading icon while waiting for search results.
 */
function stallSearchResults() {
    const icon = $(document.createElement('span')).addClass('material-symbols-rounded').html('hourglass');
    const dialogue = $(document.createElement('div')).addClass('search-dialogue').append(icon);
    $('#search-result-container').html(dialogue);
}

/**
 * Display error when no search results.
 */
function displayNoSearchResults() {
    const icon = $(document.createElement('span')).addClass('material-symbols-rounded').html('error');
    const message = $(document.createElement('p')).text('No results found.');
    const dialogue = $(document.createElement('div')).addClass('search-dialogue').append(icon, message);
    $('#search-result-container').html(dialogue);
}

async function onSearch() {
    const inputValue = $('#search-input').val();
    if (!inputValue) {
        return displayNoSearchResults();
    }

    // GET matching songs from Last.fm
    const body = await fetchAndParse(`/song/${inputValue}`, { method: 'GET' });
    if (!body) { return; }

    searchResults = body;
    updateSearchResults();
}

let debounceSearch = false;
let lastSearch = '';

// executes when search input is changed
$('#search-input').on('input', function () {
    stallSearchResults();

    // if search not on cooldown
    if (!debounceSearch) {
        // ignore more input changes
        debounceSearch = true;

        // handle search
        onSearch();
        lastSearch = $('#search-input').val();

        // after 1 second
        setTimeout(() => {
            // reset cooldown
            debounceSearch = false;
            // check if input changed since
            if ($('#search-input').val() !== lastSearch) {
                onSearch();
            }
        }, 1000);
    }
});

$('#search-input').on('click', function () { $(this).select(); });
