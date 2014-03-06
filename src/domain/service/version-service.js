"use strict";

function VersionService(versionRepository, messages) {
    this._versionRepository = versionRepository;
    this._messages = messages;
}

VersionService.prototype.constructor = VersionService;

VersionService.prototype.get = function get(succeedCallback, failedCallback) {

    var versionRepository = this._versionRepository;
    var messages = this._messages;

    versionRepository.get(function (currentVersion) {

        if (currentVersion == -1) {

            console.log(messages.FIRST_INITIALIZE.warn);

            versionRepository.createTable(function () {

                succeedCallback(1);
            }, failedCallback);
        }
        else {
            succeedCallback(currentVersion);
        }
    }, failedCallback);
};

VersionService.prototype.update = function update(version, succeedCallback, failedCallback) {

    this._versionRepository.update(version, succeedCallback, failedCallback);
};

module.exports = VersionService;