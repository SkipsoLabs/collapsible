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

        this.items = this.container.querySelector('li');
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
        var container = document.querySelector(selector);
    
        if (!container) {
            throw new Error('Collapsible: No element find using "' + selector + '" selector');
        }
    
        return container;
    }

    // Get initial dimensions for each item, in order to approximate the space necessary to render them all.
    getItemsDimensions() {
        var dimensions = [];
    
        for (var i = 0; i < this.items.length; i++) {
            var item  = this.items[i];
            var width = item.getBoundingClientRect().width;
    
            dimensions.push(width);
        }
    
        return dimensions;
    }
}
