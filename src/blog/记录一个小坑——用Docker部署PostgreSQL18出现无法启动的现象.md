---
title: 记录一个小坑——用Docker部署PostgreSQL 18 出现无法启动的现象
description: 用Docker部署PostgreSQL 18 遇到了无法启动，循环Restarting。PostgreSQL 18+ 版本的 Docker 镜像需要将单独的卷挂载到容器的 /var/lib/postgresql 目录。
date: 2026-03-13
tags: [PostgreSQL, Docker, Ubuntu]
category: 技术
keywords: [PostgreSQL, Docker, Ubuntu]
author: 星辰曦羽
cover: https://img.antares.xin/assets/pg18/1.webp
layout: layouts/post.njk
---

## 错误背景

第一次接触PostgreSQL这个数据库，打算用Docker Compose来启动PostgreSQL，安装的版本为PostgreSQL18   
新建了一个`.env`文件来放环境变量  

```
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin123
POSTGRES_DB=exampledb
POSTGRES_PORT=5432
```

再新建一个`docker-compose.yml`文件来写配置  

```dockerfile
version: '3.8'
services:
 postgres:
   image: postgres:18
   container_name: postgres18
   restart: always
   env_file:
     - .env
   ports:
     - "${POSTGRES_PORT}:5432"
   volumes:
     - ./pgdata:/var/lib/postgresql/data
     - ./log:/var/log/postgresql
   networks:
     - postgres_net
networks:
 postgres_net:
   driver: bridge
```

执行`docker-compose up -d`后就一直出现`Restarting`   
查看日志后发现

```log
Error: in 18+, these Docker images are configured to store database data in a
       format which is compatible with "pg_ctlcluster" (specifically, using
       major-version-specific directory names).  This better reflects how
       PostgreSQL itself works, and how upgrades are to be performed.

       See also https://github.com/docker-library/postgres/pull/1259

       Counter to that, there appears to be PostgreSQL data in:
         /var/lib/postgresql/data

       This is usually the result of upgrading the Docker image without
       upgrading the underlying database using "pg_upgrade" (which requires both
       versions).

       The suggested container configuration for 18+ is to place a single mount
       at /var/lib/postgresql which will then place PostgreSQL data in a
       subdirectory, allowing usage of "pg_upgrade --link" without mount point
       boundary issues.

       See https://github.com/docker-library/postgres/issues/37 for a (long)
       discussion around this process, and suggestions for how to do so.
```

{% image "https://img.antares.xin/assets/pg18/2.png", "log" %}   

我去查了一下这是什么错误，结果发现这看起来是PostgreSQL 17 升级到PostgreSQL 18 时候会发生的错误，这就很奇怪了，明明我是新装的数据库，怎么要升级了？

## 错误原因

简单来说就是PostgreSQL 18+ 版本的Docker镜像期望你将一个单独的卷挂载到容器的 /var/lib/postgresql 目录，而不是像之前那样挂载到其内部的子目录 /var/lib/postgresql/data。这样做是为了兼容pg_ctlcluster和方便未来升级。   

先删除`pgdata`文件夹再修改`docker-compose.yml`文件  

```dockerfile
version: '3.8'
services:
 postgres:
   image: postgres:18
   container_name: postgres18
   restart: always
   env_file:
     - .env
   ports:
     - "${POSTGRES_PORT}:5432"
   volumes:
     - ./pgdata:/var/lib/postgresql
     - ./log:/var/log/postgresql
   networks:
     - postgres_net
networks:
 postgres_net:
   driver: bridge
```

再执行`docker-compose up -d`就可以了