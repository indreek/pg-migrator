"use strict";

function ScriptRepository(fs, persister) {
    this._fs = fs;
    this._persister = persister;
}

ScriptRepository.prototype.constructor = ScriptRepository;

ScriptRepository.prototype.get = function get(path) {

    return this._fs.readFileSync(path, "utf8");
};

ScriptRepository.prototype.execute = function execute(query, succeedCallback, failedCallback) {

    this._persister.query(query, function (err) {

        if (err) {
            return failedCallback(err);
        }

        return succeedCallback();
    });
};

ScriptRepository.prototype.getList = function getList(path) {

    return this._fs.readdirSync(path);
};

ScriptRepository.prototype.getStat = function getStat(path) {

    return this._fs.statSync(path)
};

module.exports = ScriptRepository;