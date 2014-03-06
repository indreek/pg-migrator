"use strict";

function MigratorService(versionService, fileService) {
    this._versionService = versionService;
    this._fileService = fileService;
}

MigratorService.prototype.constructor = MigratorService;

MigratorService.prototype.migrate = function (version) {

    throw "Not Implemented";
};

module.exports = MigratorService;