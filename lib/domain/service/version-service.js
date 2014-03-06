"use strict";

function VersionService(versionRepository, messages) {
    this._versionRepository = versionRepository;
    this._messages = messages;
}

VersionService.prototype.constructor = VersionService;

VersionService.prototype.get = function get(succeedCallback, failedCallback) {

    var versionRepository = this._versionRepository;
    var messages = this._messages;

    // check if "version" table exists in db
    versionRepository.checkTable(function (exists) {

        if (!exists) {

            // "version" table does not exist, will be created for the first time with version "1"
            console.log(messages.FIRST_INITIALIZE.warn);

            versionRepository.createTable(function () {

                succeedCallback(1);

            }, failedCallback);
        }
        else {
            // Get the current version from db
            versionRepository.get(function (currentVersion) {

                succeedCallback(currentVersion);

            }, failedCallback);
        }
    }, failedCallback);
};

VersionService.prototype.update = function update(version, succeedCallback, failedCallback) {

    // Update current version
    this._versionRepository.update(version, succeedCallback, failedCallback);
};

module.exports = VersionService;