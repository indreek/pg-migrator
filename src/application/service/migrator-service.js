"use strict";

function MigratorService(scriptService, versionService, messages, _) {
    this._scriptService = scriptService;
    this._versionService = versionService;
    this._messages = messages;
    this._ = _;
}

MigratorService.prototype.constructor = MigratorService;

MigratorService.prototype.migrate = function (currentPath, targetVersion, succeedCallback, failedCallback) {

    var scriptService = this._scriptService;
    var versionService = this._versionService;
    var messages = this._messages;
    var _ = this._;

    var fileList = scriptService.getList(currentPath);

    var i, file, fileContent;

    if (fileList.length == 0) {
        console.log(messages.MIGRATION_SCRIPT_NOT_FOUND.error);

        failedCallback();

        return;
    }

    versionService.get(function (currentVersion) {

        if (targetVersion == 0) {

            targetVersion = _.max(fileList,function (item) {
                return item.targetVersion;
            }).targetVersion;
        }
        else if (targetVersion == -1) {

            if (currentVersion == 1) {
                console.log(messages.NO_MORE_ROLLBACK.error);

                failedCallback();

                return;
            }

            targetVersion = currentVersion - 1;
        }

        console.log((messages.CURRENT_VERSION + currentVersion).verbose);
        console.log((messages.TARGET_VERSION + targetVersion).verbose);

        if (currentVersion == targetVersion) {
            console.log(messages.ALREADY_MIGRATED.warn);

            failedCallback();

            return;
        }

        if (currentVersion < targetVersion) {
            for (i = currentVersion; i < targetVersion; i++) {

                file = _.findWhere(fileList, { baseVersion: i.toString(), targetVersion: (i + 1).toString() });

                if (!file) {
                    console.log((messages.FILE_NOT_FOUND + i + "-" + (i + 1) + ".sql").error);

                    failedCallback();

                    return;
                }
                else {

                    fileContent = scriptService.get(file.path);

                    scriptService.execute(fileContent, function () {

                        console.log("------------------------------------------------".grey);

                        console.log(fileContent);

                        console.log((i + "-" + (i + 1) + ".sql executed").info);

                        console.log("------------------------------------------------".grey);

                    }, function (err) {
                        return failedCallback(err)
                    });
                }
            }
        }
        else {
            for (i = currentVersion; i > targetVersion; i--) {

                file = _.findWhere(fileList, { baseVersion: i.toString(), targetVersion: (i - 1).toString() });

                if (!file) {
                    console.log((messages.FILE_NOT_FOUND + i + "-" + (i - 1) + ".sql").error);

                    failedCallback();

                    return;
                }
                else {

                    fileContent = scriptService.get(file.path);

                    scriptService.execute(fileContent, function () {

                        console.log("------------------------------------------------".grey);

                        console.log(fileContent);

                        console.log((i + "-" + (i - 1) + ".sql executed").info);

                        console.log("------------------------------------------------".grey);

                    }, function (err) {
                        return failedCallback(err)
                    });
                }
            }
        }

        versionService.update(targetVersion, succeedCallback, failedCallback);

    }, failedCallback);
};

module.exports = MigratorService;