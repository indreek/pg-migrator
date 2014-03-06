"use strict";

function ValidationService(messages) {
    this._messages = messages;
}

ValidationService.prototype.constructor = ValidationService;

ValidationService.prototype.validate = function validate(args, succeedCallback, failedCallback) {

    // if targetVersion stays 0 means that, target version does not provided by user
    // so it will be obtained from script files (the biggest target version number in all files)
    var targetVersion = 0;

    if (args.length == 0) {

        // There is no argument provided but connection string argument is mandatory
        console.log(this._messages.CONNECTION_STRING_MUST_BE_PROVIDED.error);

        return failedCallback();
    }

    if (args.length > 1) {

        // Target version provided, check if valid
        if (isNaN(args[1])) {

            console.log(this._messages.INVALID_TARGET_VERSION.error);

            return failedCallback();
        }

        targetVersion = args[1];
    }

    return succeedCallback(args[0], targetVersion);
};

module.exports = ValidationService;