# Ben Awad's project

This project is very much inspired by this video by Ben Awad : [Youtube](https://www.youtube.com/watch?v=25GS0MLT8JU)

## Stack

- nodejs
- Apollo graphql
- typescript
- typeorm
- typegraphql
- ReactJS

You'll need :

- postgres database installed

## Advices

- Visual Studio Code for editing, with Vim mode if you're familiar with it

## Create the server

1. We create a 'server' directory and work in it

```shell
mkdir server
cd server
```

Then we install the project using typeorm cli (handy in this case... bu we'll change many thing along the way)

```shell
npx typeorm init --name server --database postgres
```

Install the Ben's tsconfig !

```shell
npx tsconfig.json
```

## Create the database

With postgres v11

Create the database user

```shell
$ createuser -dle -P test
Enter password for new role:
Enter it again:
SELECT pg_catalog.set_config('search_path', '', false)
CREATE ROLE test PASSWORD 'md505a671c66aefea124cc08b76ea6d30bb' NOSUPERUSER CREATEDB NOCREATEROLE INHERIT LOGIN;
```

Create the database :

```shell
$ createdb -e -O test jwt-auth-example
SELECT pg_catalog.set_config('search_path', '', false)
CREATE DATABASE "jwt-auth-example" OWNER test;
```

Test your database

```shell
psql -d jwt-auth-example -U test -W
psql (11.5)
Type "help" for help.

jwt-auth-example=> create table testtable (id bigint);
CREATE TABLE
jwt-auth-example=> drop table testtable;
DROP TABLE
jwt-auth-example=> \du
                                   List of roles
 Role name |                         Attributes                         | Member of
-----------+------------------------------------------------------------+-----------
 batchdb   | Create DB                                                  | {}
 kinto     |                                                            | {}
 test      | Create DB                                                  | {}
 vincent   | Superuser, Create role, Create DB, Replication, Bypass RLS | {}

jwt-auth-example=> \q
```
