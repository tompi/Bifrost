﻿Bifrost.namespace("Bifrost.views", {
    ViewModelApplierTask: Bifrost.views.ComposeTask.extend(function (view, masterViewModel, viewModelLoader, documentService, regionManager, viewModelManager) {
        /// <summary>Represents a task for applying a single viewModel</summary>
        var self = this;

        function applyViewModel(instance, target) {
            var viewModelFile = documentService.getViewModelFileFrom(target);
            documentService.setViewModelOn(target, instance);

            ko.applyBindingsToNode(target, {
                'viewModel': instance
            });

            if (typeof instance.activated == "function") {
                instance.activated();
            }
        }

        function applyViewModelsByAttribute(path, container, promise) {
            var viewModelApplied = false;

            var elements = documentService.getAllElementsWithViewModelFilesFrom(container);
            if (elements.length > 0) {

                function loadAndApply(target) {
                    viewModelApplied = true;
                    var viewModelFile = $(target).data("viewmodel-file");
                    viewModelLoader.load(viewModelFile).continueWith(function (instance) {
                        applyViewModel(instance, target, viewModelFile);
                        instance.region.viewModel = instance;
                        promise.signal(instance);
                    });
                }

                if (elements.length == 1) {
                    loadAndApply(elements[0]);
                } else {
                    for (var elementIndex = elements.length - 1; elementIndex > 0; elementIndex--) {
                        loadAndApply(elements[elementIndex]);
                    }
                }
            }

            return viewModelApplied;
        }

        function applyViewModelByConventionFromPath(path, container) {
            var promise = Bifrost.execution.Promise.create();
            if (viewModelManager.hasForView(path)) {
                var viewModelFile = Bifrost.Path.changeExtension(path, "js");
                documentService.setViewModelFileOn(container, viewModelFile);

                viewModelLoader.load(viewModelFile).continueWith(function (instance) {
                    applyViewModel(instance, target, viewModelFile);
                    instance.region.viewModel = instance;
                    promise.signal(instance);
                });
            } else {
                promise.signal(null);
            }
            
            return promise;
        }



        this.execute = function () {
            var promise = Bifrost.execution.Promise.create();

            var viewModelApplied = false;

            regionManager.getFor(view).continueWith(function (region) {
                var previousRegion = Bifrost.views.Region.current;
                Bifrost.views.Region.current = region;

                if (viewModelManager.hasForView(view.path)) {
                    var viewModelFile = Bifrost.Path.changeExtension(view.path, "js");
                    documentService.setViewModelFileOn(view.element, viewModelFile);

                    viewModelLoader.load(viewModelFile, region).continueWith(function (instance) {
                        applyViewModel(instance, view.element);
                        region.viewModel = instance;
                        promise.signal(instance);
                    });
                } else {
                    viewModelApplied = applyViewModelsByAttribute(view.path, view.element, promise);
                    if (viewModelApplied == false) {
                        applyViewModelByConventionFromPath(view.path, view.element, region).continueWith(function (instance) {
                            promise.signal(instance);
                        });
                    } else if( Bifrost.isNullOrUndefined(viewModelApplied) ) {
                        promise.signal(viewModelApplied);
                    }
                }

                Bifrost.views.Region.current = previousRegion;
            });

            return promise;
        };
    })
});