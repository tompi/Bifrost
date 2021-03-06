﻿Bifrost.namespace("Bifrost", {
    documentService: Bifrost.Singleton(function (DOMRoot) {
        var self = this;

        this.DOMRoot = DOMRoot;

        this.getAllElementsWithViewModelFiles = function () {
            return self.getAllElementsWithViewModelFilesFrom(self.DOMRoot);
        };

        this.pageHasViewModel = function (viewModel) {
            var context = ko.contextFor($("body")[0]);
            if (Bifrost.isUndefined(context) ) {
                return false;
            }
            return context.$data === viewModel;
        };

        this.getAllElementsWithViewModelFilesFrom = function (root) {
            var elements = [];
            if (typeof $(root).data("viewmodel-file") != "undefined") {
                elements.push(root);
            }
            $("[data-viewmodel-file]",root).each(function () {
                elements.push(this);
            });
            return elements;
        };

        function collectViewModelFilesFrom(parent, elements) {

            if (typeof parent.childNodes != "undefined") {
                parent.childNodes.forEach(function (child) {
                    collectViewModelFilesFrom(child, elements);
                });
            }

            var viewModelFile = $(parent).data("viewmodel-file");
            if (typeof viewModelFile != "undefined") {
                elements.push(parent);
            }
        }

        this.getAllElementsWithViewModelFilesSorted = function () {
            return self.getAllElementsWithViewModelFilesSortedFrom(self.DOMRoot);
        };

        this.getAllElementsWithViewModelFilesSortedFrom = function (root) {
            var elements = [];
            collectViewModelFilesFrom(root, elements);
            return elements;
        };

        this.getViewUriFrom = function (element) {
            var uri = $(element).data("view");
            if (typeof uri == "undefined") uri = "";
            return uri;
        };

        this.setViewUriOn = function (element, uri) {
            $(element).data("view", uri);
            $(element).attr("data-view", uri);
        };

        this.hasViewUri = function (element) {
            return Bifrost.isString($(element).data("view"));
        };


        this.getViewFileFrom = function (element) {
            var file = $(element).data("view-file");
            if (typeof file == "undefined") file = "";
            return file;
        };

        this.setViewFileOn = function (element, file) {
            $(element).data("view-file", file);
            $(element).attr("data-view-file", file);
        };

        this.hasViewFile = function (element) {
            return Bifrost.isString($(element).data("view-file"));
        };


        this.getViewModelFileFrom = function (element) {
            var file = $(element).data("viewmodel-file");
            if (typeof file == "undefined") file = "";
            return file;
        };

        this.setViewModelFileOn = function (element, file) {
            $(element).data("viewmodel-file", file);
            $(element).attr("data-viewmodel-file", file);
        };

        this.setViewModelOn = function (element, viewModel) {
            element.viewModel = viewModel;
            $(element).data("viewmodel", viewModel);
        };

        this.getViewModelFrom = function (element) {
            return element.viewModel;
        };


        this.hasOwnRegion = function (element) {
            /// <summary>Check if element has its own region</summary>
            /// <param name="element" type="HTMLElement">HTML Element to check</param>
            /// <returns>true if it has its own region, false it not</returns>

            if (element.region) return true;
            return false;
        };

        this.getParentRegionFor = function (element) {
            /// <summary>Get the parent region for a given element</summary>
            /// <param name="element" type="HTMLElement">HTML Element to get for</param>
            /// <returns>An instance of the region, if no region is found it will return null</returns>
            var found = null;

            while (element.parentNode) {
                element = element.parentNode;
                if (element.region) return element.region;
            }

            return found;
        }

        this.getRegionFor = function (element) {
            /// <summary>Get region for an element, either directly or implicitly through the nearest parent, null if none</summary>
            /// <param name="element" type="HTMLElement">HTML Element to get for</param>
            /// <returns>An instance of the region, if no region is found it will return null</returns>
            var found = null;

            if (element.region) return element.region;
            found = self.getParentRegionFor(element);
            return found;
        };

        this.setRegionOn = function (element, region) {
            /// <summary>Set region on a specific element</summary>
            /// <param name="element" type="HTMLElement">HTML Element to set on</param>
            /// <param name="region" type="Bifrost.views.Region">Region to set on element</param>

            element.region = region;
        };

        this.traverseObjects = function(callback, element) {
            /// <summary>Traverse objects and call back for each element</summary>
            /// <param name="callback" type="Function">Callback to call for each element found</param>
            /// <param name="element" type="HTMLElement" optional="true">Optional root element</param>
            element = element || self.DOMRoot;
            if( !Bifrost.isNullOrUndefined(element) ) {
                callback(element);

                if( element.hasChildNodes() ) {
                    var child = element.firstChild;
                    while( child ) {
                        if( child.nodeType === 1 ) {
                            self.traverseObjects(callback, child);
                        }
                        child = child.nextSibling;
                    }
                }
            }
        };

        this.getUniqueStyleName = function(prefix) {
            var id = Bifrost.Guid.create();
            var name = prefix+"_"+id;
            return name;
        };

        this.addStyle = function(selector, style) {
            /// <summary>Add a style dynamically into the browser</summary>
            /// <param name="selector" type="String">Selector that represents the class</param>
            /// <param name="style" type="Object">Key/value pair object for styles</param>
            if(!document.styleSheets) {
                return;
            }

            var styleString = "";
            for( var property in style ) {
                styleString = styleString + property +":" + style[property]+";";
            }
            style = styleString;

            if(document.getElementsByTagName("head").length == 0) {
                return;
            }

            var stylesheet;
            var mediaType;
            if(document.styleSheets.length > 0) {
                for( i = 0; i < document.styleSheets.length; i++) {
                    if(document.styleSheets[i].disabled) {
                        continue;
                    }
                    var media = document.styleSheets[i].media;
                    mediaType = typeof media;

                    if(mediaType == "string") {
                        if(media == "" || (media.indexOf("screen") != -1)) {
                            styleSheet = document.styleSheets[i];
                        }
                    } else if(mediaType == "object") {
                        if(media.mediaText == "" || (media.mediaText.indexOf("screen") != -1)) {
                            styleSheet = document.styleSheets[i];
                        }
                    }

                    if( typeof styleSheet != "undefined") {
                        break;
                    }
                }
            }

            if( typeof styleSheet == "undefined") {
                var styleSheetElement = document.createElement("style");
                styleSheetElement.type = "text/css";

                document.getElementsByTagName("head")[0].appendChild(styleSheetElement);

                for( i = 0; i < document.styleSheets.length; i++) {
                    if(document.styleSheets[i].disabled) {
                        continue;
                    }
                    styleSheet = document.styleSheets[i];
                }

                var media = styleSheet.media;
                mediaType = typeof media;
            }

            if(mediaType == "string") {
                for( i = 0; i < styleSheet.rules.length; i++) {
                    if(styleSheet.rules[i].selectorText && styleSheet.rules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
                        styleSheet.rules[i].style.cssText = style;
                        return;
                    }
                }

                styleSheet.addRule(selector, style);
            } else if(mediaType == "object") {
                for( i = 0; i < styleSheet.cssRules.length; i++) {
                    if(styleSheet.cssRules[i].selectorText && styleSheet.cssRules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
                        styleSheet.cssRules[i].style.cssText = style;
                        return;
                    }
                }

                styleSheet.insertRule(selector + "{" + style + "}", 0);
            }
        };
    })
});