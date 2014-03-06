"use strict";

function ScriptRepository(fs) {
    this._fs = fs;
};

ScriptRepository.prototype.constructor = ScriptRepository;

ScriptRepository.prototype.getList = function (path) {
    return this._fs.readdirSync(path);
};

ScriptRepository.prototype.getStat = function (path) {
    return this._fs.statSync(path)
};

module.exports = ScriptRepository;