﻿describe("when command can execute", function () {

    var tasks = {
        all: ko.observableArray()
    };

    var operations = {
        all: ko.observableArray()
    };

    var messengerFactory = {
        create: function () { },
        global: function () { }
    };
    var operationsFactory = {
        create: function () { return operations; }
    };
    var tasksFactory = {
        create: function () {
            return tasks;
        }
    };

    var region = new Bifrost.views.Region(
        messengerFactory,
        operationsFactory,
        tasksFactory
    );
    var hasChanges = false;
    region.hasChanges.subscribe(function (newValue) {
        hasChanges = newValue;
    });

    var operation = { some: "operation" };
    operations.all.push(operation);
    operations.all.remove(operation)

    it("should not have changes", function () {
        expect(hasChanges).toBe(false);
    });
});