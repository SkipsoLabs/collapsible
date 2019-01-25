/**
 * Collapse navbar items dynamically, when there isn't enough space on the screen.
 *
 * @param {String} selector The selector for the items' container
 * @param {Number} threshold The minimum available space in the container
 */
class Collapsible {
    constructor(selector, threshold) {
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
    queryContainer(selector) {
        const container = document.querySelector(selector);
    
        if (!container) {
            throw new Error('Collapsible: No element find using "' + selector + '" selector');
        }
    
        return container;
    }

    /**
     * /Get initial dimensions for each item, in order to approximate
     * the space necessary to render them all.
     */
    getItemsDimensions() {
        const dimensions = [];
    
        for (let i = 0; i < this.items.length; i++) {
            const item  = this.items[i];
            const width = item.getBoundingClientRect().width;
    
            dimensions.push(width);
        }
    
        return dimensions;
    }

    /**
     * Inject the collapsed menu which will contain the exceeding items.
     * The default content is meant to act like a placeholder.
     * You should customize this method based on your needs.
     */
    inject() {
        const menu = document.createElement('li');
        menu.classList.add('collapsible-menu');

        const dropdownList = document.createElement('ul');
        dropdownList.classList.add('dropdown-menu', 'collapsible-dropdown-list');

        const icon = document.createElement('span');
        icon.classList.add('fas', 'fa-bars');

        const dropdown = document.createElement('div');
        dropdown.classList.add('dropdown', 'collapsible-dropdown');
        
        const button = document.createElement('button');
        button.classList.add('btn', 'dropdown-toggle', 'collapsible-toggle');

        // Copy items from the original navbar
        this.items.forEach((item) => {
            const clone = item.cloneNode(true);

            clone.classList.add('hide');
            dropdownList.append(clone);
        });

        button.append(icon);
        dropdown.append(button);
        dropdown.append(dropdownList);

        menu.append(dropdown);
        this.container.append(menu);
    }

    /**
     * Initialize the resize sensor and assign it the right callback,
     * containing the code to collapse exceeding items when needed.
     */
    render() {
        this.inject();
    }
}
