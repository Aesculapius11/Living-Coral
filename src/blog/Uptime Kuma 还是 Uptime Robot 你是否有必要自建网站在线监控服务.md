---
title: Uptime Kuma 还是 Uptime Robot 你是否有必要自建网站在线监控服务
description: 试用了下Uptime Robot的服务，并将其与自建的Uptime Kuma进行了对比，最后简单提了下如何自建Uptime Kuma。
date: 2025-10-28
tags: [Uptime, 网站, 服务器]
category: 杂项
keywords: [Uptime Kuma, Uptime Robot, 服务器, 在线监控服务, 网站]
author: 星辰曦羽
cover: https://img.antares.xin/assets/uptime/1.webp
layout: layouts/post.njk
---

## 前言
我有一台闲置的服务器，在那台服务器上我部署了Uptime Kuma来对我的某些网站进行监控，要是网站挂掉了、超时了什么的就给我发邮件或是发什么消息来通知我去检查下。考虑到那台服务器快到期了，我也就开始寻找有没有类似的免费服务可以供我白嫖，然后就看到了这个[Uptime Robot](https://uptimerobot.com/)。  
简单体验下来，Uptime Robot的免费功能也算是够用了，50个监控对象，每5分钟进行一次检测，发生错误发通知之类的，但是在部分功能上（更多的通知方式，更多的监控类型，更短的检测时间，SSL证书检测）还是缺了一点。

> * Uptime Robot 是 SaaS 服务，易于上手，提供免费计划，支持多种监控类型和通知方式。优点是使用方便，无需自己搭建服务器，适合快速搭建监控的个人或团队。缺点是免费计划监控间隔较长，高级功能需要付费。
> * Uptime Kuma 是开源自托管工具，完全免费，可以自定义监控功能。优点是数据存储在自己的服务器上，更安全，监控间隔自定义。缺点是需要自己搭建和维护服务器，适合有一定技术能力，需要自定义监控的用户。

## 具体区别
二者其实没有特别大的区别，我就提几个我认为影响比较大的区别。  
1. 监控数量：  
Uptime Robot免费版的监控数量上限为50个，Uptime Kuma无上限。
2. 监控类型： 
Uptime Robot的监控类型只有四种：网站监控、关键词监控、Ping监控、端口监控；Uptime Kuma的监控类型就多得多了。  
{% image "https://img.antares.xin/assets/uptime/3.webp", "Uptime Kuma" %}    
3. 心跳时间：  
Uptime Robot的免费版的最低检测时间为5分钟，Uptime Kuma最低的检测时间可以调到1秒。  
{% image "https://img.antares.xin/assets/uptime/2.webp", "Uptime Robot" %}  
4. 通知方式：  
Uptime Robot免费版只支持邮件和手机APP方式通知，Uptime Kuma支持的通知方式很多，我自己用的通知方式为邮件和钉钉机器人。
{% image "https://img.antares.xin/assets/uptime/4.webp", "Uptime Kuma" %}  
5. SSL证书检测：  
Uptime Robot免费版不支持，Uptime Kuma可以。

这个时候肯定有人要说，你拿Uptime Robot免费的服务和你自己买了服务器搭建的Uptime Kuma作对比，这公平吗？  
这样说也是。  
不过嘛~   
Uptime Kuma也不是不能白嫖，可以通过[ClawCloud Run](https://run.claw.cloud/)的免费容器来部署一个Uptime Kuma。（只不过ClawCloud Run免费版的可用性挺差的）

>ClawCloud Run 是一个类似于 Vercel、Netlify 的轻应用平台，可以快速部署各种项目。用户注册即送 5 刀额度，绑定 180 天 Github 账号可享受每月 5 美元额度，5美元的额度可以无限续杯Uptime Kuma了。  

总而言之，如果你只需要简单的检测网站的话，Uptime Robot 已经是绰绰有余的了。  
{% image "https://img.antares.xin/assets/uptime/1.webp", "Uptime Robot" %}  

## 其他
简单再讲一下有关Uptime Kuma的搭建吧。  
这项目的搭建其实蛮方便的，也是用Docker的方式进行安装，去[Uptime Kuma](https://github.com/louislam/uptime-kuma)官方仓库下面找到安装方式，直接复制命令执行就行了。
```shell
mkdir uptime-kuma
cd uptime-kuma
curl -o compose.yaml https://raw.githubusercontent.com/louislam/uptime-kuma/master/compose.yaml
docker compose up -d
```
{% image "https://img.antares.xin/assets/uptime/5.webp", "安装命令" %}  
安装完成后去3001端口就可以访问到控制台了，要用https的就再用nginx套一下整上SSL证书就行了。  

再提一下我碰到的一个小问题，我用的是阿里的云服务器，本来想用一种奇技淫巧来规避云服务商对未备案域名拦截的（网站放到除了80、443端口以外的其他端口，然后再用Cloudflare的Origin Rules把端口重写过去，这样就可以去掉域名后面的端口了）但是死活不行，Cloudflare一直报 525 SSL 握手失败，给我整麻了，后面才发现是被阿里云拦截了（阿里云全端口阻拦未备案域名）  
现在只能带着端口用，SSL证书也得去自己签（我以前一直都是用Cloudflare的源服务器证书的，签一次用十年，现在只能自己去签，虽然有自动化工具，但是我那自动化搞得有点奇怪，就不误人子弟了）