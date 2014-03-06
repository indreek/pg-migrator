"use strict";

function FileService(fileRepository) {
    this._fileRepository = fileRepository;
}

FileService.prototype.constructor = FileService;

FileService.prototype.getList = function () {

    throw "Not Implemented";
};

module.exports = FileService;