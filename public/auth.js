
// $.ajax({
//     type: 'POST',
//     url: '/register',
//     data: JSON.stringify({ username: 'fn', password: 'test' }),
//     contentType: 'application/json',
//     success: function (response) {
//         console.log(response);
//     }
// });

function createLogoutButton() {
    let logoutButton = $(document.createElement('button'))
        .text('Log Out')
        .on('click', async function () {
            const response = await fetch('/logout', { method: 'POST' });
            if (!response.ok) { return console.log(response); }
            PageManager.switchToPage('login');
            $(this).remove();
        });
    $('header').append(logoutButton);
}

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
    createLogoutButton();
    form.reset();
}

(async function attemptSessionLogin() {
    if (getCookie('sessionId')) {
        const response = await fetch('/session/login', { method: 'POST' });
        if (!response.ok) { return; }
        const body = await response.json();
        user = body;
        PageManager.switchToPage('search');
        createLogoutButton();
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
