
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
    registerPages: function () {
        for (let main of $('main')) { // iterate through all 'main' elements
            let name = main.id.split('-page');
            if (name.length == 2) {
                this.pages[name[0]] = main;
            }
        }
    },
    switchToPage: function (pageId) {
        if (this.shown) {
            this.shown.hidden = true;
        }
        this.shown = this.pages[pageId];
        this.shown.hidden = false;
    }
};

PageManager.registerPages();
PageManager.switchToPage('login');
