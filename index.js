module.exports = Manager;

var Collection = require('beeker');

function Manager() {
	this._collection 	= new Collection();
	this._activeIndex	= -1;
	this.events 		= this._collection.events;
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
		this._setActive(this._collection.at(item), item);	
	} else {
		this._setActive(item, this._collection.indexOf(item));
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

	if (!item || ix < 0) {
		return;
	}

	var oldItem = this._activeIndex >= 0
					? this._collection.at(this._activeIndex)
					: null;

	this._activeIndex = ix;

	this.events.emit('activate', item, oldItem);

}

Manager.prototype._remove = function(ix) {
	if (ix < 0) return;

	// if (this._collection.length === 0) {
	// 	// TODO: emit switch
	// } else if (this._activeIndex >= ix) {
	// 	this._activeIndex--;
	// }

	// this._collection.removeItemAtIndex(ix);



	// if (ix >= )

	// if (ix === this._activeIndex) {
	// 	// TODO: switch
	// }
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
