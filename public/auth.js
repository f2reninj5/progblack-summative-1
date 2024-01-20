
let user = {};

function logOut() {
    Cookies.remove('username');
    user = {};
    Pages.switchToPage('login');
}

async function logIn(username) {
    // if no username cookie set or different username saved
    if (!Cookies.get('username') || Cookies.get('username') === username) {
        // save username cookie for 7 days
        Cookies.set('username', username, { path: '/', expires: 7 });
    }

    // GET user
    const body = await fetchAndParse(`/user/${username}`, { method: 'GET' });
    if (!body) { return; }

    user = body;
    Pages.switchToPage('profile');
    createLogoutButton();
}

async function register(username) {
    // POST new user
    const body = await fetchAndParse('/user', {
        method: 'POST',
        body: JSON.stringify({
            username,
            profileColour: '#ffffff'
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!body) { return; }

    user = body;
    Pages.switchToPage('profile');
    createLogoutButton();
    // save username cookie for 7 days
    Cookies.set('username', username, { path: '/', expires: 7 });
}

function createLogoutButton() {
    const logoutButton = $(document.createElement('button'));
    const icon = $(document.createElement('span')).addClass('material-symbols-rounded').html('logout');
    logoutButton.html(icon);

    logoutButton.on('click', function () {
        logOut();
        // remove itself
        $(this).remove();
    });

    $('header').append(logoutButton);
}

/**
 * Attempt to log in using the username cookie
 */
(async function attemptSessionLogin() {
    const username = Cookies.get('username');
    if (username) { logIn(username); }
})();

$('#login-link').on('click', function (event) {
    event.preventDefault();
    Pages.switchToPage('login');
});

$('#register-link').on('click', function (event) {
    event.preventDefault();
    Pages.switchToPage('register');
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
