﻿Bifrost.namespace("Bifrost.io", {
    fileManager: Bifrost.Singleton(function () {
        /// <summary>Represents a manager for files, providing capabilities of loading and more</summary>
        var self = this;

        var uri = Bifrost.Uri.create(window.location.href);
        this.origin = uri.scheme + "://" + uri.host + (uri.port == 80 ? "" : ":" + uri.port);

        function getActualFilename(filename) {
            var actualFilename = self.origin;

            if (filename.indexOf("/") != 0) {
                actualFilename += "/";
            }
            actualFilename += filename;

            return actualFilename;
        }

        this.load = function (files) {
            /// <summary>Load files</summary>
            /// <param parameterArray="true" elementType="Bifrost.io.File">Files to load</param>
            /// <returns type="Bifrost.execution.Promise">A promise that can be continued with the actual files coming in as an array</returns>
            var filesToLoad = [];

            var promise = Bifrost.execution.Promise.create();

            files.forEach(function (file) {
                var path = getActualFilename(file.path.fullPath);
                if (file.fileType === Bifrost.io.fileType.html) {
                    path = "text!" + path + "!strip";
                    if (!file.path.hasExtension()) {
                        path = "noext!" + path;
                    }
                }

                filesToLoad.push(path);
            });

            require(filesToLoad, function () {
                promise.signal(arguments);
            });
            
            return promise;
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.fileManager = Bifrost.io.fileManager;