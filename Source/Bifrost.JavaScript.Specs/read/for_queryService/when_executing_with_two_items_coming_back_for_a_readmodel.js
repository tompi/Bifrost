﻿describe("when executing with two items coming back for a read model", function() {
    var task = {
        some: "task"
    };
    var items = [
        { something: 42 },
        { somethingElse: 43 }
    ];
    var tasks = {
        execute: sinon.mock().withArgs(task).returns({
            continueWith: function (callback) {
                callback(items);
            }
        })
    };

    var query = {
        name: "Its a query",
        generatedFrom: "Something",
        getParameterValues: function () { return {}; },
        readModel: "SureIsAReadModel",
        hasReadModel: function () { return true; },
        region: {
            tasks: tasks
        }
    };


    var mappedItems = [
        { somethingElse: 44 },
        { something: 45 }
    ];

    var readModelMapper = {
        mapDataToReadModel: function (readModel, data) {
            return mappedItems;
        }
    };

    var taskFactory = {
        createQuery: function (url, payload) {
            return task;
        }
    };

    var instance = Bifrost.read.queryService.createWithoutScope({
        readModelMapper: readModelMapper,
        taskFactory: taskFactory

    });

    var paging = {
        size: 2,
        number: 5
    };

    var result = null;

    instance.execute(query, paging).continueWith(function (data) {
        result = data;
    });

    it("should map the items and pass the resultto the promise", function () {
        expect(result.items).toBe(mappedItems);
    });
});
