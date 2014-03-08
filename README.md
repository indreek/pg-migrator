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

As a first step, we need a database. Let's create a new database with "testdb" name. At the moment, there is no table this db.

IMAGE

As a beginning to development, we need two tables, "user" and "user_login_history". Let's write some script to create them but don't execute it yet. We'll use pg-migratior for execution.

```
/*** Add user and user_login_history tables and insert some data ***/

CREATE TABLE "user"
(
   id serial,
   username character(20)  NOT NULL,
   name_surname character(50) NOT NULL,
   CONSTRAINT pk_user PRIMARY KEY (id),
   CONSTRAINT uk_user UNIQUE (username)
)
WITH (
  OIDS = FALSE
);

CREATE TABLE "user_login_history"
(
   id serial,
   user_id integer NOT NULL,
   login_date date NOT NULL,
   CONSTRAINT pk_user_login_history PRIMARY KEY (id),
   CONSTRAINT fk_user_login_history FOREIGN KEY (user_id) REFERENCES "user" (id) ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS = FALSE
);

INSERT INTO "user"(username, name_surname)
    VALUES ('user1', 'User 1');

INSERT INTO "user"(username, name_surname)
    VALUES ('user2', 'User 2');

INSERT INTO user_login_history(user_id, login_date)
    VALUES (1, '2014-01-01');

INSERT INTO user_login_history(user_id, login_date)
    VALUES (1, '2014-01-02');

INSERT INTO user_login_history(user_id, login_date)
    VALUES (2, '2014-02-01');

INSERT INTO user_login_history(user_id, login_date)
    VALUES (2, '2014-02-02');

```

With this script, we're creating two tables and insert some data to them. Let's save this script with "1-2.sql" name. When this script executed, our database will be migrated from version 1 to version 2 (Forward migration).

Ok, that was the first one and we need an opposite script in case of roll back this operation. This script can be written like below.

```
/*** Remove user and user_login_history tables ***/

DROP TABLE "user_login_history";

DROP TABLE "user";

```

That was quite easy, just deleted all tables. We'll save this script with "2-1.sql". When this script executed, our database will be migrated from version 2 to version 1 (Backward migration).

Ok, let's continue to development. At this time, we need to add a new column to user table with "is_admin" name so write the script below and save it with "2-3.sql".

```
/*** Add is_admin column to user table ***/

ALTER TABLE "user"
  ADD COLUMN is_admin bit;

UPDATE "user" SET is_admin = '0'

ALTER TABLE "user"
   ALTER COLUMN is_admin SET NOT NULL;
```

Why don't we just add a new column with NOT NULL keyword directly? Because during two versions, some data may be inserted into the table so we can't create a new column with NOT NULL property. So, we've created a new column with NULL property, update all posible data to a default value then alter the column with NOT NULL property (Of course, you can define a default value for the new column but this property will stay on the column. This way is much more reasonable for production).

We need a roll back script again. Let's save the script below with "3-2.sql" name. This will just drop the new inserted column.

```
/*** Remove is_admin column from user table ***/

ALTER TABLE "user" DROP COLUMN is_admin;

```

Continue to development. We need a new table with "company" name and connect it with existing "user" table. So write the script below and save it with "3-4.sql".

```
/*** Add company table, insert some data and connect with user table ***/

CREATE TABLE "company"
(
   id serial,
   company_name character(20) NOT NULL,
   CONSTRAINT pk_company PRIMARY KEY (id),
   CONSTRAINT uk_company UNIQUE (company_name)
)
WITH (
  OIDS = FALSE
);

INSERT INTO "company"(company_name)
    VALUES ('Company 1');

ALTER TABLE "user"
  ADD COLUMN company_id integer;

UPDATE "user" SET company_id = 1

ALTER TABLE "user"
   ALTER COLUMN company_id SET NOT NULL;

ALTER TABLE "user"
  ADD CONSTRAINT fk_user FOREIGN KEY (company_id) REFERENCES company (id) ON UPDATE NO ACTION ON DELETE NO ACTION;

```
Not confused yet? Ok, I'll do my best :)

We have just created a new table, insert some data in it. Add a new column to the "user" table and connect it to the new table with a foreign key.

Let's write a roll back script and save as "4-3.sql". We have just delete foreign key, new added column and the table.

```
/*** Remove company table and disconnect user table ***/

ALTER TABLE "user" DROP CONSTRAINT fk_user;

ALTER TABLE "user" DROP COLUMN company_id;

DROP TABLE "company";

```
Before start the show, we will create a last script. This time for performance tuning. Let's create a few index with the following script (4-5.sql).

```
/*** Create indexes for user and company tables ***/

CREATE INDEX ix_user
   ON "user" (username ASC NULLS LAST);

CREATE INDEX ix_company
   ON "company" (company_name ASC NULLS LAST);

```

And the roll back script (4-4.sql).

```
/*** Remove indexes from user and company tables ***/

DROP INDEX ix_user;

DROP INDEX ix_company;

```

That all. We can start to use pg-migrator now. Because pg-migrator can seek and execute migration script in any subfolders, I will categorize scripts like below.

IMAGE






## Common Pitfalls
* pg-migrator must be executed in the root of migration scripts folder. It will search all directory content and all subfolders content recursively.
* Migration script files must be in "x-y.sql" format that x and y must be valid numbers. Both numbers also must be sequential. All other files will be ignored.
* All migrations scripts are executed in same transaction scope and totally roll back in case of fail so you shouldn't put any transaction statements in your scripts.

## Running Tests

To run the test suite, first invoke the following command within the repo, installing the development dependencies:

    $ npm install

Then run the tests:

    $ make test


## License

The MIT License (MIT)

Copyright (c) 2014 H.Levent KARAGÖL

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.