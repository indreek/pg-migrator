"use strict";

function VersionRepository(persister) {
    this._persister = persister;
}

VersionRepository.prototype.constructor = VersionRepository;

VersionRepository.prototype.createTable = function createTable(succeedCallback, failedCallback) {

    this._persister.query("CREATE TABLE version (value INT);INSERT INTO version(value) VALUES(1);", function (err) {
        if (err) {

            return failedCallback(err);
        }

        return succeedCallback();
    });
};

VersionRepository.prototype.get = function get(succeedCallback, failedCallback) {

    var currentVersion;

    this._persister.query("SELECT value FROM version", function (err, res) {
        if (err) {
            if ('' + err === 'error: relation "version" does not exist') {
                return succeedCallback(-1);
            }

            return failedCallback(err);
        }

        currentVersion = +res.rows[0].value;

        return succeedCallback(currentVersion);
    });
};

VersionRepository.prototype.update = function update(version, succeedCallback, failedCallback) {

    this._persister.query("UPDATE version SET value = $1", [version], function (err) {
        if (err) {

            return failedCallback(err);
        }

        return succeedCallback();
    });
};

module.exports = VersionRepository;