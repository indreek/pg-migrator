"use strict";

function VersionRepository(persister) {
    this._persister = persister;
}

VersionRepository.prototype.constructor = VersionRepository;

VersionRepository.prototype.checkTable = function get(succeedCallback, failedCallback) {

    this._persister.query("SELECT EXISTS(SELECT * FROM information_schema.tables  WHERE table_name = 'version') as value;", function (err, result) {

        if (err) {
            return failedCallback(err);
        }

        return succeedCallback(result.rows[0].value);
    });
};

VersionRepository.prototype.createTable = function createTable(succeedCallback, failedCallback) {

    this._persister.query("CREATE TABLE version (value INT);INSERT INTO version(value) VALUES(1);", function (err) {

        if (err) {
            return failedCallback(err);
        }

        return succeedCallback();
    });
};

VersionRepository.prototype.get = function get(succeedCallback, failedCallback) {

    this._persister.query("SELECT value FROM version", function (err, result) {

        if (err) {
            return failedCallback(err);
        }

        return succeedCallback(result.rows[0].value);
    });
};

VersionRepository.prototype.update = function update(version, succeedCallback, failedCallback) {

    this._persister.query("UPDATE version SET value = $1", [version], function (err) {

        if (err) {
            return failedCallback(err);
        }

        return succeedCallback(version);
    });
};

module.exports = VersionRepository;