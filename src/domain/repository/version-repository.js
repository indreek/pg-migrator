"use strict";

function VersionRepository(persister) {
    this._persister = persister;
}

VersionRepository.prototype.constructor = VersionRepository;

VersionRepository.prototype.create = function (succeedCallback, failedCallback) {

    this._persister.query("CREATE TABLE version (value INT);INSERT INTO version(value) VALUES(0);", function (err) {
        if (err) {

            return failedCallback(err);
        }

        return succeedCallback();
    });
};

VersionRepository.prototype.destroy = function () {

    this._persister.query("DROP TABLE version", function (err) {
        if (err) {

            return failedCallback(err);
        }

        return succeedCallback();
    });
};

VersionRepository.prototype.get = function (succeedCallback, failedCallback) {

    var currentVersion = 0;

    this._persister.query("SELECT value FROM version WHERE key = 'patch'", function (err, res) {
        if (err) {
            if ('' + err === 'error: relation "version" does not exist') {
                return succeedCallback(currentVersion);
            }

            return failedCallback(err);
        }

        currentVersion = +res.rows[0].value;

        return succeedCallback(currentVersion);
    });
};

VersionRepository.prototype.update = function (version, succeedCallback, failedCallback) {

    this._persister.query("UPDATE version SET value = $1", [version], function (err) {
        if (err) {

            return failedCallback(err);
        }

        return succeedCallback();
    });
};

module.exports = VersionRepository;