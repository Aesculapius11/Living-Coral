---
title: 串流实验——moonlight最高码率调整至500M
description: 我的方案：千兆内网，主力游戏机5900X+3070，串流瘦客户机 Surface Pro 7 8GB 256版本，外接显示器 1920*1080 240HZ
date: 2026-07-12
tags: [串流, 游戏, Moonlight]
category: 杂项
keywords: [串流, 远程, 服务器, Sunshine, Moonlight]
author: 星辰曦羽
cover: https://img.antares.xin/assets/moonlight/4.webp
layout: layouts/post.njk
---

## 前言
先讲我碰到的问题吧，最近这段时间一直在用串流打游戏，由于码率的限制，最高就150M，导致我打游戏(FPS)的时候一直感觉远处很糊，看不清人。于是这段时间一直在研究如何在不增加延迟的情况下提高画质。  
{% image "https://img.antares.xin/assets/moonlight/1.webp", "moonlight" %}  

## 解决办法
其实就是我犯蠢了，没看到Moonlight下面有个解锁码率限制的设置，只要勾上它，码率就能解锁到500M，远点也确实看得清了。  
{% image "https://img.antares.xin/assets/moonlight/2.webp", "moonlight" %}  
{% image "https://img.antares.xin/assets/moonlight/3.webp", "moonlight" %}  
就这么简单~  
一开始我尝试了在sunshine里改编码器的性能预设，从P1改到P2，编码延迟从2ms左右提升到3ms左右，但是画质看不出什么明显的区别，解码时间倒是也没有什么区别。  
在将码率调到500M后，编码延迟依旧在2ms左右，解码延迟从0.2ms左右上升到0.5左右，完全可以接受，且画质得到大幅度提升。  
不过我也确实碰到了性能问题，surface的散热能力还是弱，玩久了会降频，出现间歇性的卡顿，解码时间会从1ms不到飙升至20ms-30ms，完全不可玩，降低到150M的码率，解码延迟问题依旧存在。之后问题越来越大，平均解码时间从1ms不到飙升到20ms。  
解决办法是找个小风扇给它吹一吹，把电源模式从平衡改到高性能就能完美解决问题，
