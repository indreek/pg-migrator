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

This command will migrate the "testdb" database to version 15 (forward or backward according to current database version). Other avaliable version options are shown below.

  * +1 : One step forward migration
  * -1 : One step backward migration

Samples for one step migration;

    $ pg-migrator postgres://username:password@localhost/testdb +1
    $ pg-migrator postgres://username:password@localhost/testdb -1

## Migration Scripts

pg-migrator uses migration scripts in current execution folder or subfolders. All migration scripts files must have an extension with ".sql" (case insensitive) and "x-y.sql" format that x and y must be valid numbers. Both numbers also must be sequential. All other files will be ignored.

Migration scripts can contain any valid sql statements like create/alter table and also insert/update etc.

You can categorize your scripts with folders as you wish. pg-migrator search all subfolders and put them in order according to x-y numbers in file names of folder structure.

Sample migration script file names;
```
25-26.sql : Migration script from version 25 to version 26 for forward migration
26-25.sql : Migration script from version 26 to version 25 for backward migration
```
Let's say, our database is in version 25 at the moment. If you request one step forward migration, pg-migrator searches folders for a file with "25-26.sql" name and if can't found, displays an error message.

Likewise, if you request one step backward migration, at this time, pg-migrator searches folders for a file with "25-24.sql" name and if can't found, displays an error message.

So, your migration scripts must be started from "1-2.sql" and go on like "2-3.sql", "3-4.sql" etc.

For backward migration, your must also have files like "2-1.sql" and go on like "3-2.sql", "4-3.sql" etc.

You can find sample migration script file in the "examples" folder

## Step by Step Example

Let's go step by step from the scratch.

