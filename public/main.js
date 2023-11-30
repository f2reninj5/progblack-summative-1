
let user = {};

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

function getCookie(name) {
    for (let cookie of document.cookie.split(';')) { // Linear search of cookie for specific value
        let parts = cookie.split('='); // Separate names of properties from values
        if (parts[0] === name) {
            return parts[1]; // Return searched data
        }
    }
    return undefined; // Return undefined if name does not exist in cookie
}

PageManager.registerPages();
PageManager.switchToPage('login');
