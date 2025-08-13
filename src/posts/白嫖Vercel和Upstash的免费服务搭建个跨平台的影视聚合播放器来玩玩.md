---
title: 白嫖Vercel和Upstash的免费服务搭建个跨平台的影视聚合播放器来玩玩
description: 昨天刷B站的时候突然看到了一个蛮有意思的东西——Moon TV，简单看了下发现这玩意儿可以无服务器部署，而且部署方式蛮简单的，加上这个项目的界面还挺好看的，今天就顺手搭建一个来玩玩。
date: 2025-08-13
tags: [MoonTV, Vercel]
category: 好玩的项目
author: 星辰曦羽
cover: https://img.antares.xin/moontv/2.webp
layout: layouts/post.njk
---
## 前言
昨天刷B站的时候突然看到了一个蛮有意思的东西——Moon TV，简单看了下发现这玩意儿可以无服务器部署，而且部署方式蛮简单的，加上这个项目的界面还挺好看的，今天就顺手搭建一个来玩玩。
![MoonTV](https://img.antares.xin/moontv/1.webp)
![MoonTV](https://img.antares.xin/moontv/2.webp)
## 部署
### Fork MoonTV 仓库到你的 GitHub
![Fork 仓库](https://img.antares.xin/moontv/15.webp)
按理来说这一步应该是点个按钮就能完成的事情，但是有个问题就是我找不到他的原仓库，原仓库进去是404的，因此我只能退而求其次，在github上搜索了下MoonTV被Fork次数最多的仓库，然后去Fork了那个仓库……
![404](https://img.antares.xin/moontv/404.webp)
### 部署项目至Vercel
打开你Fork后的仓库往下拉至部署说明，这里的部署步骤非常详细，对着做就可以完成部署。
![部署](https://img.antares.xin/moontv/3.webp)
这次我使用的方法是Vercel+Upstash Redis的部署方式，这种方式是带数据库的，可以实现多账户、多端浏览记录同步等功能。
1. 注册并登录vercel
2. 新建项目并选中Fork后的仓库
![选择仓库](https://img.antares.xin/moontv/4.webp)
3. 设置环境变量（如果不需要数据库设置数据库，所以下一步我们先去创建数据库，先把这个界面放在一边）
![选择仓库](https://img.antares.xin/moontv/16.webp)
### 建立UPstash Redis 数据库
1. 注册并登录UPstash
2. 建立Redis数据库
![新建数据库](https://img.antares.xin/moontv/5.webp)
3. 随便输一个数据库名字，然后选择地域，我这边选择的是新加坡的节点
![新建数据库](https://img.antares.xin/moontv/6.webp)
4. 最后选择免费方案完成数据库创建
![新建数据库](https://img.antares.xin/moontv/7.webp)
5. 复制MoonTV需要的环境变量
![复制变量](https://img.antares.xin/moontv/8.webp)
### 设置环境变量关联数据库
再次回到Vercel，将复制的环境变量按照部署说明里的要求填入环境变量，然后设置你的用户名和密码即可完成部署。
![链接数据库](https://img.antares.xin/moontv/9.webp)
### 完成部署（绑定自定义域名）
部署完成后Vercel会给你这个界面，从这个链接就可以访问你的MoonTV了，如果你没有域名就可以通过这个链接进行访问，如果你有域名可以在设置里绑定你自己的域名。
![完成部署](https://img.antares.xin/moontv/10.webp)
![设置自定义域名](https://img.antares.xin/moontv/11.webp)
## 看下效果
浏览记录能保存，搜索能用，视频能看，OK了（他这个换源的地方可以实时看到节点的速度和延迟，这个蛮好用的）
![部署完成](https://img.antares.xin/moontv/20.webp)
![部署完成](https://img.antares.xin/moontv/21.webp)
![部署完成](https://img.antares.xin/moontv/22.webp)

最后提一嘴，它的管理设置界面是登录后网址后面输入/admin 后才能进入的（之前我在主菜单找了半天都没找到管理设置界面）
![部署完成](https://img.antares.xin/moontv/13.webp)