
let user = {};

function logOut() {
    Cookies.remove('username');
    user = {};
    PageManager.switchToPage('login');
}

async function logIn(username) {
    if (!Cookies.get(username)) {
        Cookies.set('username', username, { path: '/', expires: 7 });
    }
    let response;

    try {
        response = await fetch(`/user/${username}`, { method: 'GET' });
    }
    catch (error) {
        createError('Lost connection to the server. Please try again later.', 1000 * 10);
        return;
    }

    if (!response.ok) {
        const body = await response.json();
        createError(body.message, 1000 * 10);
        return;
    }

    const body = await response.json();
    user = body;
    await updateUserProfile();
    PageManager.switchToPage('profile');
    createLogoutButton();
}

async function register(username) {
    let response;

    try {
        response = await fetch('/user', {
            method: 'POST',
            body: JSON.stringify({
                username,
                profileColour: '#ffffff'
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    catch (error) {
        createError('Lost connection to the server. Please try again later.', 1000 * 10);
        return;
    }

    if (!response.ok) {
        const body = await response.json();
        createError(body.message, 1000 * 10);
        return;
    }

    const body = await response.json();
    user = body;
    await updateUserProfile();
    PageManager.switchToPage('profile');
    createLogoutButton();
    Cookies.set('username', username, { path: '/', expires: 7 });
}

function createLogoutButton() {
    let icon = $(document.createElement('span')).addClass('material-symbols-rounded');
    icon.html('logout');
    let logoutButton = $(document.createElement('button'))
        .append(icon)
        .on('click', function () {
            logOut();
            $(this).remove();
        });
    $('header').append(logoutButton);
}

(async function attemptSessionLogin() {
    const username = Cookies.get('username');
    if (username) { logIn(username); }
})();

$('#login-link').on('click', function (event) {
    event.preventDefault();
    PageManager.switchToPage('login');
});

$('#register-link').on('click', function (event) {
    event.preventDefault();
    PageManager.switchToPage('register');
});

$('#register-form').submit(async function (event) {
    event.preventDefault();
    const form = $(this)[0];
    const username = $(`#${form.id} > [name="username"]`).val();
    await register(username);
    form.reset();
});

$('#login-form').submit(function (event) {
    event.preventDefault();
    const form = $(this)[0];
    const username = $(`#${form.id} > [name="username"]`).val();
    logIn(username);
    form.reset();
});
