
/**
 * @param {string} hex hex string in form #abcdef
 * @returns rgb string in form 255, 255, 255
 */
function hexToRGB(hex) {
    let result = [];
    for (let i = 1; i < 6; i += 2) {
        result.push(parseInt(hex.slice(i, i + 2), 16));
    }
    return result.join(', ');
}

const Pages = {
    pages: {},
    shown: null,
    events: {
        'switchto': 'switchTo',
        'switchfrom': 'switchFrom',
        'switchtoend': 'switchToEnd'
    },
    registerPages: function () {
        // for each main element
        for (let main of $('main')) {
            // the name of the page is the part before -page in the id
            let name = main.id.split('-page');
            // if the id is in this form
            if (name.length == 2) {
                // then save element in pages
                this.pages[name[0]] = main;
            }
        }
    },
    switchToPage: async function (pageName) {
        if (this.shown) {
            this.shown.hidden = true;
            await this.shown.switchFrom?.();
        }
        this.shown = this.pages[pageName];
        await this.shown.switchTo?.();
        this.shown.hidden = false;
        await this.shown.switchToEnd?.();
    },
    on: function (event, pageName, callback) {
        if (!Object.keys(this.events).includes(event)) {
            throw new Error('Invalid event');
        }
        if (!Object.keys(this.pages).includes(pageName)) {
            throw new Error('Invalid page');
        }
        this.pages[pageName][this.events[event]] = callback;
    }
};

Pages.registerPages();
Pages.switchToPage('login');

$('button.profile-return').on('click', function () { Pages.switchToPage('profile'); });
$('button.playlist-return').on('click', function () { Pages.switchToPage('playlist'); });

/**
 * @param  {...any} fetchParameters parameters to pass directly into the fetch function
 * @returns the response body or null if there was an error
 */
async function fetchAndParse(...fetchParameters) {
    let response;

    try {
        response = await fetch(...fetchParameters);
    }
    catch (error) {
        createError('Lost connection to the server. Please try again later.', 1000 * 10);
        return null;
    }

    const body = await response.json();
    if (!response.ok) {
        createError(body.message, 1000 * 10);
        return null;
    }

    return body;
}

/**
 * @param {string} message the message to display in the error
 * @param {number} timeout how long before the error should automatically disappear
 */
function createError(message, timeout = undefined) {
    const errorStack = $('#error-stack');
    const error = $(document.createElement('div')).addClass('error');
    const icon = $(document.createElement('span')).addClass('material-symbols-rounded').html('error');
    const messageP = $(document.createElement('p')).text(message);
    const closeButton = $(document.createElement('button'));
    const closeButtonIcon = $(document.createElement('span')).addClass('material-symbols-rounded').html('close');

    error.on('animationend', function (event) {
        if (event.originalEvent.animationName === 'fade-slide-out') {
            error.remove();
        }
    });

    closeButton.on('click', function () {
        error.css('animation', 'fade-slide-out 1s forwards');
    });

    closeButton.html(closeButtonIcon);
    error.append(icon, messageP, closeButton);
    errorStack.append(error);

    if (timeout) {
        setTimeout(async () => {
            error.css('animation', 'fade-slide-out 1s forwards');
        }, timeout);
    }
}

/**
 * @param {string} message the message to display in the dialogue box
 * @param {Function} onConfirm the function to call when the confirm button is pressed
 */
function createConfirmDialogue(message, onConfirm) {
    const background = $(document.createElement('div')).addClass('dialogue-background');
    const dialgoue = $(document.createElement('div')).addClass('dialogue');
    const header = $(document.createElement('div')).addClass('header');
    const messageH = $(document.createElement('h3')).text(message);
    const closeButton = $(document.createElement('button'));
    const closeIcon = $(document.createElement('span')).addClass('material-symbols-rounded').html('close');
    const confirmButton = $(document.createElement('button')).text('Confirm');
    closeButton.html(closeIcon);
    header.append(messageH, closeButton);
    dialgoue.append(header, confirmButton);
    background.html(dialgoue);

    confirmButton.on('click', function () {
        onConfirm();
        background.remove();
    });
    closeButton.on('click', function () {
        background.remove();
    });

    $('body').append(background);
}
