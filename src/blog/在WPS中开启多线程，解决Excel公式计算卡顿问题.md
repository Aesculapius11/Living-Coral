---
title: 在WPS中开启多线程，解决Excel公式计算卡顿问题
description: 由于工作的原因，会用到很多数据和公式较多的excel表格，用起来奇卡无比。目前有三个解决方案可以来解决数据和公式导致的卡顿问题。
date: 2026-08-17
tags: [Cloudflare, CDN, 优选]
category: 杂项
keywords: [Cloudflare, 网站, CDN, 优选]
author: 星辰曦羽
cover: https://img.antares.xin/assets/wps/3.webp
layout: layouts/post.njk
---
## 前言
事情是这样的，由于工作的原因，会用到很多数据和公式较多的excel表格，用起来奇卡无比。并且由于公式中带有大量INDIRECT函数，导致我调整一个数字，就要重算半天，一重算就巨卡。

## 解决方案
第一个解决方案是去调整计算选项的计算方式，从自动计算改成收到计算，改完数字再统一计算。有点用，至少改数字的时候不卡了，但是最后计算还是要卡好久。

{% image "https://img.antares.xin/assets/wps/4.webp", "image" %}  

第二个解决方案是重新改公式，但是嘛这个公式已经用了很久了，已经是屎山代码了，再改再重写好麻烦的，它既然能work我就不想去动它。

第三个解决办法就是开多线程了。说真的，我一直以为多线程功能是默认开启的，右下角在计算的时候我也是看到它显示了“计算中：（12个线程）”

但是实际上它是没有开的！！！

开启办法就是在文件—选项—重新计算这里，把这个启用多线程计算勾上就行了。
{% image "https://img.antares.xin/assets/wps/3.webp", "image" %}  
## 效果
最终的效果如下  
{% image "https://img.antares.xin/assets/wps/1.webp", "image" %}  
{% image "https://img.antares.xin/assets/wps/2.webp", "image" %}  
600多万次计算时间从20000ms+压缩到5000ms不到，这个结果我可以接受了。