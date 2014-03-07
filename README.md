pg-migrator
===========

The complete and easy to use command-line Migration solution for [PostgreSQL](http://www.postgresql.org/).

## Features

<img align="right" width="256" height="256" src="http://3.bp.blogspot.com/-IsgA8HsxwNw/UxlookvyH_I/AAAAAAAAUhI/TNysqLuoJ8o/s1600/pg-migrator.png">

  * Auto migration from scratch to up to date
  * Step by step forward migration
  * Step by step backward migration
  * Migrate to a specific version forward or backward
  * Subfolder deep search for migration scripts
  * All or nothing (Transactional migration)
  * Can use on any system that can connect to target PostgreSQL database


## Installation

Install this globally and you'll have access to the pg-migrator command anywhere on your system.

    $ npm install -g pg-migrator

## Quick Start

The quickest way to migrate the target database with pg-migrator is type "pg-migrator" and a valid connection string as shown below.

    $ pg-migrator postgres://username:password@localhost/testdb

This command will migrate the "testdb" database to the latest version according to migration scripts.

You can also chose the target version with a second parameter as shown below.

    $ pg-migrator postgres://username:password@localhost/testdb 15

This command will migrate the "testdb" database to version 15 (forward or backward according to current database version). Other avaliable version options shown below.

  * +1 : One step forward migration
  * -1 : One step backward migration

    $ pg-migrator postgres://username:password@localhost/testdb +1
    $ pg-migrator postgres://username:password@localhost/testdb -1

## Migration Scripts

pg-migrator uses migration scripts in current execution folder or subfolders. All migration scripts files must have an extension with ".sql" (case insensitive) with and "x-y.sql" format that x and y must be valid numbers. Both numbers also must be sequential. All other files will be ignored.

Sample migration script file names;
```
25-26.sql : Migration script from version 25 to version 26 for forward migration
26-25.sql : Migration script from version 26 to version 25 for backward migration
```

You can find sample migration script file in the "examples" folder