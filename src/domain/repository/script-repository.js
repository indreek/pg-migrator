"use strict";

function ScriptRepository(fs, persister) {
    this._fs = fs;
    this._persister = persister;
}

ScriptRepository.prototype.constructor = ScriptRepository;

ScriptRepository.prototype.get = function (path) {
    return this._fs.readFileSync(path, "utf8");
};

ScriptRepository.prototype.execute = function (query, succeedCallback, failedCallback) {
    this._persister.query(query, function (err) {
        if (err) {
            console.log(err);
            return failedCallback(err);
        }
console.log("ok");
        return succeedCallback();
    });
};

ScriptRepository.prototype.getList = function (path) {
    return this._fs.readdirSync(path);
};

ScriptRepository.prototype.getStat = function (path) {
    return this._fs.statSync(path)
};

module.exports = ScriptRepository;