﻿Bifrost.namespace("Bifrost.views", {
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