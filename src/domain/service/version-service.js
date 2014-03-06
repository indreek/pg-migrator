"use strict";

function VersionService(versionRepository, messages) {
    this._versionRepository = versionRepository;
    this._messages = messages;
};

VersionService.prototype.constructor = VersionService;

VersionService.prototype.get = function (succeedCallback, failedCallback) {

    var versionRepository = this._versionRepository;
    var messages = this._messages;

    versionRepository.get(function (currentVersion) {

        if (currentVersion == -1) {

            console.log(messages.FIRST_INITIALIZE.yellow);

            versionRepository.createTable(function () {

                succeedCallback(0);
            }, failedCallback);
        }
        else {
            succeedCallback(currentVersion);
        }
    }, failedCallback);
};

VersionService.prototype.increase = function (version) {

    throw "Not Implemented";
};

VersionService.prototype.decrease = function (version) {

    throw "Not Implemented";
};

module.exports = VersionService;