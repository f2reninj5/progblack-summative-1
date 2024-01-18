
function hexToRGB(hex) {
    let result = [];
    for (let i = 1; i < 6; i += 2) {
        result.push(parseInt(hex.slice(i, i + 2), 16));
    }
    return result.join(', ');
}

const PageManager = {
    pages: {},
    shown: null,
    events: {
        'switchto': 'switchTo',
        'switchfrom': 'switchFrom'
    },
    registerPages: function () {
        for (let main of $('main')) { // iterate through all 'main' elements
            let name = main.id.split('-page');
            if (name.length == 2) {
                this.pages[name[0]] = main;
            }
        }
    },
    switchToPage: async function (pageName) {
        if (this.shown) {
            this.shown.hidden = true;
            await this.shown?.switchFrom();
        }
        this.shown = this.pages[pageName];
        await this.shown?.switchTo();
        this.shown.hidden = false;
    },
    on: function (pageName, event, callback) {
        if (!Object.keys(this.events).includes(event)) {
            throw new Error('Invalid event provided');
        }
        pages[pageName][this.events[event]] = callback;
    }
};

PageManager.registerPages();
PageManager.switchToPage('login');

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
        const body = await response.json();
        createError(body.message, 1000 * 10);
        return null;
    }

    return body;
}

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
