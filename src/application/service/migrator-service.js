"use strict";

function MigratorService(scriptService, versionService, messages, _) {
    this._scriptService = scriptService;
    this._versionService = versionService;
    this._messages = messages;
    this._ = _;
}

MigratorService.prototype.constructor = MigratorService;

MigratorService.prototype.migrate = function migrate(currentPath, targetVersion, succeedCallback, failedCallback) {

    var scriptService = this._scriptService;
    var versionService = this._versionService;
    var messages = this._messages;
    var _ = this._;
    var executeScript = this._executeScript;
    var that = this;

    var fileList = scriptService.getList(currentPath);

    var i, file, fileContent, direction;

    if (fileList.length == 0) {
        // There is no migration script file in current folder and subfolders
        console.log(messages.MIGRATION_SCRIPT_NOT_FOUND.error);

        return failedCallback();
    }

    versionService.get(function (currentVersion) {

        if (targetVersion == 0) {

            // User didn't specify target version
            // Looking for the file that has the biggest target version number
            targetVersion = _.max(fileList,function (item) {
                return item.targetVersion;
            }).targetVersion;
        }
        else if (targetVersion == -1) {

            // One step roll back request
            if (currentVersion == 1) {
                // DB in the initial state, can't go back no more
                console.log(messages.NO_MORE_ROLLBACK.error);

                return failedCallback();
            }

            targetVersion = currentVersion - 1;
        }

        console.log((messages.CURRENT_VERSION + currentVersion).verbose);
        console.log((messages.TARGET_VERSION + targetVersion).verbose);

        if (currentVersion == targetVersion) {
            // DB is already migrated to the target version
            console.log(messages.ALREADY_MIGRATED.warn);

            return failedCallback();
        }

        if (currentVersion < targetVersion) {
            // Forward migration
            direction = 1;
        }
        else {
            // Rollback migration
            direction = -1;
        }

        executeScript.call(that, direction, fileList, currentVersion, targetVersion, function () {
            versionService.update(targetVersion, succeedCallback, failedCallback);
        }, failedCallback);

    }, failedCallback);
};

MigratorService.prototype._executeScript = function _executeScript(direction, fileList, currentVersion, targetVersion, succeedCallback, failedCallback) {

    var scriptService = this._scriptService;
    var messages = this._messages;
    var executeScript = this._executeScript;
    var _ = this._;
    var that = this;

    var nextVersion = currentVersion + direction;

    var file = _.findWhere(fileList, { baseVersion: currentVersion.toString(), targetVersion: nextVersion.toString() });

    if (!file) {
        console.log((messages.FILE_NOT_FOUND + currentVersion + "-" + nextVersion + ".sql").error);

        return failedCallback();
    }
    else {

        var fileContent = scriptService.get(file.path);

        scriptService.execute(fileContent, function () {

            console.log("--------------------------------------------------".grey);

            console.log(fileContent.white);

            console.log((currentVersion + "-" + nextVersion + ".sql executed").info);

            console.log("--------------------------------------------------".grey);

            currentVersion += direction;

            if (currentVersion == targetVersion) {
                succeedCallback();
            }
            else {
                executeScript.call(that, direction, fileList, currentVersion, targetVersion, succeedCallback, failedCallback);
            }

        }, function (err) {
            return failedCallback(err)
        });
    }
};

module.exports = MigratorService;