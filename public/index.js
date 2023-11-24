
let user = {};

// $.ajax({
//     type: 'POST',
//     url: '/register',
//     data: JSON.stringify({ username: 'fn', password: 'test' }),
//     contentType: 'application/json',
//     success: function (response) {
//         console.log(response);
//     }
// });

async function onAuthSubmit(event) {
    event.preventDefault();

    const form = $(this)[0];
    const username = $(`#${form.id} > [name="username"]`).val();
    const password = $(`#${form.id} > [name="password"]`).val();

    const response = await fetch(`/${form.id.split('-form')[0]}`, { // use jquery ig
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) { return; }
    const body = await response.json();
    user = body;
    PageManager.switchToPage('search');
    let logoutButton = $(document.createElement('button'))
        .text('Log Out')
        .on('click', async function () {
            const response = await fetch('/logout', { method: 'POST' });
            if (!response.ok) { return console.log(response); }
            PageManager.switchToPage('login');
        });
    $('header').append(logoutButton);
    form.reset();
}

class PageManager {
    static pages = {};
    static shown = null;

    static registerPages() {
        for (let main of $('main')) {
            let name = main.id.split('-page');
            if (name.length == 2) {
                this.pages[name[0]] = main;
            }
        }
    }

    static switchToPage(pageId) {
        if (this.shown) {
            this.shown.hidden = true;
        }

        this.shown = this.pages[pageId];
        this.shown.hidden = false;
    }
}

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

function getCookie(name) {
    for (let cookie of document.cookie.split(';')) { // Linear search of cookie for specific value
        let parts = cookie.split('='); // Separate names of properties from values
        if (parts[0] === name) {
            return parts[1]; // Return searched data
        }
    }
    return undefined; // Return undefined if name does not exist in cookie
}

(async function attemptSessionLogin() {
    if (getCookie('sessionId')) {
        const response = await fetch('/session/login', { method: 'POST' });
        if (!response.ok) { return; }
        const body = await response.json();
        user = body;
        PageManager.switchToPage('search');
        let logoutButton = $(document.createElement('button'))
            .text('Log Out')
            .on('click', async function () {
                const response = await fetch('/logout', { method: 'POST' });
                if (!response.ok) { return console.log(response); }
                $(this).remove();
                PageManager.switchToPage('login');
            });
        $('header').append(logoutButton);
    }
})();

$('#login-link').on('click', function (event) {
    event.preventDefault();
    PageManager.switchToPage('login');
});

$('#register-link').on('click', function (event) {
    event.preventDefault();
    PageManager.switchToPage('register');
});

$('#register-form').submit(onAuthSubmit);
$('#login-form').submit(onAuthSubmit);

PageManager.registerPages();
PageManager.switchToPage('login');

$('#search-input').val('hello world');
onSearch();

async function onSearch() {
    const inputValue = $('#search-input').val();
    if (!inputValue) { return; }
    const searchURL = LastFMRequestBuilder.methods.track.search(inputValue);

    const response = await fetch(searchURL, { method: 'POST' });
    if (!response.ok) { return; }
    const body = await response.json();
    const trackMatches = body.results.trackmatches.track;
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
}

// $('#search-button').on('click', onSearch);
$('#search-input').on('input', onSearch);
// `function` notation gives correct value of `this`
$('#search-input').on('click', function () {
    $(this).focus();
    $(this).select();
});
