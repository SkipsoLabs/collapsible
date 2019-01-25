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
     * Get initial dimensions for each item, in order to approximate
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
     * Calculate the available space based on the page width, and return
     * the amount of items we must collapse.
     * 
     * @returns {Number} Amount of items to collapse
     */
    getAmountOfItemsToCollapse() {
        const renderable = { amount: 0, width: 0 };
        const pageWidth = document.body.offsetWidth;

        for (let i = 0; i < this.items.length; i++) {
            const itemWidth = this.itemsDimensions[i];
            renderable.width += itemWidth;

            if ((pageWidth - renderable.width) < this.threshold)
                break;

            renderable.amount++;
        }

        return this.items.length - renderable.amount;
    }

    collapse() {
        const menu = this.container.querySelector('.collapsible-menu');
        const dropdown = menu.querySelector('.collapsible-dropdown');
        const dropdownItems = dropdown.querySelectorAll('li');
        const amountOfItemsToCollapse = this.getAmountOfItemsToCollapse();

        // Default case on large screens and when there is enough space
        menu.classList.remove('hide');
        
        if (amountOfItemsToCollapse === 0) {
          menu.classList.add('hide');
        }

        // Clear the state for each item: both in the original list and in the collapsed one
        this.items.forEach((item, index) => {
            const clone = dropdownItems[index];

            item.classList.remove('hide');
            clone.classList.add('hide');
        });

        for (let i = 0; i < amountOfItemsToCollapse; i++) {
            const index = dropdownItems.length - i - 1;
            const item = this.items[index];
            const clone = dropdownItems[index];

            item.classList.add('hide');
            clone.classList.remove('hide');
        }
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

        // Attach event to toggle dropdown menu, without using default Bootstrap jQuery-based script
        button.addEventListener('click', (ev) => {
            ev.preventDefault();
            dropdown.classList.toggle('open');
        });

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
     * containing the code to collapse exceeding items when necessary.
     */
    render() {
        this.inject();
        this.collapse();
        new ResizeSensor(this.container, this.collapse.bind(this));
    }
}
