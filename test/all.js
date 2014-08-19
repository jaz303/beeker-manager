var Manager = require('..');
var test = require('tape');

function Item() {};

function createManager() {
    var is = [new Item, new Item, new Item];
    var m = new Manager();
    is.forEach(function(i) { m.add(i); });
    return {manager: m, items: is};
}

test("adding item emits change:add event", function(assert) {

    var m = new Manager();
    
    m.events.on("change:add", function(i) {
        assert.equal(i, item);
    });

    var item = new Item();
    m.add(item);

    assert.end();

});

test("adding first item emits activate after change:add", function(assert) {

    var m = new Manager();

    var state = 0;

    m.events.on("change:add", function(i) {
        assert.equal(state++, 0);
    });

    m.events.on("activate", function(newItem, oldItem) {
        assert.equal(state++, 1);
        assert.equal(newItem, item);
        assert.equal(oldItem, null);
        assert.equal(m.active(), newItem);
        assert.end();
    });

    var item = new Item();
    m.add(item);

});

test("adding second item does not emit activate event", function(assert) {

    var m = new Manager();

    m.add(new Item());

    m.events.on("activate", function(active) {
        assert.ok(false);
    });

    m.add(new Item());

    assert.end();

});

test("activating item by index", function(assert) {

    var items = [new Item, new Item, new Item];
    var m = new Manager();
    items.forEach(function(i) { m.add(i); });

    m.activate(1);

    assert.equal(m.active(), items[1]);
    assert.end();

});

test("activating item by object", function(assert) {

    var t = createManager();
    
    t.manager.activate(t.items[2]);

    assert.equal(t.manager.active(), t.items[2]);
    assert.end();

});

test("activating item emits event", function(assert) {

    var t = createManager();

    t.manager.events.on('activate', function(newItem, oldItem) {
        assert.equal(newItem, t.manager.active());
        assert.equal(oldItem, t.manager.at(0));
        assert.end();
    });

    t.manager.activate(t.items[2]);
    
});

test("previous", function(assert) {

    var t = createManager();

    t.manager.previous();
    assert.equals(t.manager.active(), t.items[2]);

    t.manager.previous();
    assert.equals(t.manager.active(), t.items[1]);

    t.manager.previous();
    assert.equals(t.manager.active(), t.items[0]);

    assert.end();

});

test("next", function(assert) {

    var t = createManager();

    t.manager.next();
    assert.equals(t.manager.active(), t.items[1]);

    t.manager.next();
    assert.equals(t.manager.active(), t.items[2]);

    t.manager.next();
    assert.equals(t.manager.active(), t.items[0]);

    assert.end();

});

