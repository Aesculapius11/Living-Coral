---
title: 分享一个和ClawCloud Run相似的同类型产品——Zeabur
description: ClawCloud Run的可用性是一言难尽，这几天有看到一个新的可以用来部署免费容器的平台——Zeabur
date: 2025-11-18
tags: [Zeabur, 爪子云]
category: 白嫖怪出发
keywords: [爪子云, CDN, ClawCloud, Zeabur, 容器, 免费]
author: 星辰曦羽
cover: https://img.antares.xin/assets/zeabur/1.webp
layout: layouts/post.njk
---

## 什么是Zeabur

>Zeabur 是一个帮助开发者能够一键部署任何服务的 PaaS 平台，无论你的项目用什么编程语言或框架开发了前端、后端，无论你用了什么数据库，在 Zeabur 上都仅需一个按钮就能部署上线生产环境，方便的同时还降低了成本。    

我其实只是把它当免费容器用的，它和ClawCloud Run一样每个月有5美元的额度，这次来部署一下Uptime Kuma试试。


## 部署
使用这个平台的免费容器需要验证手机号，经过测试，+86的手机号是可以正常使用的。  

{% image "https://img.antares.xin/assets/zeabur/2.webp", "绑定手机号" %}   

在部署界面往下滚就能看到Uptime Kuma。点进去后就可以看到让你部署服务的位置。  

{% image "https://img.antares.xin/assets/zeabur/3.webp", "部署" %}   

免费容器可以选择的集群只有两个，一个是位于美国加州硅谷的腾讯云，一个是位于印度雅加达的火山引擎（好像是字节跳动旗下的，这个我不太熟）    

{% image "https://img.antares.xin/assets/zeabur/4.webp", "部署" %}   

部署还是蛮快的，大概一两分钟就部署完成了。加一个自定义域名，看看它部署自定义域名速度怎么样

{% image "https://img.antares.xin/assets/zeabur/5.webp", "部署" %}   

我挺满意的，一分钟不到就部署好了。这方面相比ClawCloud Run还是快了不少

{% image "https://img.antares.xin/assets/zeabur/6.webp", "部署" %}   

## 其他问题

费用方面，他并没有ClawCloud Run那样很清楚的对费用进行计算的方式，他只有一个根据内存来预计使用费用的方式，看起来应该是够用的。

{% image "https://img.antares.xin/assets/zeabur/7.webp", "费用" %}   

{% image "https://img.antares.xin/assets/zeabur/8.webp", "费用" %}   

速度方面，在对监控项的具体内容调整的时候能感受到明显的延迟，感觉有一点卡卡的。