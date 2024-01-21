
/**
 * @param {number} ms number of milliseconds to convert
 * @returns duration in form hh:mm:ss
 */
function msToDuration(ms) {
    let date = new Date(parseInt(ms));
    let epoch = new Date(0);
    let hours = date.getHours() - epoch.getHours();
    let minutes = date.getMinutes() - epoch.getMinutes();
    let seconds = date.getSeconds() - epoch.getSeconds();
    let result = [];
    result.push(hours, minutes, seconds);
    return result.map((d) => {
        if (d < 10) { d = `0${d}`; }
        return d;
    }).join(':');
}

function showLoadingDialogue() { $('#loading-dialogue')[0].hidden = false; }

function hideLoadingDialogue() { $('#loading-dialogue')[0].hidden = true; }

$('button#close-artist-info').on('click', function () { $('#artist-info')[0].hidden = true; });

$('button#close-song-info').on('click', function () { $('#song-info')[0].hidden = true; });

/**
 * @param {string} artistName the name of the artist to display
 */
async function displayArtistInfo(artistName) {
    showLoadingDialogue();

    // GET artist information from Last.fm
    const body = await fetchAndParse(`/artist/${artistName}`, { method: 'GET' });
    if (!body) {
        hideLoadingDialogue();
        return;
    }

    // update elements displaying artist name
    for (let element of $('.artist-name')) {
        $(element).text(body.name);
    }

    // update hyperlink URL
    $('#artist-link').text('View on Last.fm').attr('href', body.url);

    // generate statistics elements
    const listeners = $(document.createElement('p')).text(`${body.stats.listeners.toLocaleString()} listeners`);
    const playCount = $(document.createElement('p')).text(`${body.stats.playcount.toLocaleString()} plays`);
    $('#artist-stats').html('').append(listeners, playCount);

    // clear element containing similar artists
    const similarArtistsContainer = $('#similar-artists').html('');
    // generate list of similar artists within the container
    for (let similarArtist of body.similar) {
        const artist = $(document.createElement('a')).text(similarArtist.name).attr('href', similarArtist.url);
        similarArtistsContainer.append(artist);
    }

    $('#artist-info')[0].hidden = false;
    hideLoadingDialogue();
}

/**
 * @param {string} artist the name of the artist whose song to display
 * @param {string} title the title of the song to display
 */
async function displaySongInfo(artist, title) {
    showLoadingDialogue();

    // GET song information from Last.fm
    const body = await fetchAndParse(`/artist/${artist}/song/${title}`, { method: 'GET' });
    if (!body) {
        hideLoadingDialogue();
        return;
    }

    // update elements displaying song artist
    for (let element of $('.song-artist')) {
        $(element).text(body.artist.name);
    }

    // update elements displaying song title
    for (let element of $('.song-title')) {
        $(element).text(body.name);
    }

    // update image source
    $('#song-image').attr('src', body.album.image);
    // update hyperlink URL
    $('#song-link').text('View on Last.fm').attr('href', body.url);

    // generate statistics elements
    const duration = $(document.createElement('p')).text(`Duration ${msToDuration(body.duration)}`);
    const listeners = $(document.createElement('p')).text(`${parseInt(body.listeners).toLocaleString()} listeners`);
    const playCount = $(document.createElement('p')).text(`${parseInt(body.playcount).toLocaleString()} plays`);
    $('#song-stats').html('').append(duration, listeners, playCount);

    if (body.wiki) {
        const published = $(document.createElement('p')).text(`Published ${body.wiki.published}`);
        $('#song-stats').prepend(published);
    }

    // clear element containing tags
    const tagsContainer = $('#song-tags').html('');
    // generate list of tags within the container
    for (let tagData of body.tags) {
        const tag = $(document.createElement('a')).text(tagData.name).attr('href', tagData.url);
        tagsContainer.append(tag);
    }

    $('#song-info')[0].hidden = false;
    hideLoadingDialogue();
}
