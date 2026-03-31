---
title: Moonlight IOS版本无法使用公网IPV4的解决方案
description: 作为一个曾经为了能够更爽的打游戏，从而始终扛着台式机箱往返于学校与家之间硬核狠人（冤种），在经历了买航空箱、换小机箱等一系列操作后，终于找到一个能够爽打游戏的串流方案。
date: 2026-03-31
tags: [串流, 游戏]
category: 杂项
keywords: [串流, 远程, 服务器, Sunshine, Moonlight]
author: 星辰曦羽
cover: https://img.antares.xin/assets/chuanliu/0.jpg
layout: layouts/post.njk
---
## 问题背景
这几天用串流的时候发现Moonlight的IOS版本无法用ipv4的公网来串流，输入公网ipv4地址会提示一个什么什么local，具体什么我忘记了。总之大意就是不能用公网IPV4串流，只能用局域网IPv4地址来串流。
## 解决方案
### 虚拟局域网
解决办法也蛮多的，可以安装虚拟局域网，例如zerotier、easytier之类的软件来解决。本来我是想通过安装easytier来组虚拟局域网来解决问题的，但是发现easytier似乎也没有专门的iOS版本，此路不通，只能找其他办法。
### IPV4转换为IPV6
最终的解决方案其实很简单，只要将IPV4转换成IPV6就行，iOS端的Moonlight虽然不支持公网IPV4，但是它可以支持IPV6，只需要将IPV4转换成IPV6输进去就行。  
{% image "https://img.antares.xin/assets/chuanliu/6.webp", "IPV4转换为IPV6" %}  
[IPv4转IPv6转换工具](https://www.bchrt.com/tools/ipv4-to-ipv6/)  
输入地址的时候需要用英文的中括号将IPV6地址框起来  
`[::ffff:7205:0e01]`  
如果用了自定义端口就应该改成  
`[::ffff:7205:0e01]:43210`

