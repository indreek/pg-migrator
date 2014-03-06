"use strict";

function VersionService(versionRepository) {
    this._versionRepository = versionRepository;
}

VersionService.prototype.constructor = VersionService;

VersionService.prototype.get = function () {

    throw "Not Implemented";
};

VersionService.prototype.increase = function (version) {

    throw "Not Implemented";
};

VersionService.prototype.decrease = function (version) {

    throw "Not Implemented";
};

module.exports = VersionService;