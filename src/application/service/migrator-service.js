"use strict";

function MigratorService(scriptService, versionService, messages, _) {
    this._scriptService = scriptService;
    this._versionService = versionService;
    this._messages = messages;
    this._ = _;
};

MigratorService.prototype.constructor = MigratorService;

MigratorService.prototype.migrate = function (currentPath, targetVersion, succeedCallback, failedCallback) {

    var messages = this._messages;

    var fileList = this._scriptService.getList(currentPath);

    if (fileList.length == 0) {
        console.log(messages.MIGRATION_SCRIPT_NOT_FOUND.red);

        failedCallback();
    }

    if (targetVersion == 0) {

        var targetVersion = this._.max(fileList,function (item) {
            return item.targetVersion;
        }).targetVersion;
    }

    var version = this._versionService.get(function (currentVersion) {

        console.log((messages.CURRENT_VERSION + currentVersion).cyan);
        console.log((messages.TARGET_VERSION + targetVersion).cyan);

        if (currentVersion == targetVersion) {
            console.log(messages.ALREADY_MIGRATED.yellow);

            failedCallback();
        }

        succeedCallback();
    }, failedCallback);
};

module.exports = MigratorService;