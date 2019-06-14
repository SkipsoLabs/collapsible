/**
 * Collapsible constructor
 * Collapse navbar items dynamically, when there isn't enough space on the screen.
 *
 * @param {String} selector The selector for the items' container
 * @param {Number} threshold The minimum available space in the container
 */
function Collapsible(selector, threshold) {
    this.container = this.queryContainer(selector);
    this.threshold = threshold;

    this.items = this.container.querySelectorAll('li');
    this.itemsDimensions = this.getItemsDimensions();
}

/**
 * Given the selector, query the items' container.
 * If it is unreachable, an exception is throwed.
 *
 * @param {String} selector
 * @returns {*} The items' container element
 */
Collapsible.prototype.queryContainer = function (selector) {
    var container = document.querySelector(selector);

    if (!container) {
        throw new Error('Collapsible: No element find using "' + selector + '" selector');
    }

    return container;
};

/**
 * Get initial dimensions for each item, in order to approximate
 * the space necessary to render them all.
 */
Collapsible.prototype.getItemsDimensions = function () {
    var dimensions = [];
    for (var i = 0; i < this.items.length; i++) {
        var item  = this.items[i];
        var width = item.getBoundingClientRect().width;

        dimensions.push(width);
    }
    return dimensions;
};

/**
 * Calculate the available space based on the page width, and return
 * the amount of items we must collapse.
 *
 * @returns {Number} Amount of items to collapse
 */
Collapsible.prototype.getAmountOfItemsToCollapse = function () {
    var renderable = { amount: 0, width: 0 };
    var pageWidth = document.body.offsetWidth;

    for (var i = 0; i < this.items.length; i++) {
        var itemWidth = this.itemsDimensions[i];
        renderable.width += itemWidth;
        if ((pageWidth - renderable.width) < this.threshold)
            break;
        renderable.amount++;
    }
    return this.items.length - renderable.amount;
};

Collapsible.prototype.collapse = function () {
    var menu = this.container.querySelector('.collapsible-menu');
    var dropdown = menu.querySelector('.collapsible-dropdown');
    var dropdownItems = dropdown.querySelectorAll('li .nav-item');
    var amountOfItemsToCollapse = this.getAmountOfItemsToCollapse();
    //console.log(amountOfItemsToCollapse + " items to collapse");

    /**
     * Default case on large screens and when there is enough space
     * hide dropdown menu when there is nothing to collapse
     * (bootstrap 3: 'hidden', bootstrap 4: 'd-none')
     */
    menu.classList.remove('hidden', 'd-none');
    if (amountOfItemsToCollapse === 0) {
        menu.classList.add('hidden', 'd-none');
    }

    // Clear the state for each item: both in the original list and in the collapsed one
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        var clone = dropdownItems[i];

        item.classList.remove('hidden', 'd-none');
        clone.classList.add('hidden', 'd-none');
    }

    for (var i = 0; i < amountOfItemsToCollapse; i++) {
        var index = dropdownItems.length - i - 1;
        var item = this.items[index];
        var clone = dropdownItems[index];

        item.classList.add('hidden', 'd-none');
        clone.classList.remove('hidden', 'd-none');
    }

};

/**
 * Inject the collapsed menu which will contain the exceeding items.
 * The default content is meant to act like a placeholder.
 * You should customize this method based on your needs.
 */
Collapsible.prototype.inject = function () {
    // toggler button
    var button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-secondary', 'dropdown-toggle', 'collapsible-toggle');
    button.setAttribute('data-toggle', 'dropdown')
    /*
    // Attach event to toggle dropdown menu, without using default Bootstrap jQuery-based script
    button.addEventListener('click', function (ev) {
    ev.preventDefault();
    //dropdown.classList.toggle('open'); // bootstrap 3
    //menu.classList.toggle('show'); // bootstrap 4
    });*/

    // .dropdown-menu
    var dropdownList = document.createElement('ul');
    dropdownList.classList.add('collapsible-dropdown-list', 'list-unstyled');
    //addLink(dropdownList, "MORE");

    // create collapsible menu container: .dropdown
    var dropdown = document.createElement('div');
    dropdown.classList.add('dropdown-menu', 'collapsible-dropdown');

    var menu = document.createElement('li');
    menu.classList.add('nav-item', 'dropdown', 'collapsible-menu');

    // Copy items from the original navbar
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        var clone = item.cloneNode(true);

        clone.classList.add('hidden', 'd-none');
        dropdownList.append(clone);
    }

    menu.append(button);
    dropdown.append(dropdownList);

    menu.append(dropdown);
    this.container.append(menu);
};

/**
 *  @param {HTMLUListElement} dump list into console log
*/
function dumpList(lst) {
    let children = lst.children;
    for(var i = 0; i < lst.length; i++) {
        console.log(lst[i].innerHTML);
    }
}

function addLink(lst, text) {
    var a = document.createElement('a');
    var linkText = document.createTextNode(text);
    a.appendChild(linkText);
    a.title = text;
    lst.append(a);
}

/**
 * Initialize the resize sensor and assign it the right callback,
 * containing the code to collapse exceeding items when necessary
 */
Collapsible.prototype.render = function () {
    this.inject();
    this.collapse();
    new ResizeSensor(this.container.parentElement,
                     this.collapse.bind(this));
};
