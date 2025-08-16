---
title: 简单讲一下最近用ClawCloud Run所碰到的问题（不是哥们你怎么这么慢啊）
description: ClawCloud Run，这玩意儿是一个类似于 Vercel、Netlify 的轻应用平台，可以快速部署各种项目。但是这个平台速度很慢，通过套上EdgeOne来缓解这个问题。
date: 2025-08-01
tags: [爪子云, CDN]
category: 白嫖怪出发
author: 星辰曦羽
cover: https://img.antares.xin/claw-1/1.webp
layout: layouts/post.njk
---
## 前言
先简单介绍下ClawCloud Run，这玩意儿是一个类似于 Vercel、Netlify 的轻应用平台，可以快速部署各种项目。用户注册即送 5 刀额度，绑定 180 天 Github 账号可享受每月 5 美元额度，5美元的额度可以无限续杯一些小项目，还是蛮好用的。

这个平台基本上是开箱即用的，点几下鼠标就可以完成应用的部署，蛮方便的。具体的部署可以参考下这位大佬的视频[【免费容器部署平台，玩转AI客户端，工作流，alist， 数据库….】](https://www.bilibili.com/video/BV1zKVtzFEQH/)

## 我碰到的问题
1、日本和新加坡节点慢到爆炸，不过现在又相对好一点了。之前还出现过部署的项目突然消失的情况（面板里消失，但是实际上还能访问）。我一开始也想部署在日本和新加坡节点，毕竟这俩节点相比美国和德国，在国内应该会有一个相对较好的表现吧。但是结果就是，慢到爆炸……

![image](https://img.antares.xin/claw-1/0.webp)

2、自定义域名的ssl证书签发也是慢到爆炸……如果你看到这玩意儿一直卡在Pending，请不要担心，这是正常现象，过一段时间（一两天或许）就能部署下来了。在Pending中，网站的80端口（http）是可以访问的，但是443（https）不行。

![image](https://img.antares.xin/claw-1/2.webp)

2.5、我之前在ssl证书没签下来的时候就把Cloudflare的代理小黄云打开了，这个时候他这个Pending会变成Available，但是呢，嘿，您猜怎么着，这玩意儿是个假的。我那时候以为终于签下来了，结果去访问给我报一个525错误……如果真要用Cloudflare代理的话也需要等他把ssl证书签下来，或是在Cloudflare里把加密模式改成灵活，让Cloudflare从80端口去访问源站。

![image](https://img.antares.xin/claw-1/3.webp)

3、慢到爆炸……这玩意儿，不管我是开Cloudflare的小黄云还是不开Cloudflare的小黄云，访问网站都慢的离谱，绝大部分情况是不开代理就是个根本不能用的状态。这不是前几天不是白嫖了EdgeOne嘛，我也是把这个网站套了层EdgeOne的CDN，总之现在终于是一个能接受的水平了。

![image](https://img.antares.xin/claw-1/4.webp)

![image](https://img.antares.xin/claw-1/5.webp)

![image](https://img.antares.xin/claw-1/6.webp)

![image](https://img.antares.xin/claw-1/7.webp)



怎么说呢，从原来的加载3分钟到现在的10s……只能说EdgeOne雀实蛮好用的。