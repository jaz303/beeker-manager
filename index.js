module.exports = Manager;

var Collection = require('beeker');

var MUTE = { mute: true };

function Manager() {
    this._collection    = new Collection();
    this._activeIndex   = -1;
    this.events         = this._collection.events;
}

Manager.prototype.at = function(ix) {
    return this._collection.at(ix);
}

Manager.prototype.active = function() {
    if (this._activeIndex < 0) {
        return null;
    } else {
        return this._collection.at(this._activeIndex);
    }
}

Manager.prototype.activate = function(item) {
    if (typeof item === 'number') {
        if (item >= 0 && item < this._collection.length) {
            this._setActive(this._collection.at(item), item);       
        }
    } else {
        var ix = this._collection.indexOf(item);
        if (ix >= 0) {
            this._setActive(item, ix);    
        }
    }
}

Manager.prototype.previous = function() {
    this._cycle(-1);
}

Manager.prototype.next = function() {
    this._cycle(1);
}

Manager.prototype.add = function(item) {
    this._collection.add(item);
    if (this._collection.length === 1) {
        this._setActive(this._collection.at(0), 0);
    }
}

Manager.prototype.remove = function(item) {
    this._remove(this._collection.indexOf(item));
}

Manager.prototype.removeActive = function() {
    this._remove(this._activeIndex);
}

//
// Internals

Manager.prototype._setActive = function(item, ix) {

    var oldItem = this._activeIndex >= 0
                    ? this._collection.at(this._activeIndex)
                    : null;

    this._activeIndex = ix;

    this.events.emit('activate', item, oldItem);

}

Manager.prototype._remove = function(ix) {
    
    if (ix < 0) {
        return;
    }

    var prev = this.active();

    this._collection.removeItemAtIndex(ix);

    // if the collection is now empty, deselect.
    if (this._collection.length === 0) {
        this._activeIndex = -1;
        this.events.emit('activate', null, prev);
        
    // if the selected index was above the removed
    // index, just decrememnt the pointer. no need
    // to emit an event as the actual selected item
    // has not changed.
    } else if (this._activeIndex > ix) {
        this._activeIndex--;

    // if the selected item was removed we need to
    // elected a new selected item.
    } else if (this._activeIndex === ix) {
        if (this._activeIndex === this._collection.length) {
            this._activeIndex--;
        }
        this.events.emit('activate', this._collection.at(this._activeIndex), prev);
    }

}

Manager.prototype._cycle = function(delta) {

    if (this._collection.length === 0) {
        return;
    }
    
    var ix = this._activeIndex + delta;

    if (ix < 0) {
        ix = this._collection.length - 1;
    } else if (ix >= this._collection.length) {
        ix = 0;
    }

    this.activate(ix);

}
