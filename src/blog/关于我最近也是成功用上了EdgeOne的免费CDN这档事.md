---
title: 关于我最近也是成功用上了EdgeOne的免费CDN这档事
description: EdgeOne出了个白嫖两个套餐的活动，我可以不用，但是不能不白嫖🤤
date: 2025-07-30
tags: [EdgeOne, CDN]
category: 白嫖怪出发
author: 星辰曦羽
cover: https://img.antares.xin/EdgeOne-1/1.webp
layout: layouts/post.njk
---
## 引言
事情是这样的，我的网站基本上都是套了一层Cloudflare来保护，但是Cloudflare在国内的速度真的有点绷不住，安全是安全了，但是使用体验也是真的差。其实我很早就看到了EdgeOne相关的内容，一开始我是不打算搞的，因为他需要去X发帖什么的，我懒得搞，于是就搁置下了，直到前几天发现EdgeOne不需要发帖就可以领两个免费套餐。秉持着我可以不用但我不能没有的喜加一精神，我也去领了两个免费套餐来玩玩。

EdgeOne免费套餐领取链接：[测速分享，解锁更多 EdgeOne 免费套餐](https://edgeone.ai/zh/get-free-plan)

![image](https://img.antares.xin/EdgeOne-1/2.webp)

他需要在测速后分享到X和Facebook，但是实际上你只要点一下那个按钮就可以了，不需要真的分享。

其实用起来效果还可以，比原来快多了，而且这个免费套餐自带无限的流量，就是不知道未来会不会被砍。

在使用中发现有些时候它的数据还是需要从源站（Cloudflare）上拉取，但是去Cloudflare上绕一下就会很慢，可能要五六秒才能传来第一个数据，所以我就在EdgeOne的WordPress加速规则的基础上新增了两条规则：

1. 通过HTTP请求头是否存在wordpress_logged_in_来判断用户是否登录，如果没登录就给用户缓存后的界面，如果用户登录了就不缓存。
2. 缓存结尾所有为/的界面（排除wp-admin后的界面）


![image](https://img.antares.xin/EdgeOne-1/3.webp)


今天看网站后台发现有很多流量从源站直接进行访问了，因为我并不想让他们从Cloudflare的源站去访问，于是我就在Cloudflare上设置源站必须通过EdgeOne才能访问。在Cloudflare里写一个自定义安全规则，检查所有访问源站的流量是不是通过CDN去访问的，如果不是就把他们全部阻止。

![image](https://img.antares.xin/EdgeOne-1/4.webp)


![image](https://img.antares.xin/EdgeOne-1/5.webp)


现在先就这样吧，如果出现其他问题了再搞再来补充吧