---
title: 自建Linkwarden——开源、自托管的协作式书签管理工具
description: 自建Linkwarden，实现网页内容存档，妈妈再也不用担心我收藏的网站消失了。
date: 2026-04-18
tags: [书签, 服务器]
category: 杂项
keywords: [书签, Linkwarden]
author: 星辰曦羽
cover: https://img.antares.xin/assets/link/1.webp
layout: layouts/post.njk
---
## 前言
这两天闲的没事整个了Linkwarden来玩玩。Linkwarden是个啥东东呢？简单来说，Linkwarden 是一款开源、自托管的协作式书签管理工具，它可以帮你实现网页内容存档,当你保存一个链接时，它会自动抓取该网页并生成截图、PDF 文件、网页文件，妈妈再也不用担心我收藏的网站消失了。  
{% image "https://img.antares.xin/assets/link/1.webp", "官网" %}   
## 部署

部署依然是采取Docker Compose的方式进行部署，基本没踩到什么坑，具体内容可以参考[官方文档](https://docs.linkwarden.app/self-hosting/installation)。
### 下载所需文件
```bash
mkdir linkwarden && cd linkwarden
curl -O https://raw.githubusercontent.com/linkwarden/linkwarden/refs/heads/main/docker-compose.yml
curl -L https://raw.githubusercontent.com/linkwarden/linkwarden/refs/heads/main/.env.sample -o ".env"
```
### 编辑环境变量
`vim .env`

所需的环境变量包括：
```bash
NEXTAUTH_URL=http://localhost:3000/api/v1/auth
NEXTAUTH_SECRET=VERY_SENSITIVE_SECRET
MEILI_MASTER_KEY=VERY_SENSITIVE_MEILI_MASTER_KEY
POSTGRES_PASSWORD=CUSTOM_POSTGRES_PASSWORD
```
>这里唯一必须更改的是NEXTAUTH_SECRET 、POSTGRES_PASSWORD 和MEILI_MASTER_KEY ，它们都应该是不同的秘密短语。如果使用特殊字符，短语应用单引号或双引号包裹。

以上是官方文档的说明，它的这个.env文件其实看起来有点复杂的，但是实际上真正必须要修改的也就是只有NEXTAUTH_SECRET、POSTGRES_PASSWORD和MEILI_MASTER_KEY这仨的值，随便找个密码生成器或是脸滚键盘一段内容进去即可。
需要注意的是MEILI_MASTER_KEY的值的设置在比较下面的地方，如果没设置三个值就开了会导致容器开不起来，一直循环重启，需要删除容器重新部署。
{% image "https://img.antares.xin/assets/link/3.png", "env" %}   
{% image "https://img.antares.xin/assets/link/4.png", "env" %}   
最后输入`docker compose up`运行即可。  

## 最终效果
最终实现的效果如下  
{% image "https://img.antares.xin/assets/link/5.webp", "效果" %}  
他这个应用也有移动端的软件版本，只需要修改服务器地址再加上你的用户名密码就能登录了。
{% image "https://img.antares.xin/assets/link/6.webp", "效果" %}  