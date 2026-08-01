---
title: 狠狠榨干大善人，用Cloudflare免费部署一个容量高达7TB的图床
description: 狠狠榨干大善人，无需绑卡，借助hugging face的仓库，用Cloudflare免费部署一个容量高达7TB的图床。
date: 2026-08-01
tags: [Cloudflare, 图床, HuggingFace]
category: 白嫖怪出发
keywords: [Cloudflare, 图床, HuggingFace]
author: 星辰曦羽
cover: https://img.antares.xin/assets/cfib/1.webp
layout: layouts/post.njk
---


## 前言
狠狠榨干大善人，无需绑卡，借助hugging face的仓库，用Cloudflare免费部署一个容量高达7TB的图床。这次分享的项目是Cloudflare-imgbed  

> 支持 Docker 与 Serverless 部署的开源文件托管方案，兼容多种存储后端，并提供 RESTful API 与 WebDAV 支持。

{% image "https://img.antares.xin/assets/cfib/1.webp", "image" %}  

先讲我的需求，我这个项目是部署在Cloudflare worker上的静态网站，对于图片资源，由于我不怎么想用r2（毕竟有被刷的风险）所以我是将它放在一个另外的仓库，然后再用Cloudflare Worker优选，总的来说也能用，就是存在一个限制，即文件的大小不能超过25M（不过正常来说图片也不会超过25M的）  
前段时间我想上传一段小视频[悲报：我服于2025年9月24日轻而易举](https://www.antares.xin/blog/%E6%82%B2%E6%8A%A5%EF%BC%9A%E6%88%91%E6%9C%8D%E4%BA%8E2025%E5%B9%B49%E6%9C%8824%E6%97%A5%E8%BD%BB%E8%80%8C%E6%98%93%E4%B8%BE/)但是想要上传视频还是有一点麻烦的，分辨率、码率、帧数都需要让位于文件大小，还是有一点麻烦的，这个项目就可以解决大文件上传的问题。
## 准备工作
本次我选择的部署方式为Cloudflare worker+Cloudflare kv  
需要提早准备的账号为：
1. [Cloudflare](https://www.cloudflare.com/) 账号

2. [GitHub](https://github.com/) 账号

3. [Huggingface](https://huggingface.co/)账号  

参考的官方文档为：
[官方文档](https://cfbed.sanyue.de/deployment/worker.html)

## 部署
1. 准备内容  
打开Cloudflare Dashboard，点击右上角小人，点击配置文件，左边选择API令牌，右上角创建令牌，直接选择worker模板。  
{% image "https://img.antares.xin/assets/cfib/6.webp", "image" %}  
{% image "https://img.antares.xin/assets/cfib/2.webp", "image" %}  
随便打开一个域名，在右下角找到你的Cloudflare 账号id  
{% image "https://img.antares.xin/assets/cfib/3.webp", "image" %}  
回到Cloudflare Dashboard主界面，在左边菜单栏选择存储与数据库，打开Workers KV，创建kv数据库，名称填img_url，将kv数据库id记下来  
{% image "https://img.antares.xin/assets/cfib/4.webp", "image" %}  
回到hugging face，点击右上角头像选择Access tokens，token类型选择write  
{% image "https://img.antares.xin/assets/cfib/5.webp", "image" %}  
2. fork项目  
回到[官方仓库](https://github.com/MarSeventh/CloudFlare-ImgBed)，选择fork项目  
{% image "https://img.antares.xin/assets/cfib/7.webp", "image" %}  
在你fork后的github项目里的secret设置必要的数值  
{% image "https://img.antares.xin/assets/cfib/8.webp", "image" %}  
将刚才创建的Cloudflare的API令牌和Cloudflare账号id以及kvid输进去
{% image "https://img.antares.xin/assets/cfib/9.webp", "image" %}  
3. 在GitHub Actions中启动部署
来到GitHub Actions，运行Deploy to Cloudflare Workers这一个workflow  
{% image "https://img.antares.xin/assets/cfib/10.webp", "image" %}  
等一段时间，回到Cloudflare Workers，这边就能看到刚才部署的
cloudflare-imgbed了。
{% image "https://img.antares.xin/assets/cfib/12.webp", "image" %}  
想要用自己域名的就可以在在路由这里设置你想用的域名。
{% image "https://img.antares.xin/assets/cfib/11.webp", "image" %}  
在dns解析可以直接用社区优选后的域名，这边我直接cname到这个域名。  
{% image "https://img.antares.xin/assets/cfib/13.webp", "image" %}  
4. 启用 设置  
打开你的网站，通过/dashboard进入管理界面
先切到系统设置，在系统设置下的安全设置里设置管理的账号与密码  
添加渠道，这边就使用hugging face，输入刚才创建的token，仓库名称就是你的用户名加上你希望的仓库名称，渠道名称可以随便写。  
{% image "https://img.antares.xin/assets/cfib/14.webp", "image" %}  
> 公开仓库最大可用容量为7TB，私有仓库可用容量为100GB

## 结语
以上就是部署Cloudflare-imgbed的具体内容了，一路部署下来没有碰到任何坑，还是很不错的。  
设置里还有许多其他的功能，设置压缩、设置默认上传渠道、设置域名过滤、设置审查等等等等，大家可以按需开启，这边就不一一列举了，具体的功能还是详见官方文档。

