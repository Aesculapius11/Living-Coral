---
title: 自建Cloudreve——快速搭建起公私兼备的网盘系统
description: 自建Cloudreve，用自己的服务器（NAS）搭建安全可靠的网盘系统。
date: 2026-04-29
tags: [网盘, 服务器, Cloudreve]
category: 杂项
keywords: [网盘, Cloudreve]
author: 星辰曦羽
cover: https://img.antares.xin/assets/cloudreve/1.webp
layout: layouts/post.njk
---

## 前言
这段时间国内的云盘都加强了监管，境外未经授权的影视文件好多都要歇菜了，未来找资源怕是要越来越麻烦了…  
我之前有用过自建的云盘，那个时候用的是云服务器加上nextcloud，使用体验那叫一个一言难尽。先不提nextcloud速度慢的事情，就云服务器那个小水管上行带宽，下个大文件真的是要老命了。10M的上行，如果要下载文件，那就只有可怜的1.25MB每秒的下载速度。30M也只有3.75MB每秒的速度。看看这下载速度，再看看服务器的价格……一年几百……可能还真不如给云盘充会员来的划算。阿里倒是有一个最大带宽200M（共享带宽，高峰期速度就不行）99一年的服务器，我买过一次，但是没续费，所以我不清楚第二年续费是不是还是这个价格，不过我估计它是会涨价的就是了。  
所以对于自建云盘，我是极度不推荐的，毕竟你要用云盘那么服务器不可能只租一年，带宽低了自己给自己限速，带宽高了，成本飞起。不推荐归不推荐，还是讲一下我最近装着玩的一个自建云盘——Cloudreve  
> Cloudreve 可以让您快速搭建起公私兼备的网盘系统。Cloudreve 在底层支持不同的云存储平台，用户在实际使用时无须关心物理存储方式。你可以使用 Cloudreve 搭建个人用网盘、文件分享系统，亦或是针对大小团体的公有云系统。 
 
我自己的使用感受：界面好看，部署简单，全文搜索和缩略图功能可以正常使用，总的来说很不错。这玩意儿适合怎么样的用户呢？自己有个nas的，有公网ip的。这样的用户可以用起来很爽。
## 部署
部署依然是用docker compose。先来到[官方文档](https://docs.cloudreve.org/zh/overview/deploy/docker-compose)
先将必要的文件下载到本地
```bash
git clone
https://github.com/cloudreve/docker-compose.git
~/cloudreve
cd ~/cloudreve
```
复制env文件
```bash
cp .env.example .env
```
生成密钥  
{% image "https://img.antares.xin/assets/cloudreve/2.png", "密钥" %}  
```bash
# 生成 Master Key
openssl rand -hex 32

# 编辑 .env 文件，设置 MEILI_MASTER_KEY=<生成的密钥>
```
编辑环境变量，把生成的密钥粘贴进去   
```bash
sudo vim .env
```
{% image "https://img.antares.xin/assets/cloudreve/3.png", "密钥" %}  
最后，docker～启动！  
`docker compose -f docker-compose.yml -f docker-compose.fts.yml up -d`
不报错就部署完成了  
访问http://localhost:5212就能看到Cloudreve了  
{% image "https://img.antares.xin/assets/cloudreve/4.webp", "主菜单" %}  
之后的部分就和普通的网盘操作一样了，注册、设置密码、上传、下载……这边我就不赘述了