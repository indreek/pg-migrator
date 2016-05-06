"use strict";

var promise = require("bluebird");

function VersionRepository(persister, versionTable) {
    this._persister = persister;
    this._versionTable = versionTable;
}

VersionRepository.prototype.constructor = VersionRepository;

VersionRepository.prototype.checkTable = function () {

    var deferred = promise.pending();

    if(this._versionTable.indexOf('.') >= 0){
        let versionTable = this._versionTable.split('.');

        this._persister.query("SELECT EXISTS(SELECT * " +
                                "FROM information_schema.tables " +
                               "WHERE table_name = '"+ versionTable[1] +"'" +
                                 "AND table_schema = '"+ versionTable[0] +"') as value;")
          .then(function (result) {

              deferred.fulfill(result.rows[0].value);
          })
          .catch(function (error) {
              deferred.reject(error);
          });
    }
    else{
        this._persister.query("SELECT EXISTS(SELECT * " +
                                "FROM information_schema.tables " +
                               "WHERE table_name = '"+ this._versionTable +"') as value;")
          .then(function (result) {

              deferred.fulfill(result.rows[0].value);
          })
          .catch(function (error) {
              deferred.reject(error);
          });
    }

    return deferred.promise;
};

VersionRepository.prototype.createTable = function () {

    return this._persister.query("CREATE TABLE "+ this._versionTable +" (value INT);" +
                                 "INSERT INTO "+ this._versionTable +" (value) VALUES(1);");
};

VersionRepository.prototype.get = function () {

    var deferred = promise.pending();

    this._persister.query("SELECT value FROM "+ this._versionTable +";")
        .then(function (result) {

            deferred.fulfill(result.rows[0].value);
        })
        .catch(function (error) {
            deferred.reject(error);
        });

    return deferred.promise;
};

VersionRepository.prototype.update = function (version) {

    return this._persister.query("UPDATE "+ this._versionTable +" SET value = $1;", [version]);
};

module.exports = VersionRepository;
