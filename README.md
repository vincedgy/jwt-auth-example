# Ben Awad's JWT-AUTH-EXAMPLE project

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

### Testing

With HTTPie

```shell
http POST 'http://localhost:4000/graphql' query="mutation {login(email: \"bob.bobo@gmail.com\", password: \"bob\") {accessToken}}"

HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 225
Content-Type: application/json; charset=utf-8
Date: Wed, 20 Nov 2019 06:08:01 GMT
ETag: W/"e1-jT5FIBeb0PgMndeZMqsjLNAhbbM"
Set-Cookie: jid=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJFbWFpbCI6ImJvYi5ib2JvQGdtYWlsLmNvbSIsImlhdCI6MTU3NDIzMDA4MSwiZXhwIjoxNTc0ODM0ODgxfQ.cUbq-VrRHBMu0cT_-v8C-abYL6SfhoK3J4pzGY3k1B8; Path=/; HttpOnly
X-Powered-By: Express

{
    "data": {
        "login": {
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJFbWFpbCI6ImJvYi5ib2JvQGdtYWlsLmNvbSIsImlhdCI6MTU3NDIzMDA4MSwiZXhwIjoxNTc0MjMwOTgxfQ.4ov_Z3GwoPwiDYqK3Nqd55xhN1ET0DTE76Yo4-K3_7A"
        }
    }
}
```

With cURL

```shell

curl -vvv 'http://localhost:4000/graphql' -H 'Content-Type: application/json' -H 'Accept: application/json' --data-binary '{"query":"mutation {login(email: \"bob.bobo@gmail.com\", password: \"bob\") {accessToken}}"}'

*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 4000 (#0)
> POST /graphql HTTP/1.1
> Host: localhost:4000
> User-Agent: curl/7.64.1
> Content-Type: application/json
> Accept: application/json
> Content-Length: 92
>
* upload completely sent off: 92 out of 92 bytes
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Set-Cookie: jid=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJFbWFpbCI6ImJvYi5ib2JvQGdtYWlsLmNvbSIsImlhdCI6MTU3NDIyOTcwNiwiZXhwIjoxNTc0ODM0NTA2fQ.7ZrfZoQJeRamx3G-1jZw6YYixs8Fni3Ef0w67vC9R8c; Path=/; HttpOnly
< Content-Type: application/json; charset=utf-8
< Content-Length: 225
< ETag: W/"e1-4kIecEQv8sMXXEnlhWwzno9YJ54"
< Date: Wed, 20 Nov 2019 06:01:46 GMT
< Connection: keep-alive
<
{"data":{"login":{"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJFbWFpbCI6ImJvYi5ib2JvQGdtYWlsLmNvbSIsImlhdCI6MTU3NDIyOTcwNiwiZXhwIjoxNTc0MjMwNjA2fQ.qXQhE9A0vTvVIz2j7Za1i3hiQikE8PobOceEj2YJ2f0"}}}
* Connection #0 to host localhost left intact
* Closing connection 0

```