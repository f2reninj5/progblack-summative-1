
$('input[type=color]').change(function () {
    $(':root').css('--profile', $(this).val());
    // update in database
});

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
