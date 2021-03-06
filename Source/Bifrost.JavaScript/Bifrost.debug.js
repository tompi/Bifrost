
function polyfillForEach() {
    if (typeof Array.prototype.forEach !== "function") {
        Array.prototype.forEach = function (callback, thisArg) {
            if( typeof thisArg == "undefined" ) thisArg = window;
            for (var i = 0; i < this.length; i++) {
                callback.call(thisArg, this[i], i, this);
            }
        };
    }
}

function polyFillClone() {
    if (typeof Array.prototype.clone !== "function") {
        Array.prototype.clone = function () {
            return this.slice(0);
        }
    }
}

function shallowEquals() {
    if (typeof Array.prototype.shallowEquals !== "function") {
        Array.prototype.shallowEquals = function (other) {
            if (this === other) return true;
            if (this === null || other === null) return false;
            if (this.length != other.length) return false;

            for (var i = 0; i < this.length; i++) {
                if (this[i] !== other[i]) return false;
            }
            return true;
        }
    }
}

(function () {
    polyfillForEach();
    polyFillClone();
    shallowEquals();
})();
if ( typeof String.prototype.startsWith != 'function' ) {
	String.prototype.startsWith = function( str ) {
		return str.length > 0 && this.substring( 0, str.length ) === str;
	}
};

if ( typeof String.prototype.endsWith != 'function' ) {
	String.prototype.endsWith = function( str ) {
		return str.length > 0 && this.substring( this.length - str.length, this.length ) === str;
	}
};

String.prototype.replaceAll = function (toReplace, replacement) {
    var result = this.split(toReplace).join(replacement);
    return result;
};

String.prototype.toCamelCase = function () {
    var result = this.charAt(0).toLowerCase() + this.substring(1);
    result = result.replaceAll("-", "");
    return result;
};

String.prototype.toPascalCase = function () {
    var result = this.charAt(0).toUpperCase() + this.substring(1);
    result = result.replaceAll("-", "");
    return result;
};

NodeList.prototype.forEach = Array.prototype.forEach;
NodeList.prototype.length = Array.prototype.length;
HTMLCollection.prototype.forEach = Array.prototype.forEach;
HTMLCollection.prototype.length = Array.prototype.length;
// From the following thread : http://stackoverflow.com/questions/1056728/formatting-a-date-in-javascript
Date.prototype.format = function (format) //author: meizz
{
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }

    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
          RegExp.$1.length == 1 ? o[k] :
            ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};
/*
 * classList.js: Cross-browser full element.classList implementation.
 * 2012-11-15
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

if ("document" in self && !(
		"classList" in document.createElement("_") &&
		"classList" in document.createElementNS("http://www.w3.org/2000/svg", "svg")
	)) {

    (function (view) {

        "use strict";

        if (!('Element' in view)) return;

        var
              classListProp = "classList"
            , protoProp = "prototype"
            , elemCtrProto = view.Element[protoProp]
            , objCtr = Object
            , strTrim = String[protoProp].trim || function () {
                return this.replace(/^\s+|\s+$/g, "");
            }
            , arrIndexOf = Array[protoProp].indexOf || function (item) {
                var
                      i = 0
                    , len = this.length
                ;
                for (; i < len; i++) {
                    if (i in this && this[i] === item) {
                        return i;
                    }
                }
                return -1;
            }
            // Vendors: please allow content code to instantiate DOMExceptions
            , DOMEx = function (type, message) {
                this.name = type;
                this.code = DOMException[type];
                this.message = message;
            }
            , checkTokenAndGetIndex = function (classList, token) {
                if (token === "") {
                    throw new DOMEx(
                          "SYNTAX_ERR"
                        , "An invalid or illegal string was specified"
                    );
                }
                if (/\s/.test(token)) {
                    throw new DOMEx(
                          "INVALID_CHARACTER_ERR"
                        , "String contains an invalid character"
                    );
                }
                return arrIndexOf.call(classList, token);
            }
            , ClassList = function (elem) {
                var
                      trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
                    , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
                    , i = 0
                    , len = classes.length
                ;
                for (; i < len; i++) {
                    this.push(classes[i]);
                }
                this._updateClassName = function () {
                    elem.setAttribute("class", this.toString());
                };
            }
            , classListProto = ClassList[protoProp] = []
            , classListGetter = function () {
                return new ClassList(this);
            }
        ;
        // Most DOMException implementations don't allow calling DOMException's toString()
        // on non-DOMExceptions. Error's toString() is sufficient here.
        DOMEx[protoProp] = Error[protoProp];
        classListProto.item = function (i) {
            return this[i] || null;
        };
        classListProto.contains = function (token) {
            token += "";
            return checkTokenAndGetIndex(this, token) !== -1;
        };
        classListProto.add = function () {
            var
                  tokens = arguments
                , i = 0
                , l = tokens.length
                , token
                , updated = false
            ;
            do {
                token = tokens[i] + "";
                if (checkTokenAndGetIndex(this, token) === -1) {
                    this.push(token);
                    updated = true;
                }
            }
            while (++i < l);

            if (updated) {
                this._updateClassName();
            }
        };
        classListProto.remove = function () {
            var
                  tokens = arguments
                , i = 0
                , l = tokens.length
                , token
                , updated = false
            ;
            do {
                token = tokens[i] + "";
                var index = checkTokenAndGetIndex(this, token);
                if (index !== -1) {
                    this.splice(index, 1);
                    updated = true;
                }
            }
            while (++i < l);

            if (updated) {
                this._updateClassName();
            }
        };
        classListProto.toggle = function (token, forse) {
            token += "";

            var
                  result = this.contains(token)
                , method = result ?
                    forse !== true && "remove"
                :
                    forse !== false && "add"
            ;

            if (method) {
                this[method](token);
            }

            return !result;
        };
        classListProto.toString = function () {
            return this.join(" ");
        };

        if (objCtr.defineProperty) {
            var classListPropDesc = {
                get: classListGetter
                , enumerable: true
                , configurable: true
            };
            try {
                objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
            } catch (ex) { // IE 8 doesn't support enumerable:true
                if (ex.number === -0x7FF5EC54) {
                    classListPropDesc.enumerable = false;
                    objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                }
            }
        } else if (objCtr[protoProp].__defineGetter__) {
            elemCtrProto.__defineGetter__(classListProp, classListGetter);
        }

    }(self));
}
// From: http://www.jonathantneal.com/blog/faking-the-future/
this.Element && (function (ElementPrototype, polyfill) {
    function NodeList() { [polyfill] }
    NodeList.prototype.length = Array.prototype.length;

    ElementPrototype.matchesSelector = ElementPrototype.matchesSelector ||
    ElementPrototype.mozMatchesSelector ||
    ElementPrototype.msMatchesSelector ||
    ElementPrototype.oMatchesSelector ||
    ElementPrototype.webkitMatchesSelector ||
    function matchesSelector(selector) {
        var results = this.parentNode.querySelectorAll(selector);
        var resultsIndex = -1;
 
        while (results[++resultsIndex] && results[resultsIndex] != this) {}
 
        return !!results[resultsIndex];
    };

    ElementPrototype.ancestorQuerySelectorAll = ElementPrototype.ancestorQuerySelectorAll ||
    ElementPrototype.mozAncestorQuerySelectorAll ||
    ElementPrototype.msAncestorQuerySelectorAll ||
    ElementPrototype.oAncestorQuerySelectorAll ||
    ElementPrototype.webkitAncestorQuerySelectorAll ||
    function ancestorQuerySelectorAll(selector) {
        for (var cite = this, newNodeList = new NodeList; cite = cite.parentElement;) {
            if (cite.matchesSelector(selector)) Array.prototype.push.call(newNodeList, cite);
        }
 
        return newNodeList;
    };
 
    ElementPrototype.ancestorQuerySelector = ElementPrototype.ancestorQuerySelector ||
    ElementPrototype.mozAncestorQuerySelector ||
    ElementPrototype.msAncestorQuerySelector ||
    ElementPrototype.oAncestorQuerySelector ||
    ElementPrototype.webkitAncestorQuerySelector ||
    function ancestorQuerySelector(selector) {
        return this.ancestorQuerySelectorAll(selector)[0] || null;
    };
})(Element.prototype);
var Bifrost = Bifrost || {};
(function(global, undefined) {
	Bifrost.extend = function extend(destination, source) {
    	return $.extend(destination, source);
	};
})(window);
var Bifrost = Bifrost || {};
Bifrost.namespace = function (ns, content) {

    // Todo: this should not be needed, it is a symptom of something using it being wrong!!! Se issue #232 on GitHub (http://github.com/dolittle/Bifrost/issues/232)
    ns = ns.replaceAll("..", ".");
    if (ns.endsWith(".")) ns = ns.substr(0, ns.length - 1);
    if (ns.startsWith(".")) ns = ns.substr(1);

    var parent = window;
    var name = "";
    var parts = ns.split('.');
    parts.forEach(function (part) {
        if (name.length > 0) {
            name += ".";
        }
        name += part;
        if (!Object.prototype.hasOwnProperty.call(parent, part)) {
            parent[part] = {};
            parent[part].parent = parent;
            parent[part].name = name;
        }
        parent = parent[part];
    });

    if (typeof content === "object") {
        Bifrost.namespace.current = parent;

        for (var property in content) {
            parent[property] = content[property]
        }

        for (var property in parent) {
            if (parent.hasOwnProperty(property)) {
                parent[property]._namespace = parent;
                parent[property]._name = property;
            }
        }
        Bifrost.namespace.current = null;
    }

    return parent;
};
Bifrost.namespace("Bifrost.execution", {
    Promise: function () {
        var self = this;

        this.id = Bifrost.Guid.create();

        this.signalled = false;
        this.callback = null;
        this.error = null;
        this.hasFailed = false;
        this.failedCallback = null;

        function onSignal() {
            if (self.callback != null && typeof self.callback !== "undefined") {
                if (typeof self.signalParameter !== "undefined") {
                    self.callback(self.signalParameter, Bifrost.execution.Promise.create());
                } else {
                    self.callback(Bifrost.execution.Promise.create());
                }
            }
        }

        this.fail = function (error) {
            if (self.failedCallback != null) self.failedCallback(error);
            self.hasFailed = true;
            self.error = error;
        };

        this.onFail = function (callback) {
            if (self.hasFailed) {
                callback(self.error);
            } else {
                self.failedCallback = callback;
            }
            return self;
        };


        this.signal = function (parameter) {
            self.signalled = true;
            self.signalParameter = parameter;
            onSignal();
        };

        this.continueWith = function (callback) {
            this.callback = callback;
            if (self.signalled === true) onSignal();
            return self;
        };
    }
});

Bifrost.execution.Promise.create = function() {
	var promise = new Bifrost.execution.Promise();
	return promise;
};
Bifrost.namespace("Bifrost", {
	isObject : function(o) {
	    return Object.prototype.toString.call(o) === '[object Object]';
	}
});
Bifrost.namespace("Bifrost", {
    isNumber: function (number) {
        if (Bifrost.isString(number)) {
            if (number.length > 1 && number[0] == '0') {
                return false;
            }
        }

        return !isNaN(parseFloat(number)) && isFinite(number);
    }
});
Bifrost.namespace("Bifrost", {
	isArray : function(o) {
		return Object.prototype.toString.call(o) === '[object Array]';
	}
});
Bifrost.namespace("Bifrost", {
    isString: function (value) {
        return typeof value === "string";
        }
});
Bifrost.namespace("Bifrost", {
    isNull: function (value) {
        return value === null;
    }
});
Bifrost.namespace("Bifrost", {
    isUndefined: function (value) {
        return typeof value === "undefined";
    }
});
Bifrost.namespace("Bifrost", {
    isNullOrUndefined: function (value) {
        return Bifrost.isUndefined(value) || Bifrost.isNull(value);
    }
});
Bifrost.namespace("Bifrost", {
    isFunction: function (value) {
        return typeof value === "function";
    }
});
Bifrost.namespace("Bifrost", {
	isType : function(o) {
		return typeof o._typeId != "undefined";
	}
});
Bifrost.namespace("Bifrost", {
	functionParser: {
		parse: function(func) {
			var result = [];
			
			var match = func.toString().match(/function\w*\s*\((.*?)\)/);
			if (match != null) {
			    var arguments = match[1].split(/\s*,\s*/);
			    arguments.forEach(function (item) {
			        if (item.trim().length > 0) {
			            result.push({
			                name: item
			            });
			        }
			    });
			}
			
			return result;
		}
	}
});
Bifrost.namespace("Bifrost", {
    assetsManager: {
        initialize: function () {
            var promise = Bifrost.execution.Promise.create();
            if (typeof Bifrost.assetsManager.scripts === "undefined" ||
                Bifrost.assetsManager.scripts.length == 0) {

                $.get("/Bifrost/AssetsManager", { extension: "js" }, function (result) {
                    Bifrost.assetsManager.scripts = result;
                    Bifrost.namespaces.create().initialize();
                    promise.signal();
                }, "json");
            } else {
                promise.signal();
            }
            return promise;
        },
        initializeFromAssets: function(assets) {
            Bifrost.assetsManager.scripts = assets;
            Bifrost.namespaces.create().initialize();
        },
        getScripts: function () {
            return Bifrost.assetsManager.scripts;
        },
        hasScript: function(script) {
            var found = false;
            Bifrost.assetsManager.scripts.some(function (scriptInSystem) {
                if (scriptInSystem === script) {
                    found = true;
                    return;
                }
            });

            return found;
        },
        getScriptPaths: function () {
            var paths = [];

            Bifrost.assetsManager.scripts.forEach(function (fullPath) {
                var path = Bifrost.Path.getPathWithoutFilename(fullPath);
                if (paths.indexOf(path) == -1) {
                    paths.push(path);
                }
            });
            return paths;
        }
    }
});
//Bifrost.WellKnownTypesDependencyResolver.types.assetsManager = Bifrost.commands.commandCoordinator;
Bifrost.namespace("Bifrost", {
    dependencyResolver: (function () {
        function resolveImplementation(namespace, name) {
            var resolvers = Bifrost.dependencyResolvers.getAll();
            var resolvedSystem = null;
            resolvers.forEach(function (resolver) {
                if (resolvedSystem != null) return;
                var canResolve = resolver.canResolve(namespace, name);
                if (canResolve) {
                    resolvedSystem = resolver.resolve(namespace, name);
                    return;
                }
            });

            return resolvedSystem;
        }

        function isType(system) {
            if (system != null &&
                system._super !== null) {

                if (typeof system._super != "undefined" &&
                    system._super === Bifrost.Type) {
                    return true;
                }

                if (isType(system._super) == true) {
                    return true;
                }
            }

            return false;
        }

        function handleSystemInstance(system) {
            if (isType(system)) {
                return system.create();
            }
            return system;
        }

        function beginHandleSystemInstance(system) {
            var promise = Bifrost.execution.Promise.create();

            if (system != null &&
                system._super !== null &&
                typeof system._super !== "undefined" &&
                system._super === Bifrost.Type) {

                system.beginCreate().continueWith(function (result, next) {
                    promise.signal(result);
                });
            } else {
                promise.signal(system);
            }

            return promise;
        }

        return {
            getDependenciesFor: function (func) {
                var dependencies = [];
                var parameters = Bifrost.functionParser.parse(func);
                for (var i = 0; i < parameters.length; i++) {
                    dependencies.push(parameters[i].name);
                }
                return dependencies;
            },

            resolve: function (namespace, name) {
                var resolvedSystem = resolveImplementation(namespace, name);
                if (typeof resolvedSystem === "undefined" || resolvedSystem === null) {
                    console.log("Unable to resolve '" + name + "' in '"+namespace+"'");
                    throw new Bifrost.UnresolvedDependencies();
                }

                if (resolvedSystem instanceof Bifrost.execution.Promise) {
                    console.log("'" + name + "' was resolved as an asynchronous dependency, consider using beginCreate() or make the dependency available prior to calling create");
                    throw new Bifrost.AsynchronousDependenciesDetected();
                }

                return handleSystemInstance(resolvedSystem);
            },

            beginResolve: function (namespace, name) {
                var promise = Bifrost.execution.Promise.create();
                Bifrost.configure.ready(function () {
                    var resolvedSystem = resolveImplementation(namespace, name);
                    if (typeof resolvedSystem === "undefined" || resolvedSystem === null) {
                        console.log("Unable to resolve '" + name + "' in '" + namespace + "'");
                        promise.fail(new Bifrost.UnresolvedDependencies());
                    }

                    if (resolvedSystem instanceof Bifrost.execution.Promise) {
                        resolvedSystem.continueWith(function (system, innerPromise) {

                            beginHandleSystemInstance(system)
                            .continueWith(function (actualSystem, next) {
                                promise.signal(handleSystemInstance(actualSystem));
                            }).onFail(function(e) { promise.fail(e); });
                        });
                    } else {
                        promise.signal(handleSystemInstance(resolvedSystem));
                    }
                });

                return promise;
            }
        }
    })()
});
Bifrost.namespace("Bifrost", {
    dependencyResolvers: (function () {
        return {
            getAll: function () {
                var resolvers = [
                    new Bifrost.WellKnownTypesDependencyResolver(),
                    new Bifrost.DefaultDependencyResolver(),
                    new Bifrost.KnownArtifactTypesDependencyResolver(),
                    new Bifrost.KnownArtifactInstancesDependencyResolver(),

                ];
                for (var property in this) {
                    if (property.indexOf("_") != 0 &&
                        this.hasOwnProperty(property) &&
                        typeof this[property] !== "function") {
                        resolvers.push(this[property]);
                    }
                }
                return resolvers;
            }
        };
    })()
});
Bifrost.namespace("Bifrost", {
    DefaultDependencyResolver: function () {
        var self = this;

        this.doesNamespaceHave = function (namespace, name) {
            return namespace.hasOwnProperty(name);
        };

        this.doesNamespaceHaveScriptReference = function (namespace, name) {
            if (namespace.hasOwnProperty("_scripts") && Bifrost.isArray(namespace._scripts)) {
                for (var i = 0; i < namespace._scripts.length; i++) {
                    var script = namespace._scripts[i];
                    if (script === name) {
                        return true;
                    }
                }
            }
            return false;
        };

        this.getFileName = function (namespace, name) {
            var fileName = "";
            if (typeof namespace._path !== "undefined") {
                fileName += namespace._path;
                if (!fileName.endsWith("/")) {
                    fileName += "/";
                }
            }
            fileName += name;
            if (!fileName.endsWith(".js")) {
                fileName += ".js";
            }
            fileName = fileName.replaceAll("//", "/");
            return fileName;

        };

        this.loadScriptReference = function (namespace, name, promise) {
            var fileName = self.getFileName(namespace, name);
            var file = Bifrost.io.fileFactory.create().create(fileName, Bifrost.io.fileType.javaScript);

            Bifrost.io.fileManager.create().load([file]).continueWith(function (types) {
                var system = types[0];
                if (self.doesNamespaceHave(namespace, name)) {
                    system = namespace[name];
                }
                promise.signal(system);
            });
        };


        this.canResolve = function (namespace, name) {
            var current = namespace;
            while (current != null && current != window) {
                if (self.doesNamespaceHave(current, name)) {
                    return true;
                }
                if (self.doesNamespaceHaveScriptReference(current, name) ) {
                    return true;
                }
                if (current === current.parent) break;
                current = current.parent;
            }

            return false;
        };

        this.resolve = function (namespace, name) {
            var current = namespace;
            while (current != null && current != window) {
                if (self.doesNamespaceHave(current, name)) {
                    return current[name];
                }
                if (self.doesNamespaceHaveScriptReference(current, name) ) {
                    var promise = Bifrost.execution.Promise.create();       
                    self.loadScriptReference(current, name, promise);
                    return promise;
                }
                if (current === current.parent) break;
                current = current.parent;

            }

            return null;
        };
    }
});
Bifrost.namespace("Bifrost", {
    WellKnownTypesDependencyResolver: function () {
        var self = this;
        this.types = Bifrost.WellKnownTypesDependencyResolver.types;

        this.canResolve = function (namespace, name) {
            return self.types.hasOwnProperty(name);
        },
        this.resolve = function (namespace, name) {
            return self.types[name];
        }
    }
});

Bifrost.WellKnownTypesDependencyResolver.types = {
    options: {}
};
Bifrost.dependencyResolvers.DOMRootDependencyResolver = {
    canResolve: function (namespace, name) {
        return name === "DOMRoot";
    },

    resolve: function (namespace, name) {
        if (document.body != null && typeof document.body != "undefined") {
            return document.body;
        }

        var promise = Bifrost.execution.Promise.create();
        Bifrost.dependencyResolvers.DOMRootDependencyResolver.promises.push(promise);
        return promise;
    }
};

Bifrost.dependencyResolvers.DOMRootDependencyResolver.promises = [];
Bifrost.dependencyResolvers.DOMRootDependencyResolver.documentIsReady = function () {
    Bifrost.dependencyResolvers.DOMRootDependencyResolver.promises.forEach(function (promise) {
        promise.signal(document.body);
    });
};
Bifrost.namespace("Bifrost", {
    KnownArtifactTypesDependencyResolver: function () {
        var self = this;
        var supportedArtifacts = {
            readModelTypes: Bifrost.read.ReadModelOf,
            commandTypes: Bifrost.commands.Command,
            queryTypes: Bifrost.read.Query
        };

        function isMoreSpecificNamespace(base, compareTo) {
            var isDeeper = false;
            var matchesbase = false;

            var baseParts = base.name.split(".");
            var compareToParts = compareTo.name.split(".");

            if (baseParts.length > compareToParts.length)
                return false;

            for (var i = 0; i < baseParts.length; i++) {
                if (baseParts[i] !== compareToParts[i])
                    return false;
            }
            return true;
        }

        this.canResolve = function (namespace, name) {
            return name in supportedArtifacts;
        },
        this.resolve = function (namespace, name) {
            var type = supportedArtifacts[name];
            var extenders = type.getExtendersIn(namespace);
            var resolvedTypes = {};

            extenders.forEach(function (extender) {
                var name = extender._name;
                if (resolvedTypes[name] && !isMoreSpecificNamespace(resolvedTypes[name]._namespace, extender._namespace))
                    return;

                resolvedTypes[name] = extender;
            });

            return resolvedTypes;
        }
    }
})
Bifrost.namespace("Bifrost", {
    KnownArtifactInstancesDependencyResolver: function () {
        var self = this;
        var supportedArtifacts = {
            readModels: Bifrost.read.ReadModelOf,
            commands: Bifrost.commands.Command,
            queries: Bifrost.read.Query
        };

        function isMoreSpecificNamespace(base, compareTo) {
            var isDeeper = false;
            var matchesbase = false;

            var baseParts = base.name.split(".");
            var compareToParts = compareTo.name.split(".");

            if (baseParts.length > compareToParts.length)
                return false;

            for (var i = 0; i < baseParts.length; i++) {
                if (baseParts[i] !== compareToParts[i])
                    return false;
            }
            return true;
        }

        this.canResolve = function (namespace, name) {
            return name in supportedArtifacts;
        },
        this.resolve = function (namespace, name) {
            var type = supportedArtifacts[name];
            var extenders = type.getExtendersIn(namespace);
            var resolvedTypes = {};

            extenders.forEach(function (extender) {
                var name = extender._name;
                if (resolvedTypes[name] && !isMoreSpecificNamespace(resolvedTypes[name]._namespace, extender._namespace))
                    return;

                resolvedTypes[name] = extender;
            });

            var resolvedInstances = {};
            for (var prop in resolvedTypes) {
                resolvedInstances[prop] = resolvedTypes[prop].create();
            }

            return resolvedInstances;
        }
    }
})
Bifrost.namespace("Bifrost", {
	Guid : {
       	create: function() {
	    	function S4() {
	        	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	    	}
           	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
       	},
    	empty: "00000000-0000-0000-0000-000000000000"
	}
});
Bifrost.namespace("Bifrost", {
    Type: function () {
        var self = this;
    }
});

(function () {
    throwIfMissingTypeDefinition = function(typeDefinition) {
        if (typeDefinition == null || typeof typeDefinition == "undefined") {
            throw new Bifrost.MissingTypeDefinition();
        }
    };

    throwIfTypeDefinitionIsObjectLiteral = function(typeDefinition) {
        if (typeof typeDefinition === "object") {
            throw new Bifrost.ObjectLiteralNotAllowed();
        }
    };

    addStaticProperties = function (typeDefinition) {
        for (var property in Bifrost.Type) {
            if (Bifrost.Type.hasOwnProperty(property) && property != "_extenders") {
                typeDefinition[property] = Bifrost.Type[property];
            }
        }
    };

    setupDependencies = function(typeDefinition) {
        typeDefinition._dependencies = Bifrost.dependencyResolver.getDependenciesFor(typeDefinition);

        var firstParameter = true;
        var createFunctionString = "Function('definition', 'dependencies','return new definition(";
            
        if( typeof typeDefinition._dependencies !== "undefined" ) {
            typeDefinition._dependencies.forEach(function(dependency, index) {
                if (!firstParameter) {
                    createFunctionString += ",";
                }
                firstParameter = false;
                createFunctionString += "dependencies[" + index + "]";
            });
        }
        createFunctionString += ");')";

        typeDefinition.createFunction = eval(createFunctionString);
    };

    getDependencyInstances = function(namespace, typeDefinition) {
        var dependencyInstances = [];
        if( typeof typeDefinition._dependencies !== "undefined" ) {
            typeDefinition._dependencies.forEach(function(dependency) {
                var dependencyInstance = Bifrost.dependencyResolver.resolve(namespace, dependency);
                dependencyInstances.push(dependencyInstance);
            });
        }
        return dependencyInstances;
    };

    resolve = function(namespace, dependency, index, instances, typeDefinition, resolvedCallback) {
        var promise = 
            Bifrost.dependencyResolver
                .beginResolve(namespace, dependency)
                .continueWith(function(result, nextPromise) {
                    instances[index] = result;
                    resolvedCallback(result, nextPromise);
                });
        return promise;
    };


    beginGetDependencyInstances = function(namespace, typeDefinition, instanceHash) {
        var promise = Bifrost.execution.Promise.create();
        var dependencyInstances = [];
        var solvedDependencies = 0;
        if( typeof typeDefinition._dependencies !== "undefined" ) {
            var dependenciesToResolve = typeDefinition._dependencies.length;
            var actualDependencyIndex = 0;
            var dependency = "";
            for( var dependencyIndex=0; dependencyIndex<dependenciesToResolve; dependencyIndex++ ) {
                dependency = typeDefinition._dependencies[dependencyIndex];

                if (instanceHash && instanceHash.hasOwnProperty(dependency)) {
                    dependencyInstances[dependencyIndex] = instanceHash[dependency];
                    solvedDependencies++;
                    if (solvedDependencies == dependenciesToResolve) {
                        promise.signal(dependencyInstances);
                    }
                } else {
                    resolve(namespace, dependency, dependencyIndex, dependencyInstances, typeDefinition, function (result, nextPromise) {
                        solvedDependencies++;
                        if (solvedDependencies == dependenciesToResolve) {
                            promise.signal(dependencyInstances);
                        }
                    }).onFail(function (e) { promise.fail(e); });
                }
            }

        }
        return promise;
    };

    expandInstancesHashToDependencies = function(typeDefinition, instanceHash, dependencyInstances) {
        if( typeof typeDefinition._dependencies === "undefined" || typeDefinition._dependencies == null ) return;
        for( var dependency in instanceHash ) {
            for( var dependencyIndex=0; dependencyIndex<typeDefinition._dependencies.length; dependencyIndex++ ) {
                if( typeDefinition._dependencies[dependencyIndex] == dependency ) {
                    dependencyInstances[dependencyIndex] = instanceHash[dependency];
                }
            }
        }
    };

    expandDependenciesToInstanceHash = function(typeDefinition, dependencies, instanceHash) {
        for( var dependencyIndex=0; dependencyIndex<dependencies.length; dependencyIndex++ ) {
            instanceHash[typeDefinition._dependencies[dependencyIndex]] = dependencies[dependencyIndex];
        }
    };

    resolveDependencyInstancesThatHasNotBeenResolved = function(dependencyInstances, typeDefinition) {
        dependencyInstances.forEach(function(dependencyInstance, index) {
            if( dependencyInstance == null || typeof dependencyInstance == "undefined" ) {
                var dependency = typeDefinition._dependencies[index];
                dependencyInstances[index] = Bifrost.dependencyResolver.resolve(typeDefinition._namespace, dependency);
            }
        });
    };

    resolveDependencyInstances = function(instanceHash, typeDefinition) {
        var dependencyInstances = [];
        if( typeof instanceHash === "object" ) {
            expandInstancesHashToDependencies(typeDefinition, instanceHash, dependencyInstances);
        } 
        if( typeof typeDefinition._dependencies !== "undefined" && typeDefinition._dependencies.length > 0 ) {
            if( dependencyInstances.length > 0 ) {
                resolveDependencyInstancesThatHasNotBeenResolved(dependencyInstances, typeDefinition);
            } else {
                dependencyInstances = getDependencyInstances(typeDefinition._namespace, typeDefinition);
            }
        }
        return dependencyInstances;
    };

    addMissingDependenciesAsNullFromTypeDefinition = function (instanceHash, typeDefinition) {
        if (typeof typeDefinition._dependencies === "undefined") return;
        if (typeof instanceHash === "undefined" || instanceHash == null) return 
        for( var index=0; index<typeDefinition._dependencies.length; index++ ) {
            var dependency = typeDefinition._dependencies[index];
            if (!(dependency in instanceHash)) {
                instanceHash[dependency] = null;
            }
        }
    };

    handleOnCreate = function(type, lastDescendant, currentInstance) {
        if( currentInstance == null || typeof currentInstance === "undefined" ) return;

        if( typeof type !== "undefined" && typeof type.prototype !== "undefined" ) {
            handleOnCreate(type._super, lastDescendant, type.prototype);
        }

        if( currentInstance.hasOwnProperty("onCreated") && typeof currentInstance.onCreated === "function" ) {
            currentInstance.onCreated(lastDescendant);
        }
    };

    Bifrost.Type._extenders = [];

    Bifrost.Type.scope = {
        getFor : function(namespace, name) {
            return null;
        }
    };

    Bifrost.Type.typeOf = function (type) {

        if (typeof this._super == "undefined" ||
            typeof this._super._typeId == "undefined") {
            return false;
        }

        if (this._super._typeId === type._typeId) {
            return true;
        }

        if (typeof type._super !== "undefined") {
            var isType = this._super.typeOf(type);
            if (isType == true) return true;
        }


        return false;
    };

    Bifrost.Type.getExtenders = function () {
        return this._extenders;
    };

    Bifrost.Type.getExtendersIn = function (namespace) {
        var inNamespace = [];
        
        this._extenders.forEach(function (extender) {
            var current = namespace;
            while (current !== window) {
                if (extender._namespace == current) {
                    inNamespace.push(extender);
                    break;
                }

                if (Bifrost.isUndefined(current.parent))
                    break;

                current = current.parent;
            }
            
        });
        return inNamespace;
    };

  

    Bifrost.Type.extend = function (typeDefinition) {     
        throwIfMissingTypeDefinition(typeDefinition);
        throwIfTypeDefinitionIsObjectLiteral(typeDefinition);

        addStaticProperties(typeDefinition);
        setupDependencies(typeDefinition);
        typeDefinition._super = this;
        typeDefinition._typeId = Bifrost.Guid.create();
        typeDefinition._extenders = [];
        Bifrost.Type.registerExtender(this, typeDefinition);
        return typeDefinition;
    };

    Bifrost.Type.registerExtender = function (typeExtended, typeDefined) {
        var superType = typeExtended;
        
        while (superType != null) {
            if (superType._extenders.indexOf(typeDefined) === -1) {
                superType._extenders.push(typeDefined);
            }
            superType = superType._super;
        }
    }

    Bifrost.Type.scopeTo = function(scope) {
        if( typeof scope === "function" ) {
            this.scope = {
                getFor: scope
            }
        } else {
            if( typeof scope.getFor === "function" ) {
                this.scope = scope;
            } else {
                this.scope = {
                    getFor: function() {
                        return scope;
                    }
                }
            }
        }
        return this;
    };

    Bifrost.Type.defaultScope = function() {
        this.scope = {
            getFor: function() {
                return null;
            }
        };
        return this;
    };

    Bifrost.Type.requires = function () {
        for (var argumentIndex = 0; argumentIndex < arguments.length; argumentIndex++) {
            this._dependencies.push(arguments[argumentIndex]);
        }

        return this;
    };

    Bifrost.Type.create = function (instanceHash, isSuper) {
        var actualType = this;
        if( this._super != null ) {
            actualType.prototype = this._super.create(instanceHash, true);
        }
        addMissingDependenciesAsNullFromTypeDefinition(instanceHash, this);
        var dependencyInstances = resolveDependencyInstances(instanceHash, this);
        var scope = null;
        if( this != Bifrost.Type ) {
            this.instancesPerScope = this.instancesPerScope || {};

            scope = this.scope.getFor(this._namespace, this._name, this._typeId);
            if (scope != null && this.instancesPerScope.hasOwnProperty(scope)) {
                return this.instancesPerScope[scope];
            }
        }

        var instance = null;
        if( typeof this.createFunction !== "undefined" ) {
            instance = this.createFunction(this, dependencyInstances);
        } else {
            instance = new actualType();    
        }

        instance._type = actualType;

        if( isSuper !== true ) {
            handleOnCreate(actualType, instance, instance);
        }

        if( scope != null ) {
            this.instancesPerScope[scope] = instance;
        }

        return instance;
    };

    Bifrost.Type.createWithoutScope = function (instanceHash, isSuper) {
        var scope = this.scope;
        this.defaultScope();
        var instance = this.create(instanceHash, isSuper);
        this.scope = scope;
        return instance;
    };

    Bifrost.Type.beginCreate = function(instanceHash) {
        var self = this;

        var promise = Bifrost.execution.Promise.create();
        var superPromise = Bifrost.execution.Promise.create();
        superPromise.onFail(function (e) {
            promise.fail(e);
        });

        if( this._super != null ) {
            this._super.beginCreate(instanceHash).continueWith(function (_super, nextPromise) {
                superPromise.signal(_super);
            }).onFail(function (e) {
                promise.fail(e);
            });
        } else {
            superPromise.signal(null);
        }

        superPromise.continueWith(function(_super, nextPromise) {
            self.prototype = _super;

            if( self._dependencies == null || 
                typeof self._dependencies == "undefined" || 
                self._dependencies.length == 0) {

                var instance = self.create(instanceHash);
                promise.signal(instance);
            } else {
                beginGetDependencyInstances(self._namespace, self, instanceHash)
                    .continueWith(function(dependencies, nextPromise) {
                        var dependencyInstances = {};
                        expandDependenciesToInstanceHash(self, dependencies, dependencyInstances);
                        if( typeof instanceHash === "object" ) {
                            for( var property in instanceHash ) {
                                dependencyInstances[property] = instanceHash[property];
                            }
                        }

                        try {
                            var instance = self.create(dependencyInstances);
                            promise.signal(instance);
                        } catch (e) {
                            promise.fail(e);
                        }
                    });

            }
        });

        return promise;
    };
})();
Bifrost.namespace("Bifrost", {
    Singleton: function (typeDefinition) {
        return Bifrost.Type.extend(typeDefinition).scopeTo(window);
    }
});
Bifrost.namespace("Bifrost", {
    Path: Bifrost.Type.extend(function (fullPath) {
        var self = this;

        // Based on node.js implementation : http://stackoverflow.com/questions/9451100/filename-extension-in-javascript
        var splitDeviceRe = 
            /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?([\\\/])?([\s\S]*?)$/;

        // Regex to split the tail part of the above into [*, dir, basename, ext]
        var splitTailRe = 
            /^([\s\S]+[\\\/](?!$)|[\\\/])?((?:\.{1,2}$|[\s\S]+?)?(\.[^.\/\\]*)?)$/;

        function removeUnsupportedParts(filename) {
            var queryStringStart = filename.indexOf("?");
            if (queryStringStart > 0) {
                filename = filename.substr(0, queryStringStart);
            }
            return filename;
        }

        function splitPath(filename) {
            // Separate device+slash from tail
            var result = splitDeviceRe.exec(filename),
                device = (result[1] || '') + (result[2] || ''),
                tail = result[3] || '';
            // Split the tail into dir, basename and extension
            var result2 = splitTailRe.exec(tail),
                dir = result2[1] || '',
                basename = result2[2] || '',
                ext = result2[3] || '';
            return [device, dir, basename, ext];
        }

        var fullPath = removeUnsupportedParts(fullPath);
        var result = splitPath(fullPath);
        this.device = result[0] || "";
        this.directory = result[1] || "";
        this.filename = result[2] || "";
        this.extension = result[3] || "";
        this.filenameWithoutExtension = this.filename.replaceAll(this.extension, "");
        this.fullPath = fullPath;

        this.hasExtension = function () {
            if (Bifrost.isNullOrUndefined(self.extension)) return false;
            if (self.extension == "") return false;
            return true;
        };
    })
});
Bifrost.Path.makeRelative = function (fullPath) {
    if (fullPath.indexOf("/") == 0) return fullPath.substr(1);

    return fullPath;
};
Bifrost.Path.getPathWithoutFilename = function (fullPath) {
    var lastIndex = fullPath.lastIndexOf("/");
    return fullPath.substr(0, lastIndex);
};
Bifrost.Path.getFilename = function (fullPath) {
    var lastIndex = fullPath.lastIndexOf("/");
    return fullPath.substr(lastIndex+1);
};
Bifrost.Path.getFilenameWithoutExtension = function (fullPath) {
    var filename = this.getFilename(fullPath);
    var lastIndex = filename.lastIndexOf(".");
    return filename.substr(0,lastIndex);
};
Bifrost.Path.hasExtension = function (path) {
    if (path.indexOf("?") > 0) path = path.substr(0, path.indexOf("?"));
    var lastIndex = path.lastIndexOf(".");
    return lastIndex > 0;
};
Bifrost.Path.changeExtension = function (fullPath, newExtension) {
    var path = Bifrost.Path.create({ fullPath: fullPath });
    var newPath = path.directory + path.filenameWithoutExtension + "." + newExtension;
    return newPath;
};
Bifrost.namespace("Bifrost");

Bifrost.DefinitionMustBeFunction = function(message) {
    this.prototype = Error.prototype;
	this.name = "DefinitionMustBeFunction";
    this.message = message || "Definition must be function";
}

Bifrost.MissingName = function(message) {
	this.prototype = Error.prototype;
	this.name = "MissingName";
	this.message = message || "Missing name";
}

Bifrost.Exception = (function(global, undefined) {
	function throwIfNameMissing(name) {
		if( !name || typeof name == "undefined" ) throw new Bifrost.MissingName();
	}
	
	function throwIfDefinitionNotAFunction(definition) {
		if( typeof definition != "function" ) throw new Bifrost.DefinitionMustBeFunction();
	}

	function getExceptionName(name) {
		var lastDot = name.lastIndexOf(".");
		if( lastDot == -1 && lastDot != name.length ) return name;
		return name.substr(lastDot+1);
	}
	
	function defineAndGetTargetScope(name) {
		var lastDot = name.lastIndexOf(".");
		if( lastDot == -1 ) {
			return global;
		}
		
		var ns = name.substr(0,lastDot);
		Bifrost.namespace(ns);
		
		var scope = global;
        var parts = ns.split('.');
		parts.forEach(function(part) {
			scope = scope[part];
		});
		
		return scope;
	}
	
	return {
		define: function(name, defaultMessage, definition) {
			throwIfNameMissing(name);
			
			var scope = defineAndGetTargetScope(name);
			var exceptionName = getExceptionName(name);
			
			var exception = function(message) {
				this.name = exceptionName;
				this.message = message || defaultMessage;
			}
			exception.prototype = Error.prototype;
			
			if( definition && typeof definition != "undefined" ) {
				throwIfDefinitionNotAFunction(definition);
				
				definition.prototype = Error.prototype;
				exception.prototype = new definition();
			}
			
			scope[exceptionName] = exception;
		}
	};
})(window);
Bifrost.namespace("Bifrost");
Bifrost.Exception.define("Bifrost.LocationNotSpecified","Location was not specified");
Bifrost.Exception.define("Bifrost.InvalidUriFormat", "Uri format specified is not valid");
Bifrost.Exception.define("Bifrost.ObjectLiteralNotAllowed", "Object literal is not allowed");
Bifrost.Exception.define("Bifrost.MissingTypeDefinition", "Type definition was not specified");
Bifrost.Exception.define("Bifrost.AsynchronousDependenciesDetected", "You should consider using Type.beginCreate() or dependencyResolver.beginResolve() for systems that has asynchronous dependencies");
Bifrost.Exception.define("Bifrost.UnresolvedDependencies", "Some dependencies was not possible to resolve");
Bifrost.namespace("Bifrost");
Bifrost.hashString = (function() {
	return {
		decode: function(a) {
		    if (a == "") return { };
			a = a.replace("/?","").split('&');

		    var b = { };
		    for (var i = 0; i < a.length; ++i) {
		        var p = a[i].split('=', 2);
		        if (p.length != 2) continue;
		
				var value = decodeURIComponent(p[1].replace( /\+/g , " "));

				if( value !== "" && !isNaN(value) ) {
					value = parseFloat(value);
				}

		        b[p[0]] = value;
		    }
		    return b;
		}
	}
})();
Bifrost.namespace("Bifrost");
Bifrost.Uri = (function(window, undefined) {
	/* parseUri JS v0.1, by Steven Levithan (http://badassery.blogspot.com)
	Splits any well-formed URI into the following parts (all are optional):
	----------------------
	• source (since the exec() method returns backreference 0 [i.e., the entire match] as key 0, we might as well use it)
	• protocol (scheme)
	• authority (includes both the domain and port)
	    • domain (part of the authority; can be an IP address)
	    • port (part of the authority)
	• path (includes both the directory path and filename)
	    • directoryPath (part of the path; supports directories with periods, and without a trailing backslash)
	    • fileName (part of the path)
	• query (does not include the leading question mark)
	• anchor (fragment)
	*/
	function parseUri(sourceUri){
	    var uriPartNames = ["source","protocol","authority","domain","port","path","directoryPath","fileName","query","anchor"];
	    var uriParts = new RegExp("^(?:([^:/?#.]+):)?(?://)?(([^:/?#]*)(?::(\\d*))?)?((/(?:[^?#](?![^?#/]*\\.[^?#/.]+(?:[\\?#]|$)))*/?)?([^?#/]*))?(?:\\?([^#]*))?(?:#(.*))?").exec(sourceUri);
	    var uri = {};

	    for(var i = 0; i < 10; i++){
	        uri[uriPartNames[i]] = (uriParts[i] ? uriParts[i] : "");
	    }

	    // Always end directoryPath with a trailing backslash if a path was present in the source URI
	    // Note that a trailing backslash is NOT automatically inserted within or appended to the "path" key
	    if(uri.directoryPath.length > 0){
	        uri.directoryPath = uri.directoryPath.replace(/\/?$/, "/");
	    }

	    return uri;
	}	
	
	
	function Uri(location) {
		var self = this;
		this.setLocation = function(location) {
			self.fullPath = location;
			location = location.replace("#!","/");
		
			var result = parseUri(location);
		
			if( !result.protocol || typeof result.protocol == "undefined" ) {
				throw new Bifrost.InvalidUriFormat("Uri ('"+location+"') was in the wrong format");
			}

			self.scheme = result.protocol;
			self.host = result.domain;
			self.path = result.path;
			self.anchor = result.anchor;

			self.queryString = result.query;
			self.port = parseInt(result.port);
			self.parameters = Bifrost.hashString.decode(result.query);
			self.parameters = Bifrost.extend(Bifrost.hashString.decode(result.anchor), self.parameters);
			
			self.isSameAsOrigin = (window.location.protocol == result.protocol+":" &&
				window.location.hostname == self.host); 
		}
		
		this.setLocation(location);
	}
	
	function throwIfLocationNotSpecified(location) {
		if( !location || typeof location == "undefined" ) throw new Bifrost.LocationNotSpecified();
	}
	
	
	return {
		create: function(location) {
			throwIfLocationNotSpecified(location);
		
			var uri = new Uri(location);
			return uri;
		},

		isAbsolute: function (url) {
		    // Based on http://stackoverflow.com/questions/10687099/how-to-test-if-a-url-string-is-absolute-or-relative
		    var expression = new RegExp('^(?:[a-z]+:)?//', 'i');
		    return expression.test(url);
		}
	};
})(window);
Bifrost.namespace("Bifrost", {
    namespaces: Bifrost.Singleton(function() {
        var self = this;

        this.stripPath = function (path) {
            if (path.startsWith("/")) {
                path = path.substr(1);
            }
            if (path.endsWith("/")) {
                path = path.substr(0, path.length - 1);
            }
            return path;
        };

        this.initialize = function () {
            var scripts = Bifrost.assetsManager.getScripts();
            if (typeof scripts === "undefined") return;

            scripts.forEach(function (fullPath) {
                var path = Bifrost.Path.getPathWithoutFilename(fullPath);
                path = self.stripPath(path);

                for (var mapperKey in Bifrost.namespaceMappers) {
                    var mapper = Bifrost.namespaceMappers[mapperKey];
                    if (typeof mapper.hasMappingFor === "function" && mapper.hasMappingFor(path)) {
                        var namespacePath = mapper.resolve(path);
                        var namespace = Bifrost.namespace(namespacePath);

                        var root = "/" + path + "/";
                        namespace._path = root;

                        if (typeof namespace._scripts === "undefined") {
                            namespace._scripts = [];
                        }

                        var fileIndex = fullPath.lastIndexOf("/");
                        var file = fullPath.substr(fileIndex + 1);
                        var extensionIndex = file.lastIndexOf(".");
                        var system = file.substr(0, extensionIndex);

                        namespace._scripts.push(system);
                    }
                }
            });
        };
    })
});
Bifrost.namespace("Bifrost", {
    namespaceMappers: {

        mapPathToNamespace: function (path) {
            for (var mapperKey in Bifrost.namespaceMappers) {
                var mapper = Bifrost.namespaceMappers[mapperKey];
                if (typeof mapper.hasMappingFor === "function" && mapper.hasMappingFor(path)) {
                    var namespacePath = mapper.resolve(path);
                    return namespacePath;
                }
            }

            return null;
        }
    }
});
Bifrost.namespace("Bifrost", {
    StringMapping: Bifrost.Type.extend(function (format, mappedFormat) {
        var self = this;

        this.format = format;
        this.mappedFormat = mappedFormat;

        var placeholderExpression = "\{[a-zA-Z]+\}";
        var placeholderRegex = new RegExp(placeholderExpression, "g");

        var wildcardExpression = "\\*{2}[//||\.]";
        var wildcardRegex = new RegExp(wildcardExpression, "g");

        var combinedExpression = "(" + placeholderExpression + ")*(" + wildcardExpression + ")*";
        var combinedRegex = new RegExp(combinedExpression, "g");

        var components = [];
        

        var resolveExpression = format.replace(combinedRegex, function(match) {
            if( typeof match === "undefined" || match == "") return "";
            components.push(match);
            if( match.indexOf("**") == 0) return "([\\w.//]*)";
            return "([\\w.]*)";
        });

        var mappedFormatWildcardMatch = mappedFormat.match(wildcardRegex);
        var formatRegex = new RegExp(resolveExpression);

        this.matches = function (input) {
            var match = input.match(formatRegex);
            if (match) {
                return true;
            }
            return false;
        };

        this.getValues = function (input) {
            var output = {};
            var match = input.match(formatRegex);
            components.forEach(function (c, i) {
                var component = c.substr(1, c.length - 2);
                var value = match[i + 2];
                if (c.indexOf("**") != 0) {
                    output[component] = value;
                }
            });

            return output;
        };

        this.resolve = function (input) {
            var match = input.match(formatRegex);
            var result = mappedFormat;
            var wildcardOffset = 0;

            components.forEach(function (c, i) {
                var value = match[i + 1];
                if (c.indexOf("**") == 0) {
                    var wildcard = mappedFormatWildcardMatch[wildcardOffset];
                    value = value.replaceAll(c[2], wildcard[2]);
                    result = result.replace(wildcard, value);
                    wildcardOffset++;
                } else {
                    result = result.replace(c, value);
                }
            });

            return result;
        };
    })
});
Bifrost.namespace("Bifrost", {
    stringMappingFactory: Bifrost.Singleton(function () {
        var self = this;

        this.create = function (format, mappedFormat) {
            var mapping = Bifrost.StringMapping.create({
                format: format,
                mappedFormat: mappedFormat
            });
            return mapping;
        };
    })
});
Bifrost.namespace("Bifrost", {
    StringMapper: Bifrost.Type.extend(function (stringMappingFactory) {
        var self = this;

        this.stringMappingFactory = stringMappingFactory;

        this.mappings = [];

        this.hasMappingFor = function (input) {
            var found = false;
            self.mappings.some(function (m) {
                if (m.matches(input)) {
                    found = true;
                }
                return found;
            });
            return found;
        };

        this.getMappingFor = function (input) {
            var found;
            self.mappings.some(function (m) {
                if (m.matches(input)) {
                    found = m;
                    return true;
                }
            });

            if (typeof found !== "undefined") {
                return found;
            }

            throw {
                name: "ArgumentError",
                message: "String mapping for (" + input + ") could not be found"
            }
        };

        this.resolve = function (input) {
            try {
                if( input === null || typeof input === "undefined" ) return "";
                
                var mapping = self.getMappingFor(input);
                if (Bifrost.isNullOrUndefined(mapping)) return "";

                return mapping.resolve(input);
            } catch (e) {
                return "";
            }
        };

        this.addMapping = function (format, mappedFormat) {
            var mapping = self.stringMappingFactory.create(format, mappedFormat);
            self.mappings.push(mapping);
        };
    })
});
Bifrost.namespace("Bifrost", {
    uriMappers: {
    }
});
Bifrost.namespace("Bifrost", {
    server: Bifrost.Singleton(function () {
        var self = this;

        this.target = "";

        function deserialize(data) {
            if (Bifrost.isArray(data)) {
                var items = [];
                data.forEach(function (item) {
                    items.push(deserialize(item));
                });
                return items;
            } else {
                for (var property in data) {
                    if (Bifrost.isArray(data[property])) {
                        data[property] = deserialize(data[property]);
                    } else {
                        var value = data[property];

                        if (Bifrost.isNumber(value)) {
                            data[property] = parseFloat(value);
                        } else {
                            data[property] = data[property];
                        }
                    }
                }
                return data;
            }
        }

        this.post = function (url, parameters) {
            var promise = Bifrost.execution.Promise.create();

            if (!Bifrost.Uri.isAbsolute(url)) {
                url = self.target + url;
            }

            var actualParameters = {};

            for (var property in parameters) {
                actualParameters[property] = JSON.stringify(parameters[property]);
            }

            $.ajax({
                url: url,
                type: "POST",
                dataType: 'json',
                data: JSON.stringify(actualParameters),
                contentType: 'application/json; charset=utf-8',
                complete: function (result) {
                    var data = $.parseJSON(result.responseText);
                    deserialize(data);
                    promise.signal(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    promise.fail(textStatus);
                }
            });

            return promise;
        };

        this.get = function (url, parameters) {
            var promise = Bifrost.execution.Promise.create();

            if (!Bifrost.Uri.isAbsolute(url)) {
                url = self.target + url;
            }

            $.ajax({
                url: url,
                type: "GET",
                dataType: 'json',
                data: parameters,
                contentType: 'application/json; charset=utf-8',
                complete: function (result) {
                    var data = $.parseJSON(result.responseText);
                    deserialize(data);
                    promise.signal(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    promise.fail(textStatus);
                }
            });

            return promise;
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.server = Bifrost.server;
Bifrost.namespace("Bifrost", {
    systemClock: Bifrost.Singleton(function () {
        this.nowInMilliseconds = function () {
            return window.performance.now();
        };
    })
});
/*!
* JavaScript TimeSpan Library
*
* Copyright (c) 2010 Michael Stum, http://www.Stum.de/
* 
* Permission is hereby granted, free of charge, to any person obtaining
* a copy of this software and associated documentation files (the
* "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish,
* distribute, sublicense, and/or sell copies of the Software, and to
* permit persons to whom the Software is furnished to do so, subject to
* the following conditions:
* 
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
* LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
* OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
* WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
Bifrost.namespace("Bifrost", {
    // Constructor function, all parameters are optional
    TimeSpan : function (milliseconds, seconds, minutes, hours, days) {
        var version = "1.2",
            // Millisecond-constants
            msecPerSecond = 1000,
            msecPerMinute = 60000,
            msecPerHour = 3600000,
            msecPerDay = 86400000,
            // Internally we store the TimeSpan as Milliseconds
            msecs = 0,

            // Helper functions
            isNumeric = function (input) {
                return !isNaN(parseFloat(input)) && isFinite(input);
            };

        // Constructor Logic
        if (isNumeric(days)) {
            msecs += (days * msecPerDay);
        }
        if (isNumeric(hours)) {
            msecs += (hours * msecPerHour);
        }
        if (isNumeric(minutes)) {
            msecs += (minutes * msecPerMinute);
        }
        if (isNumeric(seconds)) {
            msecs += (seconds * msecPerSecond);
        }
        if (isNumeric(milliseconds)) {
            msecs += milliseconds;
        }

        // Addition Functions
        this.addMilliseconds = function (milliseconds) {
            if (!isNumeric(milliseconds)) {
                return;
            }
            msecs += milliseconds;
        };
        this.addSeconds = function (seconds) {
            if (!isNumeric(seconds)) {
                return;
            }
            msecs += (seconds * msecPerSecond);
        };
        this.addMinutes = function (minutes) {
            if (!isNumeric(minutes)) {
                return;
            }
            msecs += (minutes * msecPerMinute);
        };
        this.addHours = function (hours) {
            if (!isNumeric(hours)) {
                return;
            }
            msecs += (hours * msecPerHour);
        };
        this.addDays = function (days) {
            if (!isNumeric(days)) {
                return;
            }
            msecs += (days * msecPerDay);
        };

        // Subtraction Functions
        this.subtractMilliseconds = function (milliseconds) {
            if (!isNumeric(milliseconds)) {
                return;
            }
            msecs -= milliseconds;
        };
        this.subtractSeconds = function (seconds) {
            if (!isNumeric(seconds)) {
                return;
            }
            msecs -= (seconds * msecPerSecond);
        };
        this.subtractMinutes = function (minutes) {
            if (!isNumeric(minutes)) {
                return;
            }
            msecs -= (minutes * msecPerMinute);
        };
        this.subtractHours = function (hours) {
            if (!isNumeric(hours)) {
                return;
            }
            msecs -= (hours * msecPerHour);
        };
        this.subtractDays = function (days) {
            if (!isNumeric(days)) {
                return;
            }
            msecs -= (days * msecPerDay);
        };

        // Functions to interact with other TimeSpans
        this.isTimeSpan = true;
        this.add = function (otherTimeSpan) {
            if (!otherTimeSpan.isTimeSpan) {
                return;
            }
            msecs += otherTimeSpan.totalMilliseconds();
        };
        this.subtract = function (otherTimeSpan) {
            if (!otherTimeSpan.isTimeSpan) {
                return;
            }
            msecs -= otherTimeSpan.totalMilliseconds();
        };
        this.equals = function (otherTimeSpan) {
            if (!otherTimeSpan.isTimeSpan) {
                return;
            }
            return msecs === otherTimeSpan.totalMilliseconds();
        };

        // Getters
        this.totalMilliseconds = function (roundDown) {
            var result = msecs;
            if (roundDown === true) {
                result = Math.floor(result);
            }
            return result;
        };
        this.totalSeconds = function (roundDown) {
            var result = msecs / msecPerSecond;
            if (roundDown === true) {
                result = Math.floor(result);
            }
            return result;
        };
        this.totalMinutes = function (roundDown) {
            var result = msecs / msecPerMinute;
            if (roundDown === true) {
                result = Math.floor(result);
            }
            return result;
        };
        this.totalHours = function (roundDown) {
            var result = msecs / msecPerHour;
            if (roundDown === true) {
                result = Math.floor(result);
            }
            return result;
        };
        this.totalDays = function (roundDown) {
            var result = msecs / msecPerDay;
            if (roundDown === true) {
                result = Math.floor(result);
            }
            return result;
        };
        // Return a Fraction of the TimeSpan
        this.milliseconds = function () {
            return msecs % 1000;
        };
        this.seconds = function () {
            return Math.floor(msecs / msecPerSecond) % 60;
        };
        this.minutes = function () {
            return Math.floor(msecs / msecPerMinute) % 60;
        };
        this.hours = function () {
            return Math.floor(msecs / msecPerHour) % 24;
        };
        this.days = function () {
            return Math.floor(msecs / msecPerDay);
        };

        // Misc. Functions
        this.getVersion = function () {
            return version;
        };
    }
});

// "Static Constructors"
Bifrost.TimeSpan.zero = function() {
    return new Bifrost.TimeSpan(0, 0, 0, 0, 0);
};
Bifrost.TimeSpan.fromMilliseconds = function (milliseconds) {
    return new Bifrost.TimeSpan(milliseconds, 0, 0, 0, 0);
};
Bifrost.TimeSpan.fromSeconds = function (seconds) {
    return new Bifrost.TimeSpan(0, seconds, 0, 0, 0);
};
Bifrost.TimeSpan.fromMinutes = function (minutes) {
    return new Bifrost.TimeSpan(0, 0, minutes, 0, 0);
};
Bifrost.TimeSpan.fromHours = function (hours) {
    return new Bifrost.TimeSpan(0, 0, 0, hours, 0);
};
Bifrost.TimeSpan.fromDays = function (days) {
    return new Bifrost.TimeSpan(0, 0, 0, 0, days);
};
Bifrost.TimeSpan.fromDates = function (firstDate, secondDate, forcePositive) {
    var differenceMsecs = secondDate.valueOf() - firstDate.valueOf();
    if(forcePositive === true) {
        differenceMsecs = Math.abs(differenceMsecs);
    }
    return new Bifrost.TimeSpan(differenceMsecs, 0, 0, 0, 0);
};
Bifrost.namespace("Bifrost", {
    Event: Bifrost.Type.extend(function () {
        var subscribers = [];

        this.subscribe = function (subscriber) {
            subscribers.push(subscriber);
        };

        this.trigger = function (data) {
            subscribers.forEach(function (subscriber) {
                subscriber(data);
            });
        };
    })
});
Bifrost.namespace("Bifrost", {
    systemEvents: Bifrost.Singleton(function () {
        this.readModels = Bifrost.read.readModelSystemEvents.create();
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.systemEvents = Bifrost.systemEvents;
Bifrost.namespace("Bifrost", {
	dispatcher: Bifrost.Singleton(function() {
		this.schedule = function(milliseconds, callback) {
			setTimeout(callback, milliseconds);
		};
	})
});
if (typeof ko !== 'undefined') {
    ko.extenders.linked = function (target, options) {
        function setupValueSubscription(value) {
            if (ko.isObservable(value)) {
                var subscription = value.subscribe(function () {
                    target.valueHasMutated();
                });
                target._previousLinkedSubscription = subscription;
            }
        }

        target.subscribe(function (newValue) {
            if (target._previousLinkedSubscription) {
                target._previousLinkedSubscription.dispose();
            }
            setupValueSubscription(newValue);

        });

        var currentValue = target();
        setupValueSubscription(currentValue);
    };
}
Bifrost.namespace("Bifrost.io", {
    fileType: {
        unknown: 0,
        text: 1,
        javaScript: 2,
        html: 3
    }
});
Bifrost.namespace("Bifrost.io", {
    File: Bifrost.Type.extend(function (path) {
        /// <summary>Represents a file</summary>

        /// <field name="type" type="Bifrost.io.fileType">Type of file represented</field>
        this.type = Bifrost.io.fileType.unknown;

        /// <field name="path" type="Bifrost.Path">The path representing the file</field>
        this.path = Bifrost.Path.create({ fullPath: path });
    })
});
Bifrost.namespace("Bifrost.io", {
    fileFactory: Bifrost.Singleton(function () {
        /// <summary>Represents a factory for creating instances of Bifrost.io.File</summary>
        this.create = function (path, fileType) {
            /// <summary>Creates a new file</summary>
            /// <param name="path" type="String">Path of file</param>
            /// <param name="fileType" type="Bifrost.io.fileType" optional="true">Type of file to use</param>
            /// <returns type="Bifrost.io.File">An instance of a file</returns>

            var file = Bifrost.io.File.create({ path: path });
            if (!Bifrost.isNullOrUndefined(fileType)) {
                file.fileType = fileType;
            }
            return file;
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.fileFactory = Bifrost.io.fileFactory;
Bifrost.namespace("Bifrost.io", {
    fileManager: Bifrost.Singleton(function () {
        /// <summary>Represents a manager for files, providing capabilities of loading and more</summary>
        var self = this;

        var uri = Bifrost.Uri.create(window.location.href);
        if (window.location.protocol === "file:") {
            this.origin = window.location.href;
            this.origin = this.origin.substr(0, this.origin.lastIndexOf("/"));

            if (this.origin.lastIndexOf("/") == this.origin.length - 1) {
                this.origin = this.origin.substr(0, this.origin.length - 1);
            }
        } else {
            var port = uri.port || "";
            if (!Bifrost.isUndefined(port) && port !== "" && port !== 80) {
                port = ":" + port;
            }

            this.origin = uri.scheme + "://" + uri.host + port;
        }

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
Bifrost.namespace("Bifrost.tasks", {
    Task: Bifrost.Type.extend(function () {
        /// <summary>Represents a task that can be done in the system</summary>
        var self = this;

        /// <field name="errors" type="observableArray">Observable array of errors</field>
        this.errors = ko.observableArray();

        this.execute = function () {
            /// <summary>Executes the task</summary>
            /// <returns>A promise</returns>
            var promise = Bifrost.execution.Promise.create();
            promise.signal();
            return promise;
        };

        this.reportError = function (error) {
            /// <summary>Report an error from executing the task</summary>
            /// <param name="error" type="String">Error coming back</param>
            self.errors.push(error);
        };
    })
});
Bifrost.namespace("Bifrost.tasks", {
    TaskHistoryEntry: Bifrost.Type.extend(function () {
        var self = this;

        this.type = "";
        this.content = "";

        this.begin = ko.observable();
        this.end = ko.observable();
        this.total = ko.computed(function () {
            if (typeof self.end() !== "undefined" && typeof (self.begin()) !== "undefined") {
                return self.end() - self.begin();
            }
            return 0;
        });
        this.result = ko.observable();
        this.error = ko.observable();

        this.isFinished = ko.computed(function () {
            return typeof self.end() !== "undefined";
        });
        this.hasFailed = ko.computed(function () {
            return typeof self.error() !== "undefined";
        });

        this.isSuccess = ko.computed(function () {
            return self.isFinished() && !self.hasFailed();
        });
    })
});
Bifrost.namespace("Bifrost.tasks", {
    taskHistory: Bifrost.Singleton(function (systemClock) {
        /// <summary>Represents the history of tasks that has been executed since the start of the application</summary>
        var self = this;

        var entriesById = {};

        /// <field param="entries" type="observableArray">Observable array of entries</field>
        this.entries = ko.observableArray();

        this.begin = function (task) {
            var id = Bifrost.Guid.create();

            try {
                var entry = Bifrost.tasks.TaskHistoryEntry.create();

                entry.type = task._type._name;

                var content = {};

                for (var property in task) {
                    if (property.indexOf("_") != 0 && task.hasOwnProperty(property) && typeof task[property] !== "function") {
                        content[property] = task[property];
                    }
                }

                entry.content = JSON.stringify(content);

                entry.begin(systemClock.nowInMilliseconds());
                entriesById[id] = entry;
                self.entries.push(entry);
            } catch (ex) {
                // Todo: perfect place for logging something
            }
            return id;
        };

        this.end = function (id, result) {
            if (entriesById.hasOwnProperty(id)) {
                var entry = entriesById[id];
                entry.end(systemClock.nowInMilliseconds());
                entry.result(result);
            }
        };

        this.failed = function (id, error) {
            if (entriesById.hasOwnProperty(id)) {
                var entry = entriesById[id];
                entry.end(systemClock.nowInMilliseconds());
                entry.error(error);
            }
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.taskHistory = Bifrost.tasks.taskHistory;
Bifrost.namespace("Bifrost.tasks", {
    Tasks: Bifrost.Type.extend(function (taskHistory) {
        /// <summary>Represents an aggregation of tasks</summary>
        var self = this;

        /// <field name="all" type="Bifrost.tasks.Task">All tasks being executed</field>
        this.all = ko.observableArray();

        /// <field name="errors" type="observableArrayOfString">All errors that occured during execution of the task</field>
        this.errors = ko.observableArray();
        
        /// <field name="isBusy" type="Boolean">Returns true if the system is busy working, false if not</field>
        this.isBusy = ko.computed(function () {
            return self.all().length > 0;
        });

        this.execute = function (task) {
            /// <summary>Adds a task and starts executing it right away</summary>
            /// <param name="task" type="Bifrost.tasks.Task">Task to add</summary>
            /// <returns>A promise to work with for chaining further events</returns>

            var promise = Bifrost.execution.Promise.create();

            self.all.push(task);

            var taskHistoryId = taskHistory.begin(task);

            task.execute().continueWith(function (result) {
                self.all.remove(task);
                taskHistory.end(taskHistoryId, result);
                promise.signal(result);
            }).onFail(function (error) {
                self.all.remove(task);
                taskHistory.failed(taskHistoryId, error);
                promise.fail(error);
            });

            return promise;
        };
    })
});
Bifrost.namespace("Bifrost.tasks", {
    tasksFactory: Bifrost.Singleton(function () {
        this.create = function () {
            var tasks = Bifrost.tasks.Tasks.create();
            return tasks;
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.tasksFactory = Bifrost.tasks.tasksFactory;
Bifrost.namespace("Bifrost.tasks", {
    HttpGetTask: Bifrost.tasks.Task.extend(function (server, url, payload) {
        /// <summary>Represents a task that can perform Http Get requests</summary>
        var self = this;

        this.execute = function () {
            var promise = Bifrost.execution.Promise.create();
            server
                .get(url, payload)
                    .continueWith(function (result) {
                        promise.signal(result);
                    })
                    .onFail(function (error) {
                        promise.fail(error);
                    });
            return promise;
        };
    })
});
Bifrost.namespace("Bifrost.tasks", {
    HttpPostTask: Bifrost.tasks.Task.extend(function (server, url, payload) {
        /// <summary>Represents a task that can perform a Http Post request</summary>
        var self = this;

        this.execute = function () {
            var promise = Bifrost.execution.Promise.create();

            server
                .post(url, payload)
                    .continueWith(function (result) {
                        promise.signal(result);
                    })
                    .onFail(function (error) {
                        promise.fail(error);
                    });
            return promise;
        };
    })
});
Bifrost.namespace("Bifrost.tasks", {
    LoadTask: Bifrost.tasks.Task.extend(function () {
        /// <summary>Represents a base task that represents anything that is loading things</summary>
        this.execute = function () {
            var promise = Bifrost.execution.Promise.create();
            promise.signal();
            return promise;
        };
    })
});
Bifrost.namespace("Bifrost.tasks", {
    FileLoadTask: Bifrost.tasks.LoadTask.extend(function (files, fileManager) {
        /// <summary>Represents a task for loading view related files asynchronously</summary>
        this.files = files;

        var self = this;

        this.files = [];
        files.forEach(function (file) {
            self.files.push(file.path.fullPath);
        });

        this.execute = function () {
            var promise = Bifrost.execution.Promise.create();

            fileManager.load(files).continueWith(function (instances) {
                promise.signal(instances);
            });
            return promise;
        }
    })
});
Bifrost.namespace("Bifrost.tasks", {
    ExecutionTask: Bifrost.tasks.Task.extend(function () {
        /// <summary>Represents a base task that represents anything that is executing</summary>
        this.execute = function () {
        };
    })
});
Bifrost.namespace("Bifrost", {
    taskFactory: Bifrost.Singleton(function () {
        var self = this;

        this.createHttpPost = function (url, payload) {
            var task = Bifrost.tasks.HttpPostTask.create({
                url: url,
                payload: payload
            });
            return task;
        };

        this.createHttpGet = function (url, payload) {
            var task = Bifrost.tasks.HttpGetTask.create({
                url: url,
                payload: payload
            });
            return task;
        };

        this.createQuery = function (query, paging) {
            var task = Bifrost.read.QueryTask.create({
                query: query,
                paging: paging
            });
            return task;
        };

        this.createReadModel = function (readModelOf, propertyFilters) {
            var task = Bifrost.read.ReadModelTask.create({
                readModelOf: readModelOf,
                propertyFilters: propertyFilters
            });
            return task;
        };

        this.createHandleCommand = function (command) {
            var task = Bifrost.commands.HandleCommandTask.create({
                command: command
            });
            return task;
        };

        this.createHandleCommands = function (commands) {
            var task = Bifrost.commands.HandleCommandsTask.create({
                commands: commands
            });
            return task;
        };

        this.createViewLoad = function (files) {
            var task = Bifrost.views.ViewLoadTask.create({
                files: files
            });
            return task;
        };

        this.createViewModelLoad = function (files) {
            var task = Bifrost.views.ViewModelLoadTask.create({
                files: files
            });
            return task;
        };

        this.createViewModelApplier = function (view, masterViewModel) {
            var task = Bifrost.views.ViewModelApplierTask.create({
                view: view,
                masterViewModel: masterViewModel
            });
            return task;
        };


        this.createViewModelsApplier = function (root, masterViewModel) {
            var task = Bifrost.views.ViewModelsApplierTask.create({
                root: root,
                masterViewModel: masterViewModel
            });
            return task;
        };

        this.createViewRender = function (element) {
            var task = Bifrost.views.ViewRenderTask.create({
                element: element
            });
            return task;
        };

        this.createFileLoad = function (files) {
            var task = Bifrost.tasks.FileLoadTask.create({
                files: files
            });
            return task;
        };
    })
});
Bifrost.namespace("Bifrost.validation");
Bifrost.Exception.define("Bifrost.validation.OptionsNotDefined", "Option was undefined");
Bifrost.Exception.define("Bifrost.validation.OptionsValueNotSpecified", "Required value in Options is not specified. ");
Bifrost.Exception.define("Bifrost.validation.NotANumber", "Value is not a number");
Bifrost.Exception.define("Bifrost.validation.NotAString", "Value is not a string");
Bifrost.Exception.define("Bifrost.validation.ValueNotSpecified","Value is not specified");
Bifrost.Exception.define("Bifrost.validation.MinNotSpecified","Min is not specified");
Bifrost.Exception.define("Bifrost.validation.MaxNotSpecified","Max is not specified");
Bifrost.Exception.define("Bifrost.validation.MinLengthNotSpecified","Min length is not specified");
Bifrost.Exception.define("Bifrost.validation.MaxLengthNotSpecified","Max length is not specified");
Bifrost.Exception.define("Bifrost.validation.MissingExpression","Expression is not specified");
Bifrost.namespace("Bifrost.validation");
Bifrost.validation.ruleHandlers = (function () {
    return Bifrost.validation.ruleHandlers || { };
})();
Bifrost.namespace("Bifrost.validation", {
    Rule: Bifrost.Type.extend(function (options) {
        var self = this;
        options = options || {};
        this.message = options.message || "";
        this.options = {};
        Bifrost.extend(this.options, options);

        this.validate = function (value) {
            return true;
        };
    })
});
Bifrost.namespace("Bifrost.validation");
Bifrost.validation.Validator = (function () {
    function Validator(options) {
        var self = this;
        this.isValid = ko.observable(true);
        this.message = ko.observable("");
        this.rules = [];
        this.isRequired = false;
        options = options || {};

        this.setOptions = function (options) {
            for (var property in options) {
                var ruleTypes = Bifrost.validation.Rule.getExtenders();
                ruleTypes.some(function (ruleType) {
                    if (ruleType._name === property) {
                        var rule = ruleType.create({ options: options[property] || {} });
                        self.rules.push(rule);
                    }

                    if (ruleType._name === "required") {
                        self.isRequired = true;
                    }
                });
            }
        };

        this.validate = function (value) {
            value = ko.utils.unwrapObservable(value);
            self.rules.some(function(rule) {
                if (!rule.validate(value)) {
                    self.isValid(false);
                    self.message(rule.message);
                    return true;
                } else {
                    self.isValid(true);
                    self.message("");
                }
            });
        };

        this.validateSilently = function (value) {
            self.rules.some(function (rule) {
                if (!rule.validate(value)) {
                    self.isValid(false);
                    return true;
                } else {
                    self.isValid(true);
                }
            });
        };


        this.setOptions(options);
    }

    return {
        create: function (options) {
            var validator = new Validator(options);
            return validator;
        },
        applyTo: function (itemOrItems, options) {
            var self = this;

            function applyToItem(item) {
                var validator = self.create(options);
                item.validator = validator;
            }

            if (itemOrItems instanceof Array) {
                itemOrItems.forEach(function (item) {

                    applyToItem(item);
                });
            } else {
                applyToItem(itemOrItems);
            }
        },
        applyToProperties: function (item, options) {
            var items = [];

            for (var property in item) {
                if (item.hasOwnProperty(property)) {
                    items.push(item[property]);
                }
            }
            this.applyTo(items, options);
        }
    }
})();
if (typeof ko !== 'undefined') {
    Bifrost.namespace("Bifrost.validation", {
        ValidationSummary: function (commands, containerElement) {
            var self = this;
            this.commands = ko.observable(commands);
            this.messages = ko.observableArray([]);
            this.hasMessages = ko.computed(function(){
                return this.messages().length > 0
            },self);

            function aggregateMessages() {
                var actualMessages = [];
                self.commands().forEach(function (command) {
                    var unwrappedCommand = ko.utils.unwrapObservable(command);

                    unwrappedCommand.validators().forEach(function (validator) {
                        if (!validator.isValid() && validator.message().length) {
                            actualMessages.push(validator.message());
                        }
                    });
                });
                self.messages(actualMessages);
            }

            commands.forEach(function (command) {
                var unwrappedCommand = ko.utils.unwrapObservable(command);

                unwrappedCommand.validators().forEach(function (validator) {
                    validator.message.subscribe(aggregateMessages);
                }); 
            });
        }
    });

    ko.bindingHandlers.validationSummaryFor = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var target = ko.bindingHandlers.validationSummaryFor.getValueAsArray(valueAccessor);
            var validationSummary = new Bifrost.validation.ValidationSummary(target);
            var ul = document.createElement("ul");
            element.appendChild(ul);
            ul.innerHTML = "<li><span data-bind='text: $data'></span></li>";

            ko.utils.domData.set(element, 'validationsummary', validationSummary);
            
            ko.applyBindingsToNode(element, { visible: validationSummary.hasMessages }, validationSummary);
            ko.applyBindingsToNode(ul, { foreach: validationSummary.messages }, validationSummary);
        },
        update: function (element, valueAccessor) {
            var validationSummary = ko.utils.domData.get(element, 'validationsummary');
            validationSummary.commands( ko.bindingHandlers.validationSummaryFor.getValueAsArray(valueAccessor) );
        },
        getValueAsArray: function (valueAccessor) {
            var target = ko.utils.unwrapObservable(valueAccessor());
            if (!(Bifrost.isArray(target))) { target = [target]; }
            return target;
        }
    };
}
if (typeof ko !== 'undefined') {
    ko.bindingHandlers.validationMessageFor = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var value = valueAccessor();
            var validator = value.validator;

            validator.isValid.subscribe(function (newValue) {
                if (newValue == true) {
                    $(element).hide();
                } else {
                    $(element).show();
                }
            });
            ko.applyBindingsToNode(element, { text: validator.message }, validator);
        }
    };
}
if (typeof ko !== 'undefined') {
    ko.extenders.validation = function (target, options) {
        Bifrost.validation.Validator.applyTo(target, options);
        target.subscribe(function (newValue) {
            target.validator.validate(newValue);
        });

        // Todo : look into aggressive validation
        //target.validator.validate(target());
        return target;
    };
}
Bifrost.namespace("Bifrost.validation", {
    required: Bifrost.validation.Rule.extend(function () {
        var self = this;

        this.validate = function (value) {
            return !(Bifrost.isUndefined(value) || Bifrost.isNull(value) || value == "");
        }
    })
});

Bifrost.namespace("Bifrost.validation", {
    minLength: Bifrost.validation.Rule.extend(function () {
        var self = this;

        function notSet(value) {
            return Bifrost.isUndefined(value) || Bifrost.isNull(value);
        }

        function throwIfValueIsNotANumber(value) {
            if (!Bifrost.isNumber(value)) {
                throw new Bifrost.validation.NotANumber("Value " + value + " is not a number");
            }
        }

        function throwIfOptionsInvalid(options) {
            if (notSet(options)) {
                throw new Bifrost.validation.OptionsNotDefined();
            }
            if (notSet(options.length)) {
                throw new Bifrost.validation.MaxNotSpecified();
            }
            throwIfValueIsNotANumber(options.length)
        }


        function throwIfValueIsNotAString(string) {
            if (!Bifrost.isString(string)) {
                throw new Bifrost.validation.NotAString("Value " + string + " is not a string");
            }
        }

        this.validate = function (value) {
            throwIfOptionsInvalid(self.options);
            if (notSet(value)) {
                return false;
            }
            throwIfValueIsNotAString(value);
            return value.length >= self.options.length;
        };
    })
});

Bifrost.namespace("Bifrost.validation", {
    maxLength: Bifrost.validation.Rule.extend(function() {
        var self = this;

        function notSet(value) {
            return Bifrost.isUndefined(value) || Bifrost.isNull(value);
        }

        function throwIfValueIsNotANumber(value) {
            if (!Bifrost.isNumber(value)) {
                throw new Bifrost.validation.NotANumber("Value " + value + " is not a number");
            }
        }

        function throwIfOptionsInvalid(options) {
            if (notSet(options)) {
                throw new Bifrost.validation.OptionsNotDefined();
            }
            if (notSet(options.length)) {
                throw new Bifrost.validation.MaxNotSpecified();
            }
            throwIfValueIsNotANumber(options.length)
        }

    
        function throwIfValueIsNotAString(string) {
            if (!Bifrost.isString(string)) {
                throw new Bifrost.validation.NotAString("Value " + string + " is not a string");
            }
        }

        this.validate = function (value) {
            throwIfOptionsInvalid(self.options);
            if (notSet(value)) {
                return false;
            }
            throwIfValueIsNotAString(value);
            return value.length <= self.options.length;
        };
    })
});

Bifrost.namespace("Bifrost.validation", {
    range: Bifrost.validation.Rule.extend(function () {
        var self = this;

        function notSet(value) {
            return Bifrost.isUndefined(value) || Bifrost.isNull(value);
        }

        function throwIfValueIsNotANumber(value, param) {
            if (!Bifrost.isNumber(value)) {
                throw new Bifrost.validation.NotANumber(param + " value " + value + " is not a number");
            }
        }


        function throwIfOptionsInvalid(options) {
            if (notSet(options)) {
                throw new Bifrost.validation.OptionsNotDefined();
            }
            if (notSet(options.max)) {
                throw new Bifrost.validation.MaxNotSpecified();
            }
            if (notSet(options.min)) {
                throw new Bifrost.validation.MinNotSpecified();
            }
            throwIfValueIsNotANumber(options.min, "min")
            throwIfValueIsNotANumber(options.max, "max")
        }


        this.validate = function (value) {
            throwIfOptionsInvalid(self.options);
            if (notSet(value)) {
                return false;
            }
            throwIfValueIsNotANumber(value, "value");
            return self.options.min <= value && value <= self.options.max;
        };

    })
});
Bifrost.namespace("Bifrost.validation", {
    lessThan: Bifrost.validation.Rule.extend(function () {
        var self = this;

        function notSet(value) {
            return Bifrost.isUndefined(value) || Bifrost.isNull(value);
        }

        function throwIfOptionsInvalid(options) {
            if (notSet(options)) {
                throw new Bifrost.validation.OptionsNotDefined();
            }
            if (notSet(options.value)) {
                var exception = new Bifrost.validation.OptionsValueNotSpecified();
                exception.message = exception.message + " 'value' is not set."
                throw exception;
            }
        }

        function throwIsValueToCheckIsNotANumber(value) {
            if (!Bifrost.isNumber(value)) {
                throw new Bifrost.validation.NotANumber("Value " + value + " is not a number");
            }
        }

        this.validate = function (value) {
            throwIfOptionsInvalid(self.options);
            if (notSet(value)) {
                return false;
            }
            throwIsValueToCheckIsNotANumber(value);
            return parseFloat(value) < parseFloat(self.options.value);
        };
    })
});
Bifrost.namespace("Bifrost.validation.ruleHandlers");
Bifrost.validation.ruleHandlers.lessThanOrEqual = {
    throwIfOptionsInvalid: function (options) {
        if (this.notSet(options)) {
            throw new Bifrost.validation.OptionsNotDefined();
        }
        if (this.notSet(options.value)) {
            var exception = new Bifrost.validation.OptionsValueNotSpecified();
            exception.message = exception.message + " 'value' is not set."
            throw exception;
        }
    },

    throwIsValueToCheckIsNotANumber: function (value) {
        if (!Bifrost.isNumber(value)) {
            throw new Bifrost.validation.NotANumber("Value " + value + " is not a number");
        }
    },

    notSet: function (value) {
        return Bifrost.isUndefined(value) || Bifrost.isNull(value);
    },

    validate: function (value, options) {
        this.throwIfOptionsInvalid(options);
        if (this.notSet(value)) {
            return false;
        }
        this.throwIsValueToCheckIsNotANumber(value);
        return parseFloat(value) <= parseFloat(options.value);
    }
};
Bifrost.namespace("Bifrost.validation", {
    greaterThan: Bifrost.validation.Rule.extend(function() {
        var self = this;

        function notSet(value) {
            return Bifrost.isUndefined(value) || Bifrost.isNull(value);
        }

        function throwIfOptionsInvalid(options) {
            if (notSet(options)) {
                throw new Bifrost.validation.OptionsNotDefined();
            }
            if (notSet(options.value)) {
                var exception = new Bifrost.validation.OptionsValueNotSpecified();
                exception.message = exception.message + " 'value' is not set."
                throw exception;
            }
            throwIfValueToCheckIsNotANumber(options.value);
        }
       
        function throwIfValueToCheckIsNotANumber(value) {
            if (!Bifrost.isNumber(value)) {
                throw new Bifrost.validation.NotANumber("Value " + value + " is not a number");
            }
        }

        this.validate = function (value) {
            throwIfOptionsInvalid(self.options);
            if (notSet(value)) {
                return false;
            }
            throwIfValueToCheckIsNotANumber(value);
            return parseFloat(value) > parseFloat(self.options.value);
        };
    })
});
Bifrost.namespace("Bifrost.validation.ruleHandlers");
Bifrost.validation.ruleHandlers.greaterThanOrEqual = {
    throwIfOptionsInvalid: function (options) {
        if (this.notSet(options)) {
            throw new Bifrost.validation.OptionsNotDefined();
        }
        if (this.notSet(options.value)) {
            var exception = new Bifrost.validation.OptionsValueNotSpecified();
            exception.message = exception.message + " 'value' is not set."
            throw exception;
        }
        this.throwIfValueToCheckIsNotANumber(options.value);
    },
       
    throwIfValueToCheckIsNotANumber: function (value) {
        if (!Bifrost.isNumber(value)) {
            throw new Bifrost.validation.NotANumber("Value " + value + " is not a number");
        }
    },

    notSet: function (value) {
        return Bifrost.isUndefined(value) || Bifrost.isNull(value);
    },

    validate: function (value, options) {
        this.throwIfOptionsInvalid(options);
        if (this.notSet(value)) {
            return false;
        }
        this.throwIfValueToCheckIsNotANumber(value);
        return parseFloat(value) >= parseFloat(options.value);
    }
};
Bifrost.namespace("Bifrost.validation", {
    email: Bifrost.validation.Rule.extend(function () {
        var self = this;
        var regex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/;

        function notSet(value) {
            return Bifrost.isNull(value) || Bifrost.isUndefined(value);
        }

        this.validate = function (value) {
            if (notSet(value)) {
                return false;
            }

            if (!Bifrost.isString(value)) {
                throw new Bifrost.validation.NotAString("Value " + value + " is not a string");
            }

            return (value.match(regex) == null) ? false : true;
        };

    })
});
Bifrost.namespace("Bifrost.validation", {
    regex: Bifrost.validation.Rule.extend(function () {
        var self = this;

        function notSet(value) {
            return Bifrost.isUndefined(value) || Bifrost.isNull(value);
        }

        function throwIfOptionsInvalid(options) {
            if (notSet(options)) {
                throw new Bifrost.validation.OptionsNotDefined();
            }
            if (notSet(options.expression)) {
                throw new Bifrost.validation.MissingExpression();
            }
            if (!Bifrost.isString(options.expression)) {
                throw new Bifrost.validation.NotAString("Expression " + options.expression+ " is not a string.");
            }
        }

        function throwIfValueIsNotString(value) {
            if (!Bifrost.isString(value)) {
                throw new Bifrost.validation.NotAString("Value " + value + " is not a string.");
            }
        }

        this.validate = function (value) {
            throwIfOptionsInvalid(self.options);
            if (notSet(value)) {
                return false;
            }
            throwIfValueIsNotString(value);
            return (value.match(self.options.expression) == null) ? false : true;
        };
    })
});


if (typeof ko !== 'undefined') {
    ko.bindingHandlers.command = {
        init: function (element, valueAccessor, allBindingAccessor, viewModel) {
			var value = valueAccessor();
			var command;
			var contextBound = false;
			if( typeof value.canExecute === "undefined" ) {
				command = value.target;
				
				command.parameters = command.parameters || {};
				var parameters = value.parameters || {};
				
				for( var parameter in parameters ) {
					var parameterValue = parameters[parameter];
					
					if( command.parameters.hasOwnProperty(parameter) &&
						ko.isObservable(command.parameters[parameter]) ) {
						command.parameters[parameter](parameterValue);
					} else {
						command.parameters[parameter] = ko.observable(parameterValue);
					}
				}
				contextBound = true;
			} else {
				command = value;
			}
            ko.applyBindingsToNode(element, { click: function() {
				// TODO: Investigate further - idea was to support a "context-sensitive" way of dynamically inserting 
				// parameters before execution of the command
				/*
				if( !contextBound ) {
					command.parameters = command.parameters || {};					
					for( var parameter in command.parameters ) {
						if( viewModel.hasOwnProperty(parameter) ) {
							var parameterValue = viewModel[parameter];
							if( ko.isObservable(command.parameters[parameter]) ) {
								command.parameters[parameter](parameterValue);
							} else {
								command.parameters[parameter] = parameterValue;								
							}
						}
					}
				}
				*/
	
				command.execute();
			}}, viewModel);
        }
    };
}
Bifrost.namespace("Bifrost.commands", {
    HandleCommandTask: Bifrost.tasks.ExecutionTask.extend(function (command, server) {
        /// <summary>Represents a task that can handle a command</summary>
        this.name = command.name;

        this.execute = function () {
            var promise = Bifrost.execution.Promise.create();

            var commandDescriptor = Bifrost.commands.CommandDescriptor.createFrom(command);
            var parameters = {
                commandDescriptor: commandDescriptor
            };

            var url = "/Bifrost/CommandCoordinator/Handle?_cmd=" + command.generatedFrom;

            server.post(url, parameters).continueWith(function (result) {
                var commandResult = Bifrost.commands.CommandResult.createFrom(result);
                promise.signal(commandResult);
            });

            return promise;
        };
    })
});
Bifrost.namespace("Bifrost.commands", {
    HandleCommandsTask: Bifrost.tasks.ExecutionTask.extend(function (commands, server) {
        /// <summary>Represents a task that can handle an array of command</summary>
        var self = this;

        this.names = [];
        commands.forEach(function (command) {
            self.names.push(command.name);
        });

        this.execute = function () {
            var promise = Bifrost.execution.Promise.create();

            var commandDescriptors = [];

            commands.forEach(function (command) {
                command.isBusy(true);
                var commandDescriptor = Bifrost.commands.CommandDescriptor.createFrom(command);
                commandDescriptors.push(commandDescriptor);
            });

            var parameters = {
                commandDescriptors: commandDescriptors
            };

            var url = "/Bifrost/CommandCoordinator/HandleMany";

            server.post(url, parameters).continueWith(function (results) {
                var commandResults = [];

                results.forEach(function (result) {
                    var commandResult = Bifrost.commands.CommandResult.createFrom(result);
                    commandResults.push(commandResult);
                });
                promise.signal(commandResults);
            });

            return promise;
        }
    })
});
Bifrost.namespace("Bifrost.commands", {
    commandCoordinator: Bifrost.Singleton(function (taskFactory) {
        this.handle = function (command) {
            var promise = Bifrost.execution.Promise.create();
            var task = taskFactory.createHandleCommand(command);

            command.region.tasks.execute(task).continueWith(function (commandResult) {
                promise.signal(commandResult);
            });

            return promise;
        };

        this.handleMany = function (commands, region) {
            var promise = Bifrost.execution.Promise.create();

            try {
                var task = taskFactory.createHandleCommands(commands);

                region.tasks.execute(task).continueWith(function (commandResults) {
                    commands.forEach(function (command, index) {
                        var commandResult = commandResults[index];
                        if (commandResult != null && !Bifrost.isUndefined(commandResult)) {
                            command.handleCommandResult(commandResult);
                        }
                        command.isBusy(false);
                    });

                    promise.signal(commandResults);
                });
            } catch(e) {
                commands.forEach(function(command) {
                    command.isBusy(false);
                });
            }

            return promise;
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.commandCoordinator = Bifrost.commands.commandCoordinator;
Bifrost.namespace("Bifrost.commands", {
    commandValidationService: Bifrost.Singleton(function () {
        var self = this;

        function shouldSkipProperty(target, property) {
            if (target instanceof Bifrost.views.Region) return true;
            if (target instanceof HTMLElement) return true;
            if (!target.hasOwnProperty(property)) return true;
            if (ko.isObservable(target[property])) return false;
            if (typeof target[property] === "function") return true;
            if (property == "_type") return true;
            if (property == "_namespace") return true;
            if ((target[property] == null) ) return true;
            if ((typeof target[property].prototype !== "undefined") &&
                (target[property].prototype !== null) &&
                (target[property] instanceof Bifrost.Type)) {
                return true;
            }

            return false;
        }

        function extendProperties(target, validators) {
            for (var property in target) {
                if (shouldSkipProperty(target, property)) continue;
                if (typeof target[property].validator != "undefined") continue;

                if (ko.isObservable(target[property])) {
                    target[property].extend({ validation: {} });
                    target[property].validator.propertyName = property;
                } else if (typeof target[property] === "object") {
                    extendProperties(target[property], validators);
                }
            }
        }

        function validatePropertiesFor(target, result, silent) {
            for (var property in target) {
                if (shouldSkipProperty(target, property)) continue;

                if (typeof target[property].validator !== "undefined") {
                    if (silent === true) {
                        target[property].validator.validateSilently(target[property]());
                    } else {
                        target[property].validator.validate(target[property]());
                    }

                    if (target[property].validator.isValid() == false) {
                        result.valid = false;
                    }
                } else if (typeof target[property] === "object") {
                    validatePropertiesFor(target[property], result, silent);
                }
            }
        }


        function applyValidationMessageToMembers(command, members, message) {
            for (var memberIndex = 0; memberIndex < members.length; memberIndex++) {
                var path = members[memberIndex].split(".");
                var property = null;
                var target = command;
                path.forEach(function (member) {
                    property = member.toCamelCase();
                    if (property in target) {
                        if (typeof target[property] === "object") {
                            target = target[property];
                        }
                    }
                });

                if (property != null && property.length) {
                    var member = target[property];

                    if (typeof member.validator !== "undefined") {
                        member.validator.isValid(false);
                        member.validator.message(message);
                    }
                }

            }
        }

        this.applyValidationResultToProperties = function (command, validationResults) {

            for (var i = 0; i < validationResults.length; i++) {
                var validationResult = validationResults[i];
                var message = validationResult.errorMessage;
                var memberNames = validationResult.memberNames;
                if (memberNames.length > 0) {
                    applyValidationMessageToMembers(command, memberNames, message);
                }
            }
        };

        this.validate = function (command) {
            var result = { valid: true };
            validatePropertiesFor(command, result);
            return result;
        };
        
        this.validateSilently = function (command) {
            var result = { valid: true };
            validatePropertiesFor(command, result, true);
            return result;
        };

        this.extendPropertiesWithoutValidation = function (command) {
            extendProperties(command);
        };


        function collectValidators(source, validators) {
            for (var property in source) {
                var value = source[property];

                if (shouldSkipProperty(source, property)) continue;

                if (ko.isObservable(value) && typeof value.validator != "undefined") {
                    validators.push(value.validator);
                } else if (Bifrost.isObject(value)) {
                    collectValidators(value, validators);
                }
            }
        }

        this.getValidatorsFor = function (command) {
            var validators = [];
            collectValidators(command, validators);
            return validators;
        };
    })
});
Bifrost.namespace("Bifrost.commands", {
    Command: Bifrost.Type.extend(function (commandCoordinator, commandValidationService, commandSecurityService, options, region) {
        var self = this;
        this.region = region;
        this.name = "";
        this.generatedFrom = "";
        this.targetCommand = this;
        this.validators = ko.observableArray();
        this.hasChangesObservables = ko.observableArray();
        this.validationMessages = ko.observableArray();
        this.securityContext = ko.observable(null);
        this.populatedFromExternalSource = ko.observable(false);
        

        this.isBusy = ko.observable(false);
        this.isValid = ko.computed(function () {
            var valid = true;
            self.validators().some(function (validator) {
                if (ko.isObservable(validator.isValid) && validator.isValid() == false) {
                    valid = false;
                    return true;
                }
            });

            if (self.validationMessages().length > 0) {
                return false;
            }

            return valid;
        });
        this.isAuthorized = ko.observable(false);
        this.canExecute = ko.computed(function () {
            return self.isValid() && self.isAuthorized();
        });
        this.isPopulatedExternally = ko.observable(false);
        this.isReady = ko.computed(function () {
            if (self.isPopulatedExternally() == false) {
                return true;
            }
            return self.populatedFromExternalSource();
        });
        this.isReadyToExecute = ko.computed(function () {
            if (self.isPopulatedExternally() == false) {
                return true;
            }

            return self.hasChanges();
        });
        

        this.hasChanges = ko.computed(function () {
            var hasChange = false;
            self.hasChangesObservables().some(function (item) {
                if (item() === true) {
                    hasChange = true;
                    return true;
                }
            });

            return hasChange;
        });

        this.failedCallbacks = [];
        this.succeededCallbacks = [];
        this.completedCallbacks = [];

        this.commandCoordinator = commandCoordinator;
        this.commandValidationService = commandValidationService;
        this.commandSecurityService = commandSecurityService;

        this.options = {
            beforeExecute: function () { },
            failed: function () { },
            succeeded: function () { },
            completed: function () { },
            properties: {}
        };

        this.failed = function (callback) {
            self.failedCallbacks.push(callback);
            return self;
        };
        this.succeeded = function (callback) {
            self.succeededCallbacks.push(callback);
            return self;
        };
        this.completed = function (callback) {
            self.completedCallbacks.push(callback);
            return self;
        };

        this.setOptions = function (options) {
            Bifrost.extend(self.options, options);
            if (typeof options.name !== "undefined" && typeof options.name === "string") {
                self.name = options.name;
            }
        };

        this.copyPropertiesFromOptions = function () {
            for (var property in self.targetCommand.options.properties) {
                var value = self.targetCommand.options.properties[property];
                if (!ko.isObservable(value)) {
                    value = ko.observable(value);
                }

                self.targetCommand[property] = value;
            }
        };

        this.getProperties = function () {
            var properties = [];
            for (var property in self.targetCommand) {
                if (self.targetCommand.hasOwnProperty(property) && 
                    !(self.hasOwnProperty(property))) {
                    properties.push(property);
                }
            }

            return properties;
        };

        this.makePropertiesObservable = function () {
            var properties = self.getProperties();
            properties.forEach(function (property) {
                var value = null;
                var propertyValue = self.targetCommand[property];

                if (!ko.isObservable(propertyValue) &&
                     (typeof propertyValue != "object" || Bifrost.isArray(propertyValue))) {

                    if (typeof propertyValue !== "function") {
                        if (Bifrost.isArray(propertyValue)) {
                            value = ko.observableArray(propertyValue);
                        } else {
                            value = ko.observable(propertyValue);
                        }
                        self.targetCommand[property] = value;
                    }
                }
            });
        };

        this.extendPropertiesWithHasChanges = function () {
            var properties = self.getProperties();
            properties.forEach(function(property) {
                var propertyValue = self.targetCommand[property];
                if (ko.isObservable(propertyValue)) {
                    propertyValue.extend({ hasChanges: {} })
                    self.hasChangesObservables.push(propertyValue.hasChanges);
                }
            });
        };

        this.onBeforeExecute = function () {
            self.options.beforeExecute();
        };

        this.onFailed = function (commandResult) {
            self.options.failed(commandResult);

            self.failedCallbacks.forEach(function (callback) {
                callback(commandResult);
            });
        };

        this.setInitialValuesFromCurrentValues = function () {
            var properties = self.getProperties();
            properties.forEach(function (propertyName) {
                var property = self.targetCommand[propertyName];
                if (ko.isObservable(property) && ko.isWriteableObservable(property)) {
                    var value = property();
                    property.setInitialValue(value);
                }
            });
        };


        this.onSucceeded = function (commandResult) {
            self.options.succeeded(commandResult);

            self.setInitialValuesFromCurrentValues();

            self.succeededCallbacks.forEach(function (callback) {
                callback(commandResult);
            });
        };

        this.onCompleted = function (commandResult) {
            self.options.completed(commandResult);

            self.completedCallbacks.forEach(function (callback) {
                callback(commandResult);
            });
        };

        this.handleCommandResult = function (commandResult) {
            self.isBusy(false);
            if (typeof commandResult.commandValidationMessages !== "undefined") {
                self.validationMessages(commandResult.commandValidationMessages);
            }

            if (commandResult.success === false || commandResult.invalid === true) {
                if (commandResult.invalid && typeof commandResult.validationResults !== "undefined") {
                    self.commandValidationService.applyValidationResultToProperties(self.targetCommand, commandResult.validationResults);
                }
                self.onFailed(commandResult);
            } else {
                self.onSucceeded(commandResult);
            }
            self.onCompleted(commandResult);
        };

        this.getCommandResultFromValidationResult = function (validationResult) {
            var result = Bifrost.commands.CommandResult.create();
            result.invalid = true;
            return result;
        };

        this.execute = function () {
            self.isBusy(true);
            try {
                self.onBeforeExecute();
                var validationResult = self.commandValidationService.validate(this);
                if (validationResult.valid === true) {
                        self.commandCoordinator.handle(self.targetCommand).continueWith(function (commandResult) {
                            self.handleCommandResult(commandResult);
                        });
                } else {
                    var commandResult = self.getCommandResultFromValidationResult(validationResult);
                    self.handleCommandResult(commandResult);
                }
            } catch (ex) {
                self.isBusy(false);
            }
        };

        this.populatedExternally = function () {
            self.isPopulatedExternally(true);
        };

        this.populateFromExternalSource = function (values) {
            self.isPopulatedExternally(true);
            self.setPropertyValuesFrom(values);
            self.populatedFromExternalSource(true);
        };

        function setValueOnObservable(observable, value) {
            observable(value);

            if (typeof observable.setInitialValue == "function") {
                observable.setInitialValue(value);
            }
        }


        this.setPropertyValuesFrom = function (values) {
            var properties = this.getProperties();

            for (var valueProperty in values) {
                properties.forEach(function (property) {
                    if (valueProperty == property) {
                        var value = ko.utils.unwrapObservable(values[property]);
                        var observable = self.targetCommand[property];

                        if (!ko.isObservable(observable)) {

                            for (var subProperty in observable) {
                                setValueOnObservable(observable[subProperty], value[subProperty]);
                            }
                        } else {
                            setValueOnObservable(observable, value);
                        }
                    }
                });
            }
        };

        this.onCreated = function (lastDescendant) {
            region.commands.push(lastDescendant);
            self.targetCommand = lastDescendant;
            if (typeof options !== "undefined") {
                this.setOptions(options);
                this.copyPropertiesFromOptions();
            }
            this.makePropertiesObservable();
            this.extendPropertiesWithHasChanges();
            if (typeof lastDescendant.name !== "undefined" && lastDescendant.name != "") {
                commandValidationService.extendPropertiesWithoutValidation(lastDescendant);
                var validators = commandValidationService.getValidatorsFor(lastDescendant);
                if (Bifrost.isArray(validators) && validators.length > 0) self.validators(validators);
                commandValidationService.validateSilently(this);
            }
            
            commandSecurityService.getContextFor(lastDescendant).continueWith(function (securityContext) {
                lastDescendant.securityContext(securityContext);

                if (ko.isObservable(securityContext.isAuthorized)) {
                    lastDescendant.isAuthorized(securityContext.isAuthorized());
                    securityContext.isAuthorized.subscribe(function (newValue) {
                        lastDescendant.isAuthorized(newValue);
                    });
                }
            });
        };
    })
});
Bifrost.namespace("Bifrost.commands");
Bifrost.commands.CommandDescriptor = function(command) {
    var self = this;

    var builtInCommand = {};
    if (typeof Bifrost.commands.Command !== "undefined") {
        builtInCommand = Bifrost.commands.Command.create();
    }

    function shouldSkipProperty(target, property) {
        if (!target.hasOwnProperty(property)) return true;
        if (builtInCommand.hasOwnProperty(property)) return true;
        if (ko.isObservable(target[property])) return false;
        if (typeof target[property] === "function") return true;
        if (property == "_type") return true;
        if (property == "_namespace") return true;

        return false;
    }

    function getPropertiesFromCommand(command) {
        var properties = {};

        for (var property in command) {
            if (!shouldSkipProperty(command, property) ) {
                properties[property] = command[property];
            }
        }
        return properties;
    }

    this.name = command.name;
    this.generatedFrom = command.generatedFrom;
    this.id = Bifrost.Guid.create();

    var properties = getPropertiesFromCommand(command);
    var commandContent = ko.toJS(properties);
    commandContent.Id = Bifrost.Guid.create();
    this.command = ko.toJSON(commandContent);
};


Bifrost.commands.CommandDescriptor.createFrom = function (command) {
    var commandDescriptor = new Bifrost.commands.CommandDescriptor(command);
    return commandDescriptor;
};

Bifrost.namespace("Bifrost.commands");
Bifrost.commands.CommandResult = (function () {
    function CommandResult(existing) {
        var self = this;
        this.isEmpty = function () {
            return self.commandId === Bifrost.Guid.empty;
        };

        if (typeof existing !== "undefined") {
            Bifrost.extend(this, existing);
        } else {
            this.commandName = "";
            this.commandId = Bifrost.Guid.empty;
            this.validationResults = [];
            this.success = true;
            this.invalid = false;
            this.exception = undefined;
        }
    }

    return {
        create: function() {
            var commandResult = new CommandResult();
            return commandResult;
        },
        createFrom: function (result) {
            var existing = typeof result === "string" ? $.parseJSON(result) : result;
            var commandResult = new CommandResult(existing);
            return commandResult;
        }
    };
})();
Bifrost.dependencyResolvers.command = {
    canResolve: function (namespace, name) {
        if (typeof commands !== "undefined") {
            return name in commands;
        }
        return false;
    },

    resolve: function (namespace, name) {
        return commands[name].create();
    }
};
Bifrost.namespace("Bifrost.commands", {
    CommandSecurityContext: Bifrost.Type.extend(function() {
        var self = this;

        this.isAuthorized = ko.observable(false);

    })
});
Bifrost.namespace("Bifrost.commands", {
    commandSecurityContextFactory: Bifrost.Singleton(function () {
        var self = this;

        this.create = function () {
            var context = Bifrost.commands.CommandSecurityContext.create();
            return context;
        };
    })
});
Bifrost.namespace("Bifrost.commands", {
    commandSecurityService: Bifrost.Singleton(function (commandSecurityContextFactory) {
        var self = this;

        this.commandSecurityContextFactory = commandSecurityContextFactory;

        function getTypeNameFor(command) {
            return command._type._name;
        }

        function getSecurityContextNameFor(type) {
            var securityContextName = type + "SecurityContext";
            return securityContextName;
        }


        function hasSecurityContextInNamespaceFor(type, namespace) {
            var securityContextName = getSecurityContextNameFor(type);
            return namespace.hasOwnProperty(securityContextName);
        }

        function getSecurityContextInNamespaceFor(type, namespace) {
            var securityContextName = getSecurityContextNameFor(type, namespace);
            return namespace[securityContextName];
        }

        this.getContextFor = function (command) {
            var promise = Bifrost.execution.Promise.create();

            var type = getTypeNameFor(command);
            if (hasSecurityContextInNamespaceFor(type, command._type._namespace)) {
                var contextType = getSecurityContextInNamespaceFor(type, command._type._namespace);
                var context = contextType.create();
                promise.signal(context);
            } else {
                var context = self.commandSecurityContextFactory.create();
                if (typeof command.generatedFrom == "undefined" || command.generatedFrom == "") {
                    promise.signal(context);
                } else {
                    var url = "/Bifrost/CommandSecurity/GetForCommand?commandName=" + command.generatedFrom;
                    $.getJSON(url, function (e) {
                        context.isAuthorized(e.isAuthorized);
                        promise.signal(context);
                    });
                }
            }

            return promise;
        };

        this.getContextForType = function (commandType) {
            var command = commandType.create({ region: { commands: [] } });
            var context = self.getContextFor(command);
            return context;
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.commandSecurityService = Bifrost.commands.commandSecurityService;
if (typeof ko !== 'undefined') {
    ko.extenders.hasChanges = function (target, options) {
        target._initialValueSet = false;
        target.hasChanges = ko.observable(false);
        function updateHasChanges() {
            if (target._initialValueSet == false) {
                target.hasChanges(false);
            } else {
                if(Bifrost.isArray(target._initialValue)){
                    target.hasChanges(!target._initialValue.shallowEquals(target()));
                    return;
                }
                else
                    target.hasChanges(target._initialValue !== target());
            }
        }

        target.subscribe(function (newValue) {
            updateHasChanges();
        });

        target.setInitialValue = function (value) {
            var initialValue;
            if (Bifrost.isArray(value))
                initialValue = value.clone();
            else
                initialValue = value;
            
            target._initialValue = initialValue;
            target._initialValueSet = true;
            updateHasChanges();
        };
    };
}
Bifrost.namespace("Bifrost.interaction", {
    Operation: Bifrost.Type.extend(function (region, context) {
        /// <summary>Defines an operation that be performed</summary>
        var self = this;

        /// <field name="context" type="Bifrost.interaction.Operation">Context in which the operation exists in</field>
        this.context = context;

        /// <field name="identifier" type="Bifrost.Guid">Unique identifier for the operation instance<field>
        this.identifier = Bifrost.Guid.empty;

        /// <field name="region" type="Bifrost.views.Region">Region that the operation was created in</field>
        this.region = region;

        /// <field name="canPerform" type="observable">Set to true if the operation can be performed, false if not</field>
        this.canPerform = ko.observable(true);
        
        this.perform = function () {
            /// <summary>Function that gets called when an operation gets performed</summary>
            /// <returns>State change, if any - typically helpful when undoing</returns>
            return {};
        };

        this.undo = function (state) {
            /// <summary>Function that gets called when an operation gets undoed</summary>
            /// <param name="state" type="object">State generated when the operation was performed</param>
        };
    })
});
Bifrost.namespace("Bifrost.interaction", {
    OperationContext: Bifrost.Type.extend(function () {
        /// <summary>Defines the context in which an operation is being performed or undoed within</summary>
        var self = this;

    })
});
Bifrost.namespace("Bifrost.interaction", {
    OperationEntry: Bifrost.Type.extend(function (operation, state) {
        /// <summary>Represents an entry for an operation in a specific context with resulting state</summary>
        var self = this;

        /// <field name="operation" type="Bifrost.interaction.Operation">Operation that was performed</field>
        this.operation = operation;

        /// <field name="state" type="object">State that operation generated</field>
        this.state = state;
    })
});
Bifrost.namespace("Bifrost.interaction", {
    operationEntryFactory: Bifrost.Singleton(function () {
        /// <summary>Represents a factory that can create OperationEntries</summary>
        var self = this;

        this.create = function (operation, state) {
            /// <sumary>Create an instance of a OperationEntry</summary>
            /// <param name="context" type="Bifrost.interaction.OperationContext">Context the operation was performed in</param>
            /// <param name="operation" type="Bifrost.interaction.Operation">Operation that was performed</param>
            /// <param name="state" type="object">State that operation generated</param>
            /// <returns>An OperationEntry</returns>
            
            var instance = Bifrost.interaction.OperationEntry.create({
                operation: operation,
                state: state
            });
            return instance;
        };
    })
});
Bifrost.namespace("Bifrost.interaction", {
    Operations: Bifrost.Type.extend(function (operationEntryFactory) {
        /// <summary>Represents a stack of operations and the ability to perform and put operations on the stack</summary>
        var self = this;

        /// <field name="all" type="observableArray">Holds all operations</field>
        this.all = ko.observableArray();

        this.getByIdentifier = function (identifier) {
            /// <summary>Get an operation by its identifier</identifier>
            /// <param name="identifier" type="Bifrost.Guid">Identifier of the operation to get<param>
            /// <returns>An instance of the operation if found, null if not found</returns>

            var found = null;
            self.all().forEach(function (operation) {
                if (operation.identifier === identifier) {
                    found = operation;
                    return;
                }
            });

            return found;
        };

        this.perform = function (operation) {
            /// <summary>Perform an operation in a given context</summary>
            /// <param name="context" type="Bifrost.interaction.OperationContext">Context in which the operation is being performed in</param>
            /// <param name="operation" type="Bifrost.interaction.Operation">Operation to perform</param>

            if (operation.canPerform() === true) {
                var state = operation.perform();
                var entry = operationEntryFactory.create(operation, state);
                self.all.push(entry);
            }
        };

        this.undo = function () {
            /// <summary>Undo the last operation on the stack and remove it as an operation</summary>

            throw "Not implemented";
        }
    })
});
Bifrost.namespace("Bifrost.interaction", {
    operationsFactory: Bifrost.Singleton(function () {
        this.create = function () {
            var operations = Bifrost.interaction.Operations.create();
            return operations;
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.operationsFactory = Bifrost.interaction.operationsFactory;
Bifrost.namespace("Bifrost.interaction", {
    CommandOperation: Bifrost.interaction.Operation.extend(function (commandSecurityService) {
        /// <summary>Represents an operation that result in a command</summary>
        var self = this;

        /// <field name="commandType" type="Bifrost.Type">Type of command to create</field>
        this.commandType = ko.observable();

        this.canPerform(false);

        this.commandType.subscribe(function (type) {
            commandSecurityService.getContextForType(type).continueWith(function (context) {
                if (!Bifrost.isNullOrUndefined(context)) self.canPerform(context.isAuthorized());
            });
        });

        this.createCommandOfType = function (commandType) {
            /// <summary>Create an instance of a given command type</summary>
            var instance = commandType.create({
                region: self.region
            });
            return instance;
        };
    })
});
Bifrost.namespace("Bifrost.interaction", {
    Action: Bifrost.Type.extend(function () {
        var self = this;

        this.perform = function () {
        };
    })
});
Bifrost.namespace("Bifrost.interaction", {
    Trigger: Bifrost.Type.extend(function () {
        var self = this;

        this.actions = [];

        this.addAction = function (action) {
            self.actions.push(action);
        };

        this.initialize = function (element) {
        };

        this.signal = function () {
            self.actions.forEach(function (action) {
                action.perform();
            });
        };
    })
});
Bifrost.namespace("Bifrost.interaction", {
    EventTrigger: Bifrost.interaction.Trigger.extend(function () {
        var self = this;

        this.eventName = null;

        function throwIfEventNameIsNotSet(trigger) {
            if (!trigger.eventName) throw "EventName is not set for trigger";
        }

        this.initialize = function (element) {
            throwIfEventNameIsNotSet(this);

            var actualEventName = "on" + self.eventName;
            if (element[actualEventName] == null || typeof element[actualEventName] == "function") {
                var originalEventHandler = element[actualEventName];
                element[actualEventName] = function (e) {
                    if (originalEventHandler) originalEventHandler(e);
                    
                    self.signal();
                };
            }

        };
    })
});
Bifrost.namespace("Bifrost.interaction", {
	VisualState: Bifrost.Type.extend(function() {
		/// <summary>Represents a visual state of a control or element</summary>
		var self = this;

		/// <field name="name" type="String">Name of the visual state</field>
		this.name = "";

		/// <field name="actions" type="Array" elementType="Bifrost.interaction.VisualStateTransitionAction">Transition actions that will execute when transitioning</field>
		this.actions = ko.observableArray();

		this.addAction = function(action) {
			/// <summary>Add action to the visual state</summary>
			/// <param name="action" type="Bifrost.interaction.VisualStateAction">
			self.actions.push(action);
		};

		this.enter = function(namingRoot, duration) {
			/// <summary>Enter the state with a given duration</summary>
			/// <param name="duration" type="Bifrost.TimeSpan">Time to spend entering the state</param>
			self.actions().forEach(function(action) {
				action.onEnter(namingRoot, duration);
			});
		};

		this.exit = function(namingRoot, duration) {
			/// <summary>Exit the state with a given duration</summary>
			/// <param name="duration" type="Bifrost.TimeSpan">Time to spend entering the state</param>
			self.actions().forEach(function(action) {
				action.onExit(namingRoot, duration);
			});
		};
	})
});
Bifrost.namespace("Bifrost.interaction", {
	VisualStateAction: Bifrost.Type.extend(function() {

		this.initialize = function(namingRoot) {

		};

		this.onEnter = function(namingRoot, duration) {

		};

		this.onExit = function(namingRoot, duration) {

		};
	})
});
Bifrost.namespace("Bifrost.interaction", {
	VisualStateGroup: Bifrost.Type.extend(function(dispatcher) {
		/// <summary>Represents a group that holds visual states</summary>
		var self = this;

		this.defaultDuration = Bifrost.TimeSpan.zero();

		/// <field name="currentState" type="Bifrost.interaction.VisualState">Holds the current state, this is an observable</field>
		this.currentState = ko.observable({name: "null state", enter: function() {}, exit: function() {}});

		/// <field name="states" type="Array" elementType="Bifrost.interaction.VisualState">Holds an observable array of visual states</field>
		this.states = ko.observableArray();

		/// <field name="transitions" type="Array" elementType="Bifrost.interaction.VisualStateTransition">Holds an observable array of visual state transitions</field>
		this.transitions = ko.observableArray();

		this.addState = function(state) {
			/// <summary>Add a state to the group</summary>
			/// <param name="state" type="Bifrost.interaction.VisualState">State to add</param>
			if( self.hasState(state.name) ) {
				throw "VisualState with name of '"+state.name+"' already exists";
			}
			self.states.push(state);
		};

		this.addTransition = function(transition) {
			/// <summary>Add transition to group</summary>
			/// <param name="transition" type="Bifrost.interaction.VisualStateTransition">Transition to add</param>
			self.transitions.push(transition);
		};

		this.hasState = function(stateName) {
			/// <summary>Check if group has state by the name of the state</summary>
			/// <param name="stateName" type="String">Name of the state to check for</param>
			/// <returns type="Boolean">True if the state exists, false if not</returns>
			var hasState = false;
			self.states().forEach(function(state) {
				if( state.name === stateName ) {
					hasState = true;
					return;
				}
			});

			return hasState;
		};

		this.getStateByName = function(stateName) {
			/// <summary>Gets a state by its name</summary>
			/// <param name="stateName" type="String">Name of the state to get</param>
			/// <returns type="Bifrost.interaction.VisualState">State found or null if it does not have a state by the given name</returns>
			var stateFound = null;
			self.states().forEach(function(state) {
				if( state.name === stateName ) {
					stateFound = state;
					return;
				}
			});
			return stateFound;
		};

		this.goTo = function(namingRoot, stateName) {
			/// <summary>Go to a specific state by the name of the state</summary>
			/// <param name="stateName" type="String">Name of the state to go to</param>
			var currentState = self.currentState();
			if( !Bifrost.isNullOrUndefined(currentState) && currentState.name === stateName ) {
				return;
			}

			var state = self.getStateByName(stateName);
			if( !Bifrost.isNullOrUndefined(state) ) {
				var duration = self.defaultDuration;
				if( !Bifrost.isNullOrUndefined(currentState) ) {
					currentState.exit(namingRoot, duration);
				}
				state.enter(namingRoot, duration);
			
				dispatcher.schedule(duration.totalMilliseconds(), function() {
					self.currentState(state);
				});
			}
		};
	})
});
Bifrost.namespace("Bifrost.interaction", {
	VisualStateManager: Bifrost.Type.extend(function() {
		/// <summary>Represents a state manager for dealing with visual states, typically related to a control or other element on a page</summary>
		var self = this;

		/// <field name="namingRoot" type="Bifrost.views.NamingRoot">A root for named objects</field>
		this.namingRoot = null;

		/// <field name="groups" type="Array" elementType="Bifrost.interaction.VisualStateGroup">Holds all groups in the state manager</field>
		this.groups = ko.observableArray();

		this.addGroup = function(group) {
			/// <summary>Adds a VisualStateGroup to the manager</summary>
			/// <param name="group" type="Bifrost.interaction.VisualStateGroup">Group to add</param>
			self.groups.push(group);
		};

		this.goTo = function(stateName) {
			/// <summary>Go to a specific state by its name</summary>
			/// <param name="stateName" type="String">Name of state to go to</param>
			self.groups().forEach(function(group) {
				if( group.hasState(stateName) == true ) {
					group.goTo(self.namingRoot, stateName);
				}
			});
		};
	})
});
Bifrost.namespace("Bifrost.interaction", {
	VisualStateTransition: Bifrost.Type.extend(function() {
		/// <summary>Represents a description of transition between two named states</summary>
		var self = this;

		/// <field name="from" type="String">Name of visual state that we are describing transitioning from</field>
		this.from = "";

		/// <field name="to" type="String">Name of visual state that we are describing transitioning to</field>
		this.to = "";

		/// <field name="duration" type="Bifrost.TimeStamp">Duration for the transition</field>
		this.duration = Bifrost.TimeStamp.zero();
	})
});
var globalId = 0;
Bifrost.namespace("Bifrost.interaction.visualStateActions", {
	Opacity: Bifrost.interaction.VisualStateAction.extend(function(documentService) {
		var self = this;
		var element = null;
		var id = documentService.getUniqueStyleName("opacity");

		this.target = "";
		this.value = "";


		this.initialize = function(namingRoot) {
		    element = namingRoot.find(self.target);
		};

		this.onEnter = function(namingRoot, duration) {
			var value = parseFloat(self.value);
			if( isNaN(value) ) value = 0.0;

			var actualDuration = duration.totalMilliseconds() / 1000;

			documentService.addStyle("."+id, {
				"-webkit-transition": "opacity "+actualDuration+"s ease-in-out",
				"-moz-transition": "opacity "+actualDuration+"s ease-in-out",
				"-ms-transition": "opacity "+actualDuration+"s ease-in-out",
				"-o-transition": "opacity "+actualDuration+"s ease-in-out",
				"transition": "opacity "+actualDuration+"s ease-in-out",
				"opacity":value
			})

			element.classList.add(id);
		};

		this.onExit = function(namingRoot, duration) {
			element.classList.remove(id);
		};
	})
})
Bifrost.namespace("Bifrost.read", {
    readModelSystemEvents: Bifrost.Singleton(function () {
        this.noInstance = Bifrost.Event.create();
    })
});
Bifrost.namespace("Bifrost.read", {
	readModelMapper : Bifrost.Type.extend(function () {
		"use strict";
		var self = this;

		function copyProperties (from, to) {
			for (var property in from){
			    if (typeof to[property] !== "undefined") {
			        if (Bifrost.isObject(to[property])) {
			            copyProperties(from[property], to[property]);
					} else {
			            to[property] = from[property];
					}
				}
			}
		}

		function mapSingleInstance(readModel, data) {
		    var instance = readModel.create();

		    if (data) {
		        if (typeof data._readModelType != "undefined") {

		            var readModelType = eval(data._readModelType);
		            if (typeof readModelType != "undefined" && readModelType !== null) {
		                readModel = readModelType;
		            }
		        }

		        copyProperties(data, instance);
		    }
		    return instance;
		};

		function mapMultipleInstances(readModel, data) {
		    var mappedInstances = [];
		    for (var i = 0; i < data.length; i++) {
		        var singleData = data[i];
		        mappedInstances.push(mapSingleInstance(readModel, singleData));
		    }
		    return mappedInstances;
		};

		this.mapDataToReadModel = function(readModel, data) {
			if(Bifrost.isArray(data)){
				return mapMultipleInstances(readModel, data);
			} else {
				return mapSingleInstance(readModel, data);
			}
		};
	})
});
Bifrost.namespace("Bifrost.read", {
    PagingInfo: Bifrost.Type.extend(function (size, number) {
        var self = this;

        this.size = size;
        this.number = number;
    })
});
Bifrost.namespace("Bifrost.read", {
    Queryable: Bifrost.Type.extend(function (query, queryService, region, targetObservable) {
        var self = this;

        this.canExecute = true;

        this.target = targetObservable;
        this.query = query;
        this.queryService = queryService;
        this.pageSize = ko.observable(0);
        this.pageNumber = ko.observable(0);
        this.totalItems = ko.observable(0);
        this.completedCallbacks = [];

        this.pageSize.subscribe(function () {
            if (self.canExecute) {
                self.execute();
            }
        });

        this.pageNumber.subscribe(function () {
            if (self.canExecute) {
                self.execute();
            }
        });

        function observePropertiesFrom(query) {
            for (var property in query) {
                if (ko.isObservable(query[property]) == true && query.hasOwnProperty(property) && property != "areAllParametersSet" ) {
                    query[property].subscribe(function () {
                        self.execute();
                    });
                }
            }
        }
        


        this.completed = function (callback) {
            self.completedCallbacks.push(callback);
            return self;
        };

        this.onCompleted = function (data) {
            self.completedCallbacks.forEach(function (callback) {
                callback(data);
            });
        };

        this.execute = function () {
            if (self.query.areAllParametersSet() !== true) {
                // TODO: Diagnostics - warning
                return self.target;
            }
            self.query._previousAreAllParametersSet = true;

            var paging = Bifrost.read.PagingInfo.create({
                size: self.pageSize(),
                number: self.pageNumber()
            });
            self.queryService.execute(query, paging).continueWith(function (result) {
                self.totalItems(result.totalItems);
                self.target(result.items);
                self.onCompleted(result.items);
            });

            return self.target;
        };

        this.setPageInfo = function (pageSize, pageNumber) {
            self.canExecute = false;
            self.pageSize(pageSize);
            self.pageNumber(pageNumber);
            self.canExecute = true;
            self.execute();
        };


        observePropertiesFrom(query);
        if (typeof self.query.areAllParametersSet.subscribe == "function") {

            self.query.areAllParametersSet.subscribe(function (isSet) {
                var shouldConsiderExecuting = true;
                if (!Bifrost.isNullOrUndefined(self.query._previousAreAllParametersSet)) {
                    if (self.query._previousAreAllParametersSet == isSet) {
                        shouldConsiderExecuting = false;
                    }
                }
                if (shouldConsiderExecuting == true) {
                    if (isSet === true) self.execute();
                }
            });
        }
    })
});
Bifrost.read.Queryable.new = function (options, region) {
    var observable = ko.observableArray();
    options.targetObservable = observable;
    options.region = region;
    var queryable = Bifrost.read.Queryable.create(options);
    Bifrost.extend(observable, queryable);
    observable.isQueryable = true;
    return observable;
};


Bifrost.namespace("Bifrost.read", {
    queryableFactory: Bifrost.Singleton(function () {
        this.create = function (query, region) {
            var queryable = Bifrost.read.Queryable.new({
                query: query
            }, region);
            return queryable;
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.queryableFactory = Bifrost.interaction.queryableFactory;
Bifrost.namespace("Bifrost.read", {
    Query: Bifrost.Type.extend(function (queryableFactory, region) {
        var self = this;
        this.name = "";
        this.target = this;
        this.generatedFrom = "";
        this.readModel = null;
        this.region = region;

        this.areAllParametersSet = null;

        this.hasReadModel = function () {
            return typeof self.target.readModel != "undefined" && self.target.readModel != null;
        };

        this.setParameters = function (parameters) {
            try {
                for (var property in parameters) {
                    if (self.target.hasOwnProperty(property) && ko.isObservable(self.target[property]) == true) {
                        self.target[property](parameters[property]);
                    }
                }
            } catch(ex) {}
        };

        this.getParameters = function () {
            var parameters = {};

            for (var property in self.target) {
                if (ko.isObservable(self.target[property]) &&
                    property != "areAllParametersSet") {
                    parameters[property] = self.target[property];
                }
            }

            return parameters;
        };

        this.getParameterValues = function () {
            var parameterValues = {};

            var parameters = self.getParameters();
            for (var property in parameters) {
                value = parameters[property]();
                if (ko.isObservable(value)) {
                    value = value();
                }
                parameterValues[property] = value;
            }

            return parameterValues;
        };

        this.all = function () {
            var queryable = queryableFactory.create(self.target, region);
            return queryable;
        };

        this.paged = function (pageSize, pageNumber) {
            var queryable = queryableFactory.create(self.target, region);
            queryable.setPageInfo(pageSize, pageNumber);
            return queryable;
        };

        this.onCreated = function (query) {
            self.target = query;

            for (var property in self.target) {
                if (ko.isObservable(self.target[property]) == true) {
                    self.target[property].extend({ linked: {} });
                }
            }

            self.areAllParametersSet = ko.computed(function () {
                var isSet = true;
                var hasParameters = false;
                for (var property in self.target) {
                    if (ko.isObservable(self.target[property]) == true) {
                        hasParameters = true;
                        var value = self.target[property]();
                        if (typeof value == "undefined" || value === null) {
                            isSet = false;
                            break;
                        }
                    }
                }
                if (hasParameters == false) return true;
                return isSet;
            });
        };
    })
});
Bifrost.namespace("Bifrost.read", {
    ReadModel: Bifrost.Type.extend(function () {
        var self = this;
        var actualReadModel = this;


        this.copyTo = function (target) {
            for (var property in actualReadModel) {
                if (actualReadModel.hasOwnProperty(property) && property.indexOf("_") != 0) {
                    var value = ko.utils.unwrapObservable(actualReadModel[property]);
                    if (!target.hasOwnProperty(property)) {
                        target[property] = ko.observable(value);
                    } else {
                        if (ko.isObservable(target[property])) {
                            target[property](value);
                        } else {
                            target[property] = value;
                        }
                    }
                }
            }
        };

        this.onCreated = function (lastDescendant) {
            actualReadModel = lastDescendant;
        };
    })
});
Bifrost.namespace("Bifrost.read", {
    ReadModelOf: Bifrost.Type.extend(function (region, readModelMapper, taskFactory, readModelSystemEvents) {
	    var self = this;
	    this.name = "";
	    this.generatedFrom = "";
	    this.target = null;
	    this.readModelType = Bifrost.Type.extend(function () { });
	    this.instance = ko.observable();
	    this.commandToPopulate = null;
	    this.region = region;

	    function unwrapPropertyFilters(propertyFilters) {
	        var unwrappedPropertyFilters = {};
	        for (var property in propertyFilters) {
	            unwrappedPropertyFilters[property] = ko.utils.unwrapObservable(propertyFilters[property]);
	        }
	        return unwrappedPropertyFilters;
	    }

	    function performLoad(target, propertyFilters) {
	        var task = taskFactory.createReadModel(target, propertyFilters);
	        target.region.tasks.execute(task).continueWith(function (data) {
	            if (!Bifrost.isNullOrUndefined(data)) {
	                var mappedReadModel = readModelMapper.mapDataToReadModel(target.readModelType, data);
	                self.instance(mappedReadModel);
	            } else {
	                readModelSystemEvents.noInstance.trigger(target);
	            }
	        });
	    }

	    this.instanceMatching = function (propertyFilters) {
	        var unwrappedPropertyFilters = unwrapPropertyFilters(propertyFilters);
	        performLoad(self.target, unwrappedPropertyFilters);

	        for (var property in propertyFilters) {
	            var value = propertyFilters[property];
	            if (ko.isObservable(value)) {
	                value.subscribe(function () {
	                    var unwrappedPropertyFilters = unwrapPropertyFilters(propertyFilters);
	                    performLoad(self.target, unwrappedPropertyFilters);
	                })
	            }
	        }
		};

		this.populateCommandOnChanges = function (command) {
		    command.populatedExternally();

		    if (typeof self.instance() != "undefined" && self.instance() != null) {
		        command.populateFromExternalSource(self.instance());
		    }

		    self.instance.subscribe(function (newValue) {
		        command.populateFromExternalSource(newValue);
		    });
		};

		this.onCreated = function (lastDescendant) {
		    self.target = lastDescendant;
		};
	})
});
Bifrost.namespace("Bifrost.read", {
    ReadModelTask: Bifrost.tasks.LoadTask.extend(function (readModelOf, propertyFilters, taskFactory) {
        var url = "/Bifrost/ReadModel/InstanceMatching?_rm=" + readModelOf.generatedFrom;
        var payload = {
            descriptor: {
                readModel: readModelOf.name,
                generatedFrom: readModelOf.generatedFrom,
                propertyFilters: propertyFilters
            }
        };

        this.readModel = readModelOf.generatedFrom;

        var innerTask = taskFactory.createHttpPost(url, payload);

        this.execute = function () {
            var promise = innerTask.execute();
            return promise;
        };
    })
});
Bifrost.dependencyResolvers.readModelOf = {
    canResolve: function (namespace, name) {
        if (typeof read !== "undefined") {
            return name in read;
        }
        return false;
    },

    resolve: function (namespace, name) {
        return read[name].create();
    }
};
Bifrost.dependencyResolvers.query = {
    canResolve: function (namespace, name) {
        if (typeof read !== "undefined") {
            return name in read;
        }
        return false;
    },

    resolve: function (namespace, name) {
        return read[name].create();
    }
};
Bifrost.namespace("Bifrost.read", {
    QueryTask: Bifrost.tasks.LoadTask.extend(function (query, paging, taskFactory) {
        var url = "/Bifrost/Query/Execute?_q=" + query.generatedFrom;
        var payload = {
            descriptor: {
                nameOfQuery: query.name,
                generatedFrom: query.generatedFrom,
                parameters: query.getParameterValues()
            },
            paging: {
                size: paging.size,
                number: paging.number
            }
        };

        this.query = query.name;
        this.paging = payload.paging;

        var innerTask = taskFactory.createHttpPost(url, payload);

        this.execute = function () {
            var promise = innerTask.execute();
            return promise;
        };
    })
});
Bifrost.namespace("Bifrost.read", {
    queryService: Bifrost.Singleton(function (readModelMapper, taskFactory) {
        var self = this;

        this.execute = function (query, paging) {
            var promise = Bifrost.execution.Promise.create();
            var region = query.region;

            var task = taskFactory.createQuery(query, paging);
            region.tasks.execute(task).continueWith(function (result) {
                if (typeof result == "undefined" || result == null) {
                    result = {};
                }
                if (typeof result.items == "undefined" || result.items == null) result.items = [];
                if (typeof result.totalItems == "undefined" || result.totalItems == null) result.totalItems = 0;

                if (query.hasReadModel()) {
                    result.items = readModelMapper.mapDataToReadModel(query.readModel, result.items);
                }
                promise.signal(result);
            });

            return promise;
        };
    })
});
Bifrost.namespace("Bifrost.sagas");
Bifrost.sagas.Saga = (function () {
    function Saga() {
        var self = this;

        this.executeCommands = function (commands, options) {

            var canExecuteSaga = true;
            
            commands.forEach(function (command) {
                if (command.onBeforeExecute() === false) {
                    canExecuteSaga = false;
                    return false;
                }
            });

            if (canExecuteSaga === false) {
                return;
            }
            Bifrost.commands.commandCoordinator.handleForSaga(self, commands, options);
        }
    }

    return {
        create: function (configuration) {
            var saga = new Saga();
            Bifrost.extend(saga, configuration);
            return saga;
        }
    }
})();
Bifrost.namespace("Bifrost.sagas");
Bifrost.sagas.sagaNarrator = (function () {
    var baseUrl = "/Bifrost/SagaNarrator";
    // Todo : abstract away into general Service code - look at CommandCoordinator.js for the other copy of this!s
    function post(url, data, completeHandler) {
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: data,
            contentType: 'application/json; charset=utf-8',
            complete: completeHandler
        });
    }

    function isRequestSuccess(jqXHR, commandResult) {
        if (jqXHR.status === 200) {
            if (commandResult.success === true) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
        return true;
    }

    return {
        conclude: function (saga, success, error) {
            var methodParameters = {
                sagaId: saga.Id
            };
            post(baseUrl + "/Conclude", JSON.stringify(methodParameters), function (jqXHR) {
                var commandResult = Bifrost.commands.CommandResult.createFrom(jqXHR.responseText);
                var isSuccess = isRequestSuccess(jqXHR, commandResult);
                if (isSuccess == true && typeof success === "function") {
                    success(saga);
                }
                if (isSuccess == false && typeof error === "function") {
                    error(saga);
                }
            });
        }
    }
})();
Bifrost.namespace("Bifrost.messaging", {
    Messenger: Bifrost.Type.extend(function () {
        var subscribers = [];

        this.publish = function (topic, message) {
            if (subscribers.hasOwnProperty(topic)) {
                subscribers[topic].subscribers.forEach(function (item) {
                    item(message);
                });
            }
        };

        this.subscribeTo = function (topic, subscriber) {
            var subscribersByTopic;

            if (subscribers.hasOwnProperty(topic)) {
                subscribersByTopic = subscribers[topic];
            } else {
                subscribersByTopic = { subscribers: [] };
                subscribers[topic] = subscribersByTopic;
            }

            subscribersByTopic.subscribers.push(subscriber);
        };

        return {
            publish: this.publish,
            subscribeTo: this.subscribeTo
        };
    })
});
Bifrost.messaging.Messenger.global = Bifrost.messaging.Messenger.create();
Bifrost.WellKnownTypesDependencyResolver.types.globalMessenger = Bifrost.messaging.Messenger.global;
Bifrost.namespace("Bifrost.messaging", {
    messengerFactory: Bifrost.Singleton(function () {
        this.create = function () {
            var messenger = Bifrost.messaging.Messenger.create();
            return messenger;
        };

        this.global = function () {
            return Bifrost.messaging.Messenger.global;
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.messengerFactory = Bifrost.messaging.messengerFactory;
if (typeof ko !== 'undefined') {
    ko.observableMessage = function (message, defaultValue) {
        var observable = ko.observable(defaultValue);

        var internal = false;
        observable.subscribe(function (newValue) {
            if (internal == true) return;
            Bifrost.messaging.Messenger.global.publish(message, newValue);
        });

        Bifrost.messaging.Messenger.global.subscribeTo(message, function (value) {
            internal = true;
            observable(value);
            internal = false;
        });
        return observable;
    }
}
Bifrost.namespace("Bifrost.services", {
    Service: Bifrost.Type.extend(function () {
        var self = this;

        this.url = "";
        this.name = "";

        function prepareArguments(args) {
            var prepared = {};

            for (var property in args) {
                prepared[property] = JSON.stringify(args[property]);
            }

            var stringified = JSON.stringify(prepared);
            return stringified;
        }

        function call(method, args, callback) {
            $.ajax({
                url: self.url + "/" + method,
                type: 'POST',
                dataType: 'json',
                data: prepareArguments(args),
                contentType: 'application/json; charset=utf-8',
                complete: function (result) {
                    var v = $.parseJSON(result.responseText);
                    callback(v);
                }
            });
        }


        this.callWithoutReturnValue = function (method, args) {
            var promise = Bifrost.execution.Promise.create();
            call(method, args, function (v) {
                promise.signal();
            });
            return promise;
        };

        this.callWithObjectAsReturn = function (method, args) {
            var value = ko.observable();
            call(method, args, function (v) {
                value(v);
            });
            return value;
        };

        this.callWithArrayAsReturn = function (method, args) {
            var value = ko.observableArray();
            call(method, args, function (v) {
                value(v);
            });
            return value;
        };

        this.onCreated = function (lastDescendant) {
            self.url = lastDescendant.url;
            if (self.url.indexOf("/") != 0) self.url = "/" + self.url;

            self.name = lastDescendant.name;
        };
    })
});
Bifrost.dependencyResolvers.service = {
    canResolve: function (namespace, name) {
        if (typeof services !== "undefined") {
            return name in services;
        }
        return false;
    },

    resolve: function (namespace, name) {
        return services[name].create();
    }
};
Bifrost.namespace("Bifrost", {
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
Bifrost.namespace("Bifrost.views", {
	ElementVisitor: Bifrost.Type.extend(function() {
		this.visit = function(element, resultActions) {

		}
	})
});
Bifrost.namespace("Bifrost.views", {
	ElementVisitorResultActions: Bifrost.Type.extend(function() {
	
	})
});
Bifrost.namespace("Bifrost.views", {
	UIManager: Bifrost.Singleton(function(documentService) {
		var visitors = [];
		var visitorTypes = Bifrost.views.ElementVisitor.getExtenders();

		visitorTypes.forEach(function(type) {
			visitors.push(type.create());
		})

		this.handle = function (root) {
			documentService.traverseObjects(function(element) {
				visitors.forEach(function(visitor) {
					var actions = Bifrost.views.ElementVisitorResultActions.create();
					visitor.visit(element, actions);
				});
			}, root);
		};
	})
});
Bifrost.namespace("Bifrost.views", {
	NamingRoot: Bifrost.Type.extend(function() {
		var self = this;
		this.target = null;

		this.find = function(name, element) {
			if( Bifrost.isNullOrUndefined(element) ) {
				if( Bifrost.isNullOrUndefined(self.target) ) return null;
				element = self.target;
			}


			if( element.getAttribute("name") === name ) {
				return element;
			}

			if( element.hasChildNodes() ) {
				var child = element.firstChild;
				while( child ) {
					if( child.nodeType === 1 ) {
						var foundElement = self.find(name, child);
						if( foundElement != null ) { 
							return foundElement;
						}
					}
					child = child.nextSibling;
				}
			}

			return null;
		}
	})
});
Bifrost.namespace("Bifrost.views", {
	NamingRootElementVisitor: Bifrost.views.ElementVisitor.extend(function() {
		this.visit = function(element, actions) {
			var namingRoot = Bifrost.views.NamingRoot.create();
			namingRoot.target = element;
			element.namingRoot = namingRoot;
		};
	})
});
Bifrost.namespace("Bifrost.views", {
	objectModelManager: Bifrost.Singleton(function() {
		var self = this;
		this.globalNamespacePrefix = "__global";

		this.prefixNamespaceArrayDictionary = {};

		this.registerNamespace = function(prefix, namespace) {
			var ns = Bifrost.namespace(namespace);
			var array;

			if( self.prefixNamespaceArrayDictionary.hasOwnProperty(prefix) ) {
				array = self.prefixNamespaceArrayDictionary[prefix];
			} else {
				array = [];
				self.prefixNamespaceArrayDictionary[prefix] = array;
			}

			self.prefixNamespaceDictionary[prefix] = namespace;
		};


		this.getObjectFromTagName =  function(name, namespace) {
			var hasNamespace = true;
			if( Bifrost.isNullOrUndefined(namespace) ) {
				namespace = self.globalNamespacePrefix;
				hasNamespace = false;
			}
			namespace = namespace.toLowerCase();
			name = name.toLowerCase();

			var foundType = null;

			if( self.prefixNamespaceArrayDictionary.hasOwnProperty(namespace) ) {
				self.prefixNamespaceArrayDictionary[namespace].forEach(function(ns) {
					for( var type in ns ) {
						type = type.toLowerCase();
						if( type == name ) {
							foundType = type;
							return;
						}
					}
				})
			}

			if( foundType == null ) {
				var namespaceMessage = "";
				if( hasNamespace == true ) {
					namespaceMessage = " in namespace prefixed '"+namespace+"'";
				}
				throw "Could not resolve type '"+name+"'"+namespaceMessage;
			}

			return foundType;
		};
	})
});
Bifrost.namespace("Bifrost.views", {
	ObjectModelElementVisitor: Bifrost.views.ElementVisitor.extend(function(objectModelManager, markupExtensions, typeConverters) {
		this.visit = function(element, actions) {
			// Tags : 
			//  - tag names automatically match type names
			//  - due to tag names in HTML elements being without case - they become lower case in the
			//    localname property, we will have to search for type by lowercase
			//  - multiple types found with different casing in same namespace should throw an exception
			// Namespaces :
			//  - split by ':'
			//  - if more than one ':' - throw an exception
			//  - if no namespace is defined, try to resolve in the global namespace
			//  - namespaces in the object model can point to multiple JavaScript namespaces
			//  - multiple types with same name in namespace groupings should throw an exception
			// Properties : 
			//  - Attributes on an element is a property
			//  - Values in property should always go through type conversion sub system
			//  - Values with encapsulated in {} should be considered markup extensions, go through 
			//    markup extension system for resolving them and then pass on the resulting value 
			//    to type conversion sub system
			//  - Properties can be set with tag suffixed with .<name of property> - more than one
			//    '.' in a tag name should throw an exception
			// Child tags :
			//  - Children which are not a property reference are only allowed if a content or
			//    items property exist. There can only be one of the other, two of either or both
			//    at the same time should yield an exception
			//
			// Example : 
			// Simple control:
			// <somecontrol property="42"/>
			// 
			// Control in different namespace:
			// <ns:somecontrol property="42"/>
			//
			// Assigning property with tags:
			// <ns:somecontrol>
			//    <ns:somecontrol.property>42</ns:somcontrol.property>
			// </ns:somecontrol>
			// 

			if( !(element instanceof HTMLUnknownElement) ) return;

			var namespace;
			var name = element.localName.toLowerCase();

			var namespaceSplit = name.split(":");
			if( namespaceSplit.length > 2 ) {
				throw "Syntax error: tagname '"+name+"' has multiple namespaces";
			}
 			if( namespaceSplit.length == 2 ) {
				name = namespaceSplit[1];
				namespace = namespaceSplit[0];
			}

			var instance = objectModelManager.getObjectFromTagName(name,namespace);
			element.__objectModelNode = instance;

			var propertySplit = element.localName.split(".");
			if( propertySplit.length > 2 ) {
				throw "Syntax error: tagname '"+name+"' has multiple properties its referring to";
			}

			if( propertySplit.length == 2 ) {
				if( !Bifrost.isNullOrUndefined(element.parentElement) ) {
					var parentName = element.parentElement.localName.toLowerCase();

					if( parentName !== propertySplit[0] ) {
						throw "Setting property using tag '"+name+"' does not match parent tag of '"+parentName+"'";
					}
				}
			}

			if( !Bifrost.isNullOrUndefined(element.parentElement) ) {
				var propertySplit = element.parentElement.localName.split(".");
				if( propertySplit.length == 2 ) {
					var propertyName = propertySplit[1];
					if( !Bifrost.isNullOrUndefined(element.parentElement.__objectModelNode) ) {
						if( ko.isObservable(element.parentElement.__objectModelNode[propertyName]) ) {
							element.parentElement.__objectModelNode[propertyName](instance);
						} else {
							element.parentElement.__objectModelNode[propertyName] = instance;
						}
					}
				}
			}

			for( var attributeIndex=0; attributeIndex<element.attributes.length; attributeIndex++ ) {
				var name = element.attributes[attributeIndex].localName;
				var value = element.attributes[attributeIndex].value;

				if( name in instance ) {
					var targetValue = instance[name];
					var targetType = typeof targetValue;
					if( ko.isObservable(targetValue)) {
						targetType = typeof targetValue();
					}
					var convertedValue = typeConverters.convert(targetType, value);
					if( ko.isObservable(targetValue)) {
						targetValue(convertedValue);
					} else {
						instance[name] = convertedValue;
					}
				}
			}
		};
	})
});
Bifrost.namespace("Bifrost.views", {
	Content: Bifrost.Type.extend(function() {
		
	})
})
Bifrost.namespace("Bifrost.views", {
	Items: Bifrost.Type.extend(function() {
		
	})
})
Bifrost.namespace("Bifrost.views", {
	MarkupExtension: Bifrost.Type.extend(function() {
		
	})
})
Bifrost.namespace("Bifrost.views", {
	markupExtensions: Bifrost.Type.extend(function() {
		
	})
})
Bifrost.namespace("Bifrost.views", {
	Binding: Bifrost.views.MarkupExtension.extend(function() {
		
	})
})
Bifrost.namespace("Bifrost.views", {
	TypeConverter: Bifrost.Type.extend(function() {
		this.supportedType = null;
		this.convert = function(value) {
			return value;
		};
	})
})
Bifrost.namespace("Bifrost.views", {
	typeConverters: Bifrost.Type.extend(function() {
		
	})
})
Bifrost.namespace("Bifrost.views", {
	UIElement: Bifrost.views.NamingRoot.extend(function() {

	})
});
Bifrost.namespace("Bifrost.views", {
	Control: Bifrost.views.UIElement.extend(function() {

	})
});
Bifrost.namespace("Bifrost.views", {
    ComposeTask: Bifrost.tasks.Task.extend(function () {
        /// <summary>Represents a base task that represents anything that is executing</summary>
        this.execute = function () {
        }
    })
});
Bifrost.namespace("Bifrost.views", {
    View: Bifrost.Type.extend(function (viewLoader, path) {
        var self = this;
        this.viewLoader = viewLoader;

        this.path = path;
        this.content = "[CONTENT NOT LOADED]";
        this.element = null;


        this.load = function () {
            var promise = Bifrost.execution.Promise.create();
            self.viewLoader.load(self.path).continueWith(function (html) {
                self.content = html;
                promise.signal(self);
            });

            return promise;
        };
    })
});
Bifrost.namespace("Bifrost.views", {
    ViewRenderer: Bifrost.Type.extend(function () {
        this.canRender = function (element) {
            return false;
        };

        this.render = function (element) {
        };
	})
});
Bifrost.namespace("Bifrost.views", {
	viewRenderers: Bifrost.Singleton(function() {
		var self = this;

		function getRenderers() {
			var renderers = [];
			for( var property in Bifrost.views.viewRenderers ) {
				if( Bifrost.views.viewRenderers.hasOwnProperty(property)) {
					var value = Bifrost.views.viewRenderers[property];
					if( typeof value == "function" && 
						typeof value.create == "function")  {
						var renderer = value.create();
						if( typeof renderer.canRender == "function") renderers.push(renderer);
					}
				}
			}
			return renderers;
		}

		this.canRender = function(element) {
		    var renderers = getRenderers();
		    for (var rendererIndex = 0; rendererIndex < renderers.length; rendererIndex++) {
		        var renderer = renderers[rendererIndex];
		        var result = renderer.canRender(element);
				if( result == true ) return true;
			}

			return false;
		};

		this.render = function(element) {
		    var renderers = getRenderers();
		    for (var rendererIndex = 0; rendererIndex < renderers.length; rendererIndex++) {
		        var renderer = renderers[rendererIndex];
		        if (renderer.canRender(element)) return renderer.render(element);
			}

			return null;
		};

	})
});
Bifrost.namespace("Bifrost.views", {
	DataAttributeViewRenderer : Bifrost.views.ViewRenderer.extend(function(viewFactory, pathResolvers, viewModelManager) {
	    var self = this;

	    this.viewFactory = viewFactory;
	    this.pathResolvers = pathResolvers;
	    this.viewModelManager = viewModelManager;

		this.canRender = function(element) {
		    return typeof $(element).data("view") !== "undefined";
		};

		this.render = function (element) {
		    var promise = Bifrost.execution.Promise.create();
		    var path = $(element).data("view");

		    if (self.pathResolvers.canResolve(element, path)) {
		        var actualPath = self.pathResolvers.resolve(element, path);
		        var view = self.viewFactory.createFrom(actualPath);
		        element.view = view;

		        view.element = element;
		        view.load().continueWith(function (targetView) {
		            $(element).empty();
		            $(element).append(targetView.content);

		            if (self.viewModelManager.hasForView(actualPath)) {
		                var viewModelFile = Bifrost.Path.changeExtension(actualPath, "js");
		                $(element).attr("data-viewmodel-file", viewModelFile);
		                $(element).data("viewmodel-file", viewModelFile);
		            }

		            promise.signal(targetView);
		        });
		    } else {
                // Todo: throw an exception at this point! - Or something like 404.. 
		        promise.signal(null);
		    }

		    return promise;
		};
	})
});
if (typeof Bifrost.views.viewRenderers != "undefined") {
	Bifrost.views.viewRenderers.DataAttributeViewRenderer = Bifrost.views.DataAttributeViewRenderer;
}

Bifrost.namespace("Bifrost.views", {
    viewFactory: Bifrost.Singleton(function () {
        var self = this;

        this.createFrom = function (path) {
            var view = Bifrost.views.View.create({
                path: path
            });
            return view;
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.viewFactory = Bifrost.views.viewFactory;
Bifrost.namespace("Bifrost.views", {
    ViewLoadTask: Bifrost.views.ComposeTask.extend(function (files, fileManager) {
        /// <summary>Represents a task for loading files asynchronously</summary>

        var self = this;

        this.files = [];
        files.forEach(function (file) {
            self.files.push(file.path.fullPath);
        });

        this.execute = function () {
            var promise = Bifrost.execution.Promise.create();

            fileManager.load(files).continueWith(function (instances) {
                var view = instances[0];
                promise.signal(view);
            });
            return promise;
        }
    })
});
Bifrost.namespace("Bifrost.views", {
    viewLoader: Bifrost.Singleton(function (viewModelManager, taskFactory, fileFactory, regionManager) {
        this.load = function (path) {
            var promise = Bifrost.execution.Promise.create();

            var files = [];

            var viewFile = fileFactory.create(path, Bifrost.io.fileType.html);
            if (path.indexOf("?") > 0) {
                viewFile.path.fullPath = viewFile.path.fullPath + path.substr(path.indexOf("?"));
            }
            files.push(viewFile);

            if (viewModelManager.hasForView(path)) {
                var viewModelPath = viewModelManager.getViewModelPathForView(path);
                if (!viewModelManager.isLoaded(viewModelPath)) {
                    var viewModelFile = fileFactory.create(viewModelPath, Bifrost.io.fileType.javaScript);
                    files.push(viewModelFile);
                }
            }

            var task = taskFactory.createViewLoad(files);
            regionManager.getCurrent().tasks.execute(task).continueWith(function (view) {
                promise.signal(view);
            });

            return promise;
        };
    })
});
Bifrost.namespace("Bifrost.views", {
    ViewRenderTask: Bifrost.views.ComposeTask.extend(function (element, viewRenderers, viewModelManager, UIManager) {
        /// <summary>Represents a task for rendering views asynchronously</summary>

        var self = this;
        function render(element) {
            var promise = Bifrost.execution.Promise.create();
            if (viewRenderers.canRender(element)) {
                viewRenderers.render(element).continueWith(function () {
                    var view = element.view;
                    var newElement = view.element;
                    newElement.view = view;

                    viewModelManager.applyToViewIfAny(view).continueWith(function () {
                        if (element.hasChildNodes() == true) {
                            renderChildren(newElement).continueWith(function () {
                                promise.signal();
                            });
                        } else {
                            promise.signal();
                        }
                        UIManager.handle(newElement);
                    });
                });
            } else {
                renderChildren(element).continueWith(function () {
                    promise.signal();
                });
            }
            return promise;
        }

        function renderChildren(element) {
            var promise = Bifrost.execution.Promise.create();
            if (element.hasChildNodes() == true) {
                for (var child = element.firstChild; child; child = child.nextSibling) {
                    
                    render(child).continueWith(function () {
                        promise.signal();
                    });
                }
            } else {
                promise.signal();
            }
            return promise;
        }

        

        this.execute = function () {
            var promise = Bifrost.execution.Promise.create();

            render(element).continueWith(function () {
                promise.signal();
            });

            return promise;
        }
    })
});
Bifrost.namespace("Bifrost.views", {
    viewManager: Bifrost.Singleton(function (viewFactory, pathResolvers,regionManager, UIManager, taskFactory, viewRenderers, viewModelManager, documentService) {
        var self = this;
        
        this.viewRenderers = viewRenderers;
        this.viewModelManager = viewModelManager;

        this.viewFactory = viewFactory;
        this.pathResolvers = pathResolvers;

        /*
        function renderChildren(element) {
            if(element.hasChildNodes() == true) {
                for (var child = element.firstChild; child; child = child.nextSibling) {
                    self.render(child);
                }
            }
        }*/

        this.initializeLandingPage = function () {
            var body = $("body")[0];
            if (body !== null) {
                var file = Bifrost.Path.getFilenameWithoutExtension(document.location.toString());
                if (file == "") file = "index";
                $(body).data("view", file);

                if (self.pathResolvers.canResolve(body, file)) {
                    var actualPath = self.pathResolvers.resolve(body, file);
                    var view = self.viewFactory.createFrom(actualPath);
                    view.element = body;
                    view.content = body.innerHTML;
                    body.view = view;

                    // Todo: this one destroys the bubbling of click event to the body tag..  Weird.. Need to investigate more (see GitHub issue 233 : https://github.com/dolittle/Bifrost/issues/233)
                    //self.viewModelManager.applyToViewIfAny(view);

                    regionManager.getFor(view).continueWith(function (region) {
                        Bifrost.views.Region.current = region;
                        documentService.traverseObjects(function (element) {
                            self.render(element);
                        });

                        //renderChildren(body);
                        UIManager.handle(body);
                    });
                }
            }
        };

        this.render = function (element) {
            var promise = Bifrost.execution.Promise.create();

            if (viewRenderers.canRender(element)) {
                var task = taskFactory.createViewRender(element);
                regionManager.getCurrent().tasks.execute(task).continueWith(function () {
                    promise.signal();
                });
            }
            
            return promise;
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.viewManager = Bifrost.views.viewManager;
Bifrost.namespace("Bifrost.views", {
    ViewModel: Bifrost.Type.extend(function (region) {
        var self = this;
        this.targetViewModel = this;
        this.region = region;

        this.activated = function () {
            if (typeof self.targetViewModel.onActivated === "function") {
                self.targetViewModel.onActivated();
            }
        };

        this.onCreated = function (lastDescendant) {
            self.targetViewModel = lastDescendant;
        };
    })
});
Bifrost.namespace("Bifrost.views", {
    viewModelLoader: Bifrost.Singleton(function (taskFactory, fileFactory) {
        var self = this;

        this.load = function (path) {
            var promise = Bifrost.execution.Promise.create();
            var file = fileFactory.create(path, Bifrost.io.fileType.javaScript);
            var task = taskFactory.createViewModelLoad([file]);
            Bifrost.views.Region.current.tasks.execute(task).continueWith(function () {
                self.beginCreateInstanceOfViewModel(path).continueWith(function (instance) {
                    promise.signal(instance);
                });
            });
            return promise;
        };

        this.beginCreateInstanceOfViewModel = function (path, instanceHash) {
            var localPath = Bifrost.Path.getPathWithoutFilename(path);
            var filename = Bifrost.Path.getFilenameWithoutExtension(path);

            var promise = Bifrost.execution.Promise.create();

            var namespacePath = Bifrost.namespaceMappers.mapPathToNamespace(localPath);
            if (namespacePath != null) {
                var namespace = Bifrost.namespace(namespacePath);

                if (filename in namespace) {
                    namespace[filename]
                        .beginCreate(instanceHash)
                            .continueWith(function (instance) {
                                promise.signal(instance);
                            }).onFail(function (error) {
                                console.log("ViewModel '"+filename+"' failed instantiation");
                                throw error;
                            });
                }
            }

            return promise;
        };
    })
});
Bifrost.namespace("Bifrost.views", {
    ViewModelLoadTask: Bifrost.views.ComposeTask.extend(function (files, fileManager) {
        /// <summary>Represents a task for loading viewModels</summary>
        var self = this;

        this.files = [];
        files.forEach(function (file) {
            self.files.push(file.path.fullPath);
        });

        this.execute = function () {
            var promise = Bifrost.execution.Promise.create();

            fileManager.load(files).continueWith(function (instances) {
                promise.signal(instances);
            });
            return promise;
        };
    })
});
Bifrost.namespace("Bifrost.views", {
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
Bifrost.namespace("Bifrost.views", {
    ViewModelsApplierTask: Bifrost.views.ComposeTask.extend(function (root, masterViewModel, viewModelLoader, documentService, regionManager) {
        /// <summary>Represents a task for applying view models</summary>
        var self = this;

        function setViewModelBindingExpression(instance, target) {
            var viewModelFile = documentService.getViewModelFileFrom(target);
            documentService.setViewModelOn(target, instance);

            if (viewModelFile.indexOf(".") > 0) {
                viewModelFile = viewModelFile.substr(0, viewModelFile.indexOf("."));
            }

            var propertyName = viewModelFile.replaceAll("/", "");
            masterViewModel[propertyName] = ko.observable(instance);

            $(target).attr("data-bind", "viewModel: $data." + propertyName);

            if (typeof instance.activated == "function") {
                instance.activated();
            }
        }


        this.execute = function () {
            var promise = Bifrost.execution.Promise.create();

            var elements = documentService.getAllElementsWithViewModelFilesFrom(root);
            var loadedViewModels = 0;

            elements.forEach(function (element) {
                var viewModelFile = documentService.getViewModelFileFrom(element);
                var viewFile = documentService.getViewFileFrom(element);

                var view = Bifrost.views.View.create({
                    viewLoader: {
                        load: function () {
                            var promise = Bifrost.execution.Promise.create();
                            promise.signal(element.innerHTML);
                            return promise;
                        }
                    },
                    path: viewFile
                });
                view.element = element;
                view.content = element.innerHTML;

                regionManager.getFor(view).continueWith(function (region) {
                    viewModelLoader.load(viewModelFile, region).continueWith(function (instance) {
                        documentService.setViewModelOn(element, instance);

                        loadedViewModels++;

                        if (loadedViewModels == elements.length) {
                            elements.forEach(function (elementToApplyBindingsTo) {
                                var viewModel = documentService.getViewModelFrom(elementToApplyBindingsTo);
                                setViewModelBindingExpression(viewModel, elementToApplyBindingsTo);
                            });


                            if (!documentService.pageHasViewModel(masterViewModel)) {
                                ko.applyBindings(masterViewModel);
                            } else {
                                ko.applyBindings(instance, element);
                            }
                            promise.signal();
                        }
                    });
                });
            });

            return promise;
        }
    })
});
Bifrost.namespace("Bifrost.views", {
    viewModelManager: Bifrost.Singleton(function(assetsManager, documentService, viewModelLoader, regionManager, taskFactory) {
        var self = this;
        this.assetsManager = assetsManager;
        this.viewModelLoader = viewModelLoader;
        this.documentService = documentService;

        this.masterViewModel = {};

        this.hasForView = function (viewPath) {
            var scriptFile = Bifrost.Path.changeExtension(viewPath, "js");
            scriptFile = Bifrost.Path.makeRelative(scriptFile);
            var hasViewModel = self.assetsManager.hasScript(scriptFile);
            return hasViewModel;
        };

        this.getViewModelPathForView = function (viewPath) {
            var scriptFile = Bifrost.Path.changeExtension(viewPath, "js");
            return scriptFile;
        };

        this.applyToViewIfAny = function (view) {
            var promise = Bifrost.execution.Promise.create();
            var task = taskFactory.createViewModelApplier(view, self.masterViewModel);

            //var region = documentService.getRegionFor(view.element);
            var region = regionManager.getCurrent(); 
            region.tasks.execute(task).continueWith(function (instance) {
                promise.signal(instance);
            });

            return promise;
        };

        this.isLoaded = function (path) {
            var localPath = Bifrost.Path.getPathWithoutFilename(path);
            var filename = Bifrost.Path.getFilenameWithoutExtension(path);
            var namespacePath = Bifrost.namespaceMappers.mapPathToNamespace(localPath);
            if (namespacePath != null) {
                var namespace = Bifrost.namespace(namespacePath);

                if (filename in namespace) {
                    return true;
                }
            }
            return false;
        };

        this.loadAndApplyAllViewModelsWithinElement = function (root) {
            var task = taskFactory.createViewModelsApplier(root, self.masterViewModel);
            regionManager.getCurrent().tasks.execute(task).continueWith(function () {
                
            });
        };

        this.loadAndApplyAllViewModelsInDocument = function () {
            self.masterViewModel = {};
            self.loadAndApplyAllViewModelsWithinElement(self.documentService.DOMRoot);
        };
    })
});
Bifrost.namespace("Bifrost.views", {
    PathResolver: Bifrost.Type.extend(function () {
        this.canResolve = function (element, path) {
            return false;
        };

        this.resolve = function (element, path) {
            
        };
    })
});
Bifrost.namespace("Bifrost.views", {
    pathResolvers: Bifrost.Singleton(function () {

        function getResolvers() {
            var resolvers = [];
            for (var property in Bifrost.views.pathResolvers) {
                if (Bifrost.views.pathResolvers.hasOwnProperty(property)) {
                    var value = Bifrost.views.pathResolvers[property];
                    if( typeof value == "function" &&
                        typeof value.create == "function") {

                        var resolver = value.create();
                        if (typeof resolver.canResolve == "function") resolvers.push(resolver);
                    }
                }
            }
            return resolvers;
        }


        this.canResolve = function (element, path) {
            var resolvers = getResolvers();
            for (var resolverIndex = 0; resolverIndex < resolvers.length; resolverIndex++) {
                var resolver = resolvers[resolverIndex];
                var result = resolver.canResolve(element, path);
                if (result == true) return true;
            }
            return false;
        };

        this.resolve = function (element, path) {
            var resolvers = getResolvers();
            for (var resolverIndex = 0; resolverIndex < resolvers.length; resolverIndex++) {
                var resolver = resolvers[resolverIndex];
                if (resolver.canResolve(element, path)) return resolver.resolve(element, path);
            }
            return null;
        };
    })
});
Bifrost.namespace("Bifrost.views", {
    UriMapperPathResolver: Bifrost.views.PathResolver.extend(function () {
        this.canResolve = function (element, path) {
            var closest = $(element).closest("[data-urimapper]");
            if (closest.length == 1) {
                var mapperName = $(closest[0]).data("urimapper");
                if (Bifrost.uriMappers[mapperName].hasMappingFor(path) == true) return true;
            }
            return Bifrost.uriMappers.default.hasMappingFor(path);
        };

        this.resolve = function (element, path) {
            var closest = $(element).closest("[data-urimapper]");
            if (closest.length == 1) {
                var mapperName = $(closest[0]).data("urimapper");
                if (Bifrost.uriMappers[mapperName].hasMappingFor(path) == true) {
                    return Bifrost.uriMappers[mapperName].resolve(path);
                }
            }
            return Bifrost.uriMappers.default.resolve(path);
        };
    })
});
if (typeof Bifrost.views.pathResolvers != "undefined") {
    Bifrost.views.pathResolvers.UriMapperPathResolver = Bifrost.views.UriMapperPathResolver;
}
Bifrost.namespace("Bifrost.views", {
    RelativePathResolver: Bifrost.views.PathResolver.extend(function () {
        this.canResolve = function (element, path) {
            var closest = $(element).closest("[data-view]");
            if (closest.length == 1) {
                var view = $(closest[0]).view;
                
            }
            return false;
        };

        this.resolve = function (element, path) {
            var closest = $(element).closest("[data-urimapper]");
            if (closest.length == 1) {
                var mapperName = $(closest[0]).data("urimapper");
                if (Bifrost.uriMappers[mapperName].hasMappingFor(path) == true) {
                    return Bifrost.uriMappers[mapperName].resolve(path);
                }
            }
            return Bifrost.uriMappers.default.resolve(path);
        };
    })
});
if (typeof Bifrost.views.pathResolvers != "undefined") {
    Bifrost.views.pathResolvers.RelativePathResolver = Bifrost.views.RelativePathResolver;
}
Bifrost.namespace("Bifrost.views", {
    viewModelBindingHandler: Bifrost.Type.extend(function(viewManager, documentService) {
        var self = this;
        this.viewManager = viewManager;
        this.documentService = documentService;

        this.init = function (element, valueAccessor, allBindingAccessor, parentViewModel, bindingContext) {
            var viewModel = self.documentService.getViewModelFrom(element);
            var childBindingContext = bindingContext.createChildContext(viewModel);
            childBindingContext.$root = viewModel;
            ko.applyBindingsToDescendants(childBindingContext, element);
            return { controlsDescendantBindings: true };
        };
        this.update = function (element, valueAccessor, allBindingAccessor, parentViewModel, bindingContext) {
        };
    })
});
Bifrost.views.viewModelBindingHandler.initialize = function () {
    ko.bindingHandlers.viewModel = Bifrost.views.viewModelBindingHandler.create();
};

Bifrost.namespace("Bifrost.views", {
    viewBindingHandler: Bifrost.Type.extend(function (viewManager, viewRenderers, pathResolvers, viewFactory, viewModelManager, documentService) {
        var self = this;
        this.init = function (element, valueAccessor, allBindingAccessor, parentViewModel, bindingContext) {
        };
        this.update = function (element, valueAccessor, allBindingAccessor, parentViewModel, bindingContext) {
            var uri = ko.utils.unwrapObservable(valueAccessor());
            if (Bifrost.isNullOrUndefined(uri) || uri === "") {
                element.innerHTML = "";
            } else {
                var existingUri = documentService.getViewUriFrom(element);
                if (existingUri !== uri) {
                    documentService.setViewUriOn(element, uri);
                    viewManager.render(element).continueWith(function () {
                    });
                    
                }
            }
        };
    })
});
Bifrost.views.viewBindingHandler.initialize = function () {
    ko.bindingHandlers.view = Bifrost.views.viewBindingHandler.create();
};

Bifrost.namespace("Bifrost.views", {
    Region: function(messengerFactory, operationsFactory, tasksFactory) {
        /// <summary>Represents a region in the visual composition on a page</summary>
        var self = this;

        /// <field name="view" type="Bifrost.views.View">View for the composing</field>
        this.view = null;

        /// <field name="viewModel" type="Bifrost.views.ViewModel">The ViewModel associated with the view</field>
        this.viewModel = null;

        /// <field name="messenger" type="Bifrost.messaging.Messenger">The messenger for the region</field>
        this.messenger = messengerFactory.create();

        /// <field name="globalMessenger" type="Bifrost.messaging.Messenger">The global messenger</field>
        this.globalMessenger = messengerFactory.global();

        /// <field name="operations" type="Bifrost.interaction.Operations">Operations for the region</field>
        this.operations = operationsFactory.create();

        /// <field name="tasks" type="Bifrost.tasks.Tasks">Tasks for the region</field>
        this.tasks = tasksFactory.create();

        /// <field name="parent" type="Bifrost.views.Region">Parent region, null if there is no parent</field>
        this.parent = null;

        /// <field name="children" type="Bifrost.views.Region[]">Child regions within this region</field>
        this.children = ko.observableArray();

        /// <field name="commands" type="observableArray">Array of commands inside the region</field>
        this.commands = ko.observableArray();

        /// <field name="aggregatedCommands" type="observableArray">Represents all commands in this region and any child regions</field>
        this.aggregatedCommands = ko.computed(function () {
            var commands = self.commands();
            self.children().forEach(function (childRegion) {
                childRegion.aggregatedCommands().forEach(function (command) {
                    commands.push(command);
                });
            });
            return commands;
        });
        

        function thisOrChildHasTaskType(taskType, propertyName) {
            return ko.computed(function () {
                var hasTask = false;
                self.children().forEach(function (childRegion) {
                    if (childRegion[propertyName]() === true) {
                        hasTask = true;
                        return;
                    }
                });

                self.tasks.all().forEach(function (task) {
                    if (task._type.typeOf(taskType) == true ) {
                        hasTask = true;
                    }
                });

                return hasTask;
            });
        }

        function thisOrChildCommandHasPropertySetToTrue(commandPropertyName, regionPropertyName, breakIfThisHasNoCommands) {
            return ko.computed(function () {
                var isSet = true;

                var commands = self.aggregatedCommands();
                if (breakIfThisHasNoCommands === true) {
                    if (commands.length == 0) return false;
                }
                commands.forEach(function (command) {
                    if (command[commandPropertyName]() === false) {
                        isSet = false;
                        return;
                    }
                });

                return isSet;
            });
        }

        function thisOrChildCommandHasPropertySetToFalse(commandPropertyName, regionPropertyName) {
            return ko.computed(function () {
                var isSet = false;

                var commands = self.aggregatedCommands();
                commands.forEach(function (command) {
                    if (command[commandPropertyName]() === true) {
                        isSet = true;
                        return;
                    }
                });

                return isSet;
            });
        }

        /// <field name="isValid" type="observable">Indiciates wether or not region or any of its child regions are in an invalid state</field>
        this.isValid = thisOrChildCommandHasPropertySetToTrue("isValid");

        /// <field name="canCommandsExecute" type="observable">Indicates wether or not region or any of its child regions can execute their commands</field>
        this.canCommandsExecute = thisOrChildCommandHasPropertySetToTrue("canExecute", "canCommandsExecute", true);

        /// <field name="areCommandsAuthorized" type="observable">Indicates wether or not region or any of its child regions have their commands authorized</field>
        this.areCommandsAuthorized = thisOrChildCommandHasPropertySetToTrue("isAuthorized", "areCommandsAuthorized");

        /// <field name="areCommandsAuthorized" type="observable">Indicates wether or not region or any of its child regions have their commands changed</field>
        this.commandsHaveChanges = thisOrChildCommandHasPropertySetToFalse("hasChanges", "commandsHaveChanges");

        /// <field name="areCommandsAuthorized" type="observable">Indicates wether or not region or any of its child regions have their commands ready to execute</field>
        this.areCommandsReadyToExecute = thisOrChildCommandHasPropertySetToTrue("isReadyToExecute", "areCommandsReadyToExecute", true);

        /// <field name="areCommandsAuthorized" type="observable">Indicates wether or not region or any of its child regions have changes in their commands or has any operations</field>
        this.hasChanges = ko.computed(function () {
            var commandsHaveChanges = self.commandsHaveChanges();
            var childrenHasChanges = false;
            self.children().forEach(function (childRegion) {
                if (childRegion.hasChanges() === true) {
                    childrenHasChanges = true;
                    return;
                }
            });

            return commandsHaveChanges || (self.operations.all().length > 0) || childrenHasChanges;
        });

        /// <field name="validationMessages" type="observableArray">Holds the regions and any of its child regions validation messages</field>
        this.validationMessages = ko.computed(function () {
            var messages = [];

            var commands = self.aggregatedCommands();
            self.commands().forEach(function (command) {
                if (command.isValid() === false) {
                    command.validators().forEach(function (validator) {
                        if (validator.isValid() === false) {
                            messages.push(validator.message());
                        }
                    });
                }
            });

            return messages;
        });


        /// <field name="isExecuting" type="observable">Indiciates wether or not execution tasks are being performend in this region or any of its child regions</field>
        this.isExecuting = thisOrChildHasTaskType(Bifrost.tasks.ExecutionTask, "isExecuting");

        /// <field name="isComposing" type="observable">Indiciates wether or not execution tasks are being performend in this region or any of its child regions</field>
        this.isComposing = thisOrChildHasTaskType(Bifrost.views.ComposeTask, "isComposing");

        /// <field name="isLoading" type="observable">Indiciates wether or not loading tasks are being performend in this region or any of its child regions</field>
        this.isLoading = thisOrChildHasTaskType(Bifrost.tasks.LoadTask, "isLoading");

        /// <field name="isBusy" type="observable">Indicates wether or not tasks are being performed in this region or any of its child regions</field>
        this.isBusy = ko.computed(function () {
            var isBusy = false;
            self.children().forEach(function (childRegion) {
                if (childRegion.isBusy() === true) {
                    isBusy = true;
                    return;
                }
            });
            
            if (self.tasks.all().length > 0) isBusy = true;

            return isBusy;
        });
    }
});
Bifrost.views.Region.current = null;
Bifrost.dependencyResolvers.Region = {
    canResolve: function (namespace, name) {
        return name === "region";
    },

    resolve: function (namespace, name) {
        return Bifrost.views.Region.current;
    }
};
Bifrost.namespace("Bifrost.views", {
    regionManager: Bifrost.Singleton(function (documentService, regionDescriptorManager, messengerFactory, operationsFactory, tasksFactory) {
        /// <summary>Represents a manager that knows how to deal with Regions on the page</summary>
        var self = this;

        function createRegionInstance() {
            var instance = new Bifrost.views.Region(messengerFactory, operationsFactory, tasksFactory);
            return instance;
        }


        function manageInheritance(element) {
            var parentRegion = documentService.getParentRegionFor(element);
            if (parentRegion) {
                Bifrost.views.Region.prototype = parentRegion;
            } else {
                var topLevel = createRegionInstance();
                regionDescriptorManager.describeTopLevel(topLevel);
                Bifrost.views.Region.prototype = topLevel;
            }
            return parentRegion;
        }

        function manageHierarchy(parentRegion, view) {
            var region = createRegionInstance();
            region.parent = parentRegion;
            region.view = view;
            if (parentRegion) {
                parentRegion.children.push(region);
            }
            return region;
        }

        this.getFor = function (view) {
            /// <summary>Gets the region for the given element and creates one if none exist</summary>
            /// <param name="element" type="HTMLElement">Element to get a region for</param>
            /// <returns>The region for the element</returns>
            var promise = Bifrost.execution.Promise.create();

            var element = view.element;

            if (documentService.hasOwnRegion(element)) {
                promise.signal(documentService.getRegionFor(element));
                return promise;
            }

            var parentRegion = manageInheritance(element);
            var region = manageHierarchy(parentRegion, view);

            regionDescriptorManager.describe(view, region).continueWith(function () {
                documentService.setRegionOn(element, region);
                promise.signal(region);
            });

            return promise;
        };

        this.getCurrent = function () {
            /// <summary>Gets the current region</summary>
            return Bifrost.views.Region.current;
        }

        this.evict = function (region) {
            /// <summary>Evict a region from the page</summary>
            /// <param name="region" type="Bifrost.views.Region">Region to evict</param>

            if (region.parentRegion) {
                region.parentRegion.children.remove(region);
            }
            region.parentRegion = null;
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.regionManager = Bifrost.views.regionManage;
Bifrost.namespace("Bifrost.views", {
    RegionDescriptor: Bifrost.Type.extend(function () {
        var self = this;

        this.describe = function (region) {
        };
    })
});
Bifrost.namespace("Bifrost.views", {
    regionDescriptorManager: Bifrost.Singleton(function () {
        /// <summary>Represents a manager that knows how to manage region descriptors</summary>
        var self = this;

        this.describe = function (view, region) {
            /// <summary>Describe a specific region related to a view</summary>
            /// <param name="view" type="Bifrost.views.View">View related to the region</param>
            /// <param name="region" type="Bifrost.views.Region">Region that needs to be described</param>
            var promise = Bifrost.execution.Promise.create();
            var localPath = Bifrost.Path.getPathWithoutFilename(view.path);
            var namespacePath = Bifrost.namespaceMappers.mapPathToNamespace(localPath);
            if (namespacePath != null) {
                var namespace = Bifrost.namespace(namespacePath);

                Bifrost.dependencyResolver.beginResolve(namespace, "RegionDescriptor").continueWith(function (descriptor) {
                    descriptor.describe(region);
                    promise.signal();
                }).onFail(function () {
                    promise.signal();
                });
            } else {
                promise.signal();
            }
            return promise;
        };

        this.describeTopLevel = function (region) {
            
        };
    })
});
Bifrost.dependencyResolvers.RegionDescriptor = {
    canResolve: function (namespace, name) {
        return name === "RegionDescriptor";
    },

    resolve: function (namespace, name) {
        return {
            describe: function () { }
        };
    }
};
Bifrost.namespace("Bifrost.interaction", {
	VisualStateManagerElementVisitor: Bifrost.views.ElementVisitor.extend(function() {
		var visualStateActionTypes = Bifrost.interaction.VisualStateAction.getExtenders();

		function parseActions(namingRoot, stateElement, state) {
			if( stateElement.hasChildNodes() ) {
				var child = stateElement.firstChild;
				while( child ) {
					visualStateActionTypes.forEach(function(type) {
						if( type._name.toLowerCase() == child.localName ) {
							var action = type.create();

							for( var attributeIndex=0; attributeIndex<child.attributes.length; attributeIndex++ ) {
								var name = child.attributes[attributeIndex].localName;
								var value = child.attributes[attributeIndex].value;
								if( action.hasOwnProperty(name) ) {
									action[name] = value;
								}
							}
							action.initialize(namingRoot);
							state.addAction(action);
						}
					});
					child = child.nextSibling;
				}
			}
		}

		function parseStates(namingRoot, groupElement, group) {
			if( groupElement.hasChildNodes() ) {
				var child = groupElement.firstChild;
				while( child ) {
					if( child.localName === "visualstate" ) {
						var state = Bifrost.interaction.VisualState.create();
						state.name = child.getAttribute("name");
						group.addState(state);
						parseActions(namingRoot, child, state);
					}
					child = child.nextSibling;
				}
			}
		}


		this.visit = function(element, actions) {
			if( element.localName === "visualstatemanager" ) {
				var visualStateManager = Bifrost.interaction.VisualStateManager.create();
				var namingRoot = element.parentElement.namingRoot;
				element.parentElement.visualStateManager = visualStateManager;

				if( element.hasChildNodes() ) {
					var child = element.firstChild;
					while( child ) {
						if( child.localName === "visualstategroup" ) {
							var group = Bifrost.interaction.VisualStateGroup.create();
							visualStateManager.addGroup(group);

							var duration = child.getAttribute("duration");
							if( !Bifrost.isNullOrUndefined(duration) ) {
								duration = parseFloat(duration);
								if( !isNaN(duration) ) {
									duration = duration * 1000;
									timespan = Bifrost.TimeSpan.fromMilliseconds(duration);
									group.defaultDuration = timespan;
								}
							}

							parseStates(namingRoot, child, group);
						}
						child = child.nextSibling;
					}
				}
			}
		}

	})
});
Bifrost.namespace("Bifrost.navigation", {
    NavigationFrame: Bifrost.Type.extend(function (home, locationAware, uriMapper, history, viewManager) {
        var self = this;

        this.home = home;
        this.locationAware = locationAware || false;
        this.history = history;
        this.viewManager = viewManager;

        this.container = null;
        this.currentUri = ko.observable(home);
        this.currentRenderedPath = null;
        this.uriMapper = uriMapper || null;

        this.currentUri.subscribe(function () {
            self.render();
        });
        
        this.setCurrentUri = function (path) {
            if (path.indexOf("/") == 0) path = path.substr(1);
            if (path == null || path.length == 0) path = self.home;
            if (self.uriMapper != null && !self.uriMapper.hasMappingFor(path)) path = self.home;
            self.currentUri(path);
        };

        this.setCurrentUriFromCurrentLocation = function () {
            var state = self.history.getState();
            var uri = Bifrost.Uri.create(state.url);
            self.setCurrentUri(uri.path);
        }

        if (locationAware === true) {
            history.Adapter.bind(window, "statechange", function () {
                self.setCurrentUriFromCurrentLocation();
            });
        }

        this.setContainer = function (container) {
            if (self.locationAware === true) {
                self.setCurrentUriFromCurrentLocation();
            }

            self.container = container;

            var uriMapper = $(container).closest("[data-urimapper]");
            if (uriMapper.length == 1) {
                var uriMapperName = $(uriMapper[0]).data("urimapper");
                if (uriMapperName in Bifrost.uriMappers) {
                    self.uriMapper = Bifrost.uriMappers[uriMapperName];
                }
            }
            if (self.uriMapper == null) self.uriMapper = Bifrost.uriMappers.default;
            return self.render();
        };

        this.render = function () {
            var promise = Bifrost.execution.Promise.create();
            var path = self.currentUri();
            if (self.container == null) return;
            if (path == self.currentRenderedPath) return;
            self.currentRenderedPath = path;

            if (path !== null && typeof path !== "undefined") {
                $(self.container).data("view", path);
                self.viewManager.render(self.container).continueWith(function () {
                    //promise.signal();
                });
            }
            return promise;
        };

        this.navigate = function (uri) {
            self.setCurrentUri(uri);
        };

    })
});
Bifrost.namespace("Bifrost.navigation", {
    navigationFrames: Bifrost.Singleton(function () {
        var self = this;

        this.hookup = function () {
            $("[data-navigation-frame]").each(function (index, element) {
                var configurationString = $(element).data("navigation-frame");
                var configurationItems = ko.expressionRewriting.parseObjectLiteral(configurationString);

                var configuration = {};

                for (var index = 0; index < configurationItems.length; index++) {
                    var item = configurationItems[index];
                    configuration[item.key.trim()] = item.value.trim();
                }

                if (typeof configuration.uriMapper !== "undefined") {
                    var mapper = Bifrost.uriMappers[configuration.uriMapper];
                    var frame = Bifrost.navigation.NavigationFrame.create({
                        stringMapper: mapper,
                        home: configuration.home || ''
                    });
                    frame.setContainer(element);

                    element.navigationFrame = frame;
                }
            });
        };
    })
});
if (typeof ko !== 'undefined' && typeof History !== "undefined" && typeof History.Adapter !== "undefined") {
    ko.bindingHandlers.navigateTo = {
        init: function (element, valueAccessor, allBindingAccessor, viewModel) {
            ko.applyBindingsToNode(element, { 
				click: function() {
					var featureName = valueAccessor()();
					History.pushState({feature:featureName},$(element).attr("title"),"/"+featureName);
				} 
			}, viewModel);
        }
    };
}
Bifrost.namespace("Bifrost.navigation", {
    navigateTo: function (featureName, queryString) {
        var url = featureName;

        if (featureName.charAt(0) !== "/")
            url = "/" + url;
        if (queryString)
            url += queryString;

        // TODO: Support title somehow
        if (typeof History !== "undefined" && typeof History.Adapter !== "undefined") {
            History.pushState({}, "", url);
        }
    },
    navigationManager: {
        getCurrentLocation: function() {
            var uri = Bifrost.Uri.create(window.location.toString());
            return uri;
        },

        hookup: function () {
            if (typeof History !== "undefined" && typeof History.Adapter !== "undefined") {
                $("body").click(function (e) {
                    var href = e.target.href;
                    if (typeof href == "undefined") {
                        var closestAnchor = $(e.target).closest("a")[0];
                        if (!closestAnchor) {
                            return;
                        }
                        href = closestAnchor.href;
                    }
                    if (href.indexOf("#!") > 0) {
                        href = href.substr(0, href.indexOf("#!"));
                    }

                    if (href.length == 0) {
                        href = "/";
                    }
                    var targetUri = Bifrost.Uri.create(href);
                    if (targetUri.isSameAsOrigin &&
                        targetUri.queryString.indexOf("postback")<0) {
                        var target = targetUri.path;
                        while (target.indexOf("/") == 0) {
                            target = target.substr(1);
                        }
                        e.preventDefault();

                        var result = $(e.target).closest("[data-navigation-target]");
                        if (result.length == 1) {
                            var id = $(result[0]).data("navigation-target");
                            var element = $("#"+id);
                            if (element.length == 1 && typeof element[0].navigationFrame !== "undefined") {
                                element[0].navigationFrame.navigate(targetUri.path);
                            } else {
                                // Element not found
                            }
                        } else {
                            var queryString = targetUri.queryString.length > 0 ? "?" + targetUri.queryString : "";
                            History.pushState({}, "", "/" + target + queryString);
                        }
                    }
                });
            }
        }
    }
});
Bifrost.namespace("Bifrost.navigation", {
    NavigationFrameViewRenderer: Bifrost.views.ViewRenderer.extend(function () {

        this.canRender = function (element) {
            return typeof $(element).data("navigation-frame") !== "undefined" && 
                    typeof $(element).data("view") === "undefined";
        };

        this.render = function (element) {
            var promise = Bifrost.execution.Promise.create();

            var configurationString = $(element).data("navigation-frame");
            var configurationItems = ko.expressionRewriting.parseObjectLiteral(configurationString);

            var configuration = {};

            for (var index = 0; index < configurationItems.length; index++) {
                var item = configurationItems[index];
                configuration[item.key.trim()] = item.value.trim();
            }

            if (typeof configuration.uriMapper !== "undefined") {
                $(element).data("urimapper", configuration.uriMapper);
            } else {
                configuration.uriMapper = "default";
            }

            var frame = Bifrost.navigation.NavigationFrame.create({
                home: configuration.home || '',
                locationAware: configuration.locationAware || true,
                uriMapper: Bifrost.uriMappers[configuration.uriMapper]
            });
            element.navigationFrame = frame;
            frame.setContainer(element).continueWith(function (view) {
                promise.signal(view);
            });

            return promise;
        };
    })
});
if (typeof Bifrost.views.viewRenderers != "undefined") {
    Bifrost.views.viewRenderers.NavigationFrameViewRenderer = Bifrost.navigation.NavigationFrameViewRenderer;
}
Bifrost.namespace("Bifrost.navigation", {
    observableQueryParameterFactory: Bifrost.Singleton(function () {
        var self = this;

        var historyEnabled = typeof History !== "undefined" && typeof History.Adapter !== "undefined";

        this.create = function (parameterName, defaultValue, navigationManager) {
            
            function getState() {
                var uri = navigationManager.getCurrentLocation();
                if (uri.parameters.hasOwnProperty(parameterName)) {
                    return uri.parameters[parameterName];
                }

                return null;
            }

            var observable = null;

            if (historyEnabled) {
                History.Adapter.bind(window, "statechange", function () {
                    if (observable != null) {
                        observable(getState());
                    }
                });
            } else {
                window.addEventListener("hashchange", function () {
                    if (observable != null) {
                        var state = getState();
                        if (observable() != state) {
                            observable(state);
                        }
                    }
                }, false);
            }

            var state = getState();
            observable = ko.observable(state || defaultValue);

            if (historyEnabled) {
                observable.subscribe(function (newValue) {
                    var state = History.getState();
                    state[parameterName] = newValue;

                    var parameters = Bifrost.hashString.decode(state.url);
                    parameters[parameterName] = newValue;

                    var url = "?";
                    var parameterIndex = 0;
                    for (var parameter in parameters) {
                        if (parameterIndex > 0) {
                            url += "&";
                        }
                        url += parameter + "=" + parameters[parameter];
                        parameterIndex++;
                    }

                    History.pushState(state, state.title, url);
                });
            }

            return observable;
            
        };


    })
});

ko.observableQueryParameter = function (parameterName, defaultValue) {
    var navigationManager = Bifrost.navigation.navigationManager;
    var observable = Bifrost.navigation.observableQueryParameterFactory.create().create(parameterName, defaultValue, navigationManager);
    return observable;
};
Bifrost.namespace("Bifrost", {
    configure: (function () {
        var self = this;

        this.ready = false;
        this.readyCallbacks = [];

        function ready(callback) {
            if (self.ready == true) {
                callback();
            } else {
                readyCallbacks.push(callback);
            }
        }

        function onReady() {
            self.ready = true;
            for (var callbackIndex = 0; callbackIndex < self.readyCallbacks.length; callbackIndex++) {
                self.readyCallbacks[callbackIndex]();
            }
        }

        function onStartup() {
            var self = this;

            Bifrost.dependencyResolvers.DOMRootDependencyResolver.documentIsReady();
            Bifrost.views.viewModelBindingHandler.initialize();
            Bifrost.views.viewBindingHandler.initialize();

            if (typeof History !== "undefined" && typeof History.Adapter !== "undefined") {
                Bifrost.WellKnownTypesDependencyResolver.types.history = History;
            }

            var defaultUriMapper = Bifrost.StringMapper.create();
            defaultUriMapper.addMapping("{boundedContext}/{module}/{feature}/{view}", "{boundedContext}/{module}/{feature}/{view}.html");
            defaultUriMapper.addMapping("{boundedContext}/{feature}/{view}", "{boundedContext}/{feature}/{view}.html");
            defaultUriMapper.addMapping("{feature}/{view}", "{feature}/{view}.html");
            defaultUriMapper.addMapping("{view}", "{view}.html");
            Bifrost.uriMappers.default = defaultUriMapper;

            var bifrostVisualizerUriMapper = Bifrost.StringMapper.create();
            bifrostVisualizerUriMapper.addMapping("Visualizer/{module}/{view}", "/Bifrost/Visualizer/{module}/{view}.html");
            bifrostVisualizerUriMapper.addMapping("Visualizer/{view}", "/Bifrost/Visualizer/{view}.html");
            Bifrost.uriMappers.bifrostVisualizer = bifrostVisualizerUriMapper;

            var promise = Bifrost.assetsManager.initialize();
            promise.continueWith(function () {
                Bifrost.views.viewManager.create().initializeLandingPage();
                Bifrost.navigation.navigationManager.hookup();
                self.onReady();
            });
        }

        function reset() {
            self.ready = false;
            self.readyCallbacks = [];
        }

        return {
            ready: ready,
            onReady: onReady,
            onStartup: onStartup,
            reset: reset,
            isReady: function () {
                return self.ready;
            }
        }
    })()
});
(function ($) {
    $(function () {
        if( typeof Bifrost.assetsManager !== "undefined" ) {
            Bifrost.configure.onStartup();
        }
    });
})(jQuery);
