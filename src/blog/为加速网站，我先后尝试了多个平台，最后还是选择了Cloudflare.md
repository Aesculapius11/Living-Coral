---
title: 为加速网站，我先后尝试了多个平台，最后还是选择了Cloudflare
description: 我之前试着用Vercel和Netlify来构建这个站点，也尝试了对Vercel和Netlify进行优选，但是总感觉效果不明显，最终还是选择了Cloudflare加上Cname优选来加速本站
date: 2025-10-20
tags: [Cloudflare, CDN, 网站]
category: 杂项
keywords: [Cloudflare, 网站, CDN]
author: 星辰曦羽
cover: https://img.antares.xin/assets/cloudflare/1.webp
layout: layouts/post.njk
---
## 前言
我这个网站之前一直是用Cloudflare Pages的方式部署的，毕竟Cloudflare部署起来方便而且安全，但是这个速度真的有点难蚌，之后就尝试性的把网站搬到了Vercel和Netlify上，这俩平时的速度还是不错的，但是一到晚上用网高峰期，这个服务器响应速度实在是慢的离谱，完全不是一个可用的状态(我感觉和我自己的网络也确实有点关系)  
为解决这个问题，我去用了一下L站大佬做的优选加速[CF、Vercel、Netlify 优选IP加速](https://linux.do/t/topic/128871)，也确实牛逼，可以将Netlify和Vercel部署的站点合成一个来使用。但是比较遗憾的是还是没有非常好的改善，不是说大佬的优选不好，可能是我自己的网络问题。  
`verlify-cname.xingpingcn.top`  
{% image "https://img.antares.xin/assets/cloudflare/2.webp", "verlify" %}  
之后我又去尝试了下EdgeOne的优选，但是不知道为什么一直报一个418的错误。试了半天没成功，最后还是乖乖滚回去用Cloudflare了，毕竟Cloudflare还是相对省心。  
## Cloudflare Workers 优选
这次从Cloudflare Pages改成了Cloudflare Workers，主要原因也是Workers的优选更加方便，而且Workers可以兼容原来的Pages的功能，仅需要多添加一个文件在根目录。只需要改一下名字和构建出来的文件上传路径即可，时间改不改无所谓。  
```json
  {
    "name": "living-coral-cfworker",
    "compatibility_date": "2025-10-17",
    "assets": {
     "directory": "./_site",
     "not_found_handling": "404-page"
  }
}
```
{% image "https://img.antares.xin/assets/cloudflare/3.webp", "wrangler.jsonc" %}  

设置路由，然后让这个域名记录随便指向一个现成的优选Cname即可.  
[CloudFlare优选Cname域名](https://www.wetest.vip/page/cloudflare/cname.html)  
{% image "https://img.antares.xin/assets/cloudflare/4.webp", "设置路由" %}  
{% image "https://img.antares.xin/assets/cloudflare/5.webp", "设置Cname" %}  
## 结语
这是晚上七点左右的测试结果，看起来蛮好的，兜兜转转又回到Cloudflare上了，先就这样吧~  
{% image "https://img.antares.xin/assets/cloudflare/6.webp", "网站测速" %}  
