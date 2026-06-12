---
title: AI真好用，嘻嘻😁
description: AI是光明的，有未来的，是能够提高生产力，催化出百年未有之大变局的，带领人类进入新时代的优秀妙妙工具！
date: 2026-06-13
tags: [AI, 杂谈]
category: 杂项
keywords: [AI, Deepseek, GPT, Claude]
author: 星辰曦羽
cover: https://img.antares.xin/assets/ai/0.webp
layout: layouts/post.njk
---

## 前言
哎呀～也是好久没更新了，最近忙着玩ai去了。不得不说，现在的ai是越来越好用了，给ai下个任务，让他慢慢跑着，我去刷会儿手机看会儿视频玩会儿游戏，等我回来听他给我汇报，汇报完成后再给他部署下一个任务，这就是当领导的感觉吗，爱了爱了（bushi）  
这一期内容主要是一期杂谈（流水账），分享一下最近捯饬了什么。

## 国产模型蒸蒸日上
我一开始用的是deepseek v4，用deepseek得主要原因就是他便宜，让openclaw蹬也蹬得起，再加上前段时间deepseek临时折扣变永久折扣，梁圣的恩情还不完，性价比这一块儿没得比。  
讲完梁圣讲雷圣，小米mimo整了个什么万亿token大补贴，申请就能拿到免费的token用，我运气很好，拿到了最高的一档。虽然之后整了个文字游戏，把token换成了credit，看着数字大了（800多亿）实际上没多少。    
{% image "https://img.antares.xin/assets/ai/4.webp", "mimo" %}  
mimo 2.5 pro我用下的主要感觉就是慢，巨慢，非常慢。我最开始给他接入到openclaw里，问个问题半天不回话我还以为是我没配置好，后面发现纯粹是慢。智力方面我估摸着也就和deepseek差不多的一个水平，属于是勉强够用。但是嘛，免费的，要什么自行车。  

## 小龙虾与vscode
openclaw是最早部署的，一开始只整了个main agent接入到QQ让他帮我搞eve online相关的内容。查一查利润，算一算账单，总的来说干的还不错。之后闲的没事我又把这玩意儿接到了微信，整了个work的agent，让他帮我处理一些工作上的事情。一开始我纯粹是把他当大号备忘录来用的，给他几个我之前写的备忘录文件让他读一读，txt、doc、excel什么的都是可以正常读取的，有点用处但是不多。  
前段时间我就决定给年轻ai加点担子，我又给了他一点核对任务，主要是核对excel表格里各个工作表的数据，总的来说还是完成的不错，真的找出了几个我没发现的问题（当然也有我发现了，但是ai没发现的问题，ai最大的问题主要是找不全，加上会误报）  
由于我接的是mimo，速度巨慢，跑稍微重一点的任务起码十五分钟起步。还有一个问题就是传大文件有问题，有时候会传不过去，我的解决方案简单粗暴，直接用ssh连到服务器上把文件丢过去，然后告诉ai文件在哪就行。  
我的电脑装了sunshine供我远程使用，这样我即使人在外面也能远程家里的电脑去用vscode。然后我就发现，用聊天软件指挥小龙虾，然后小龙虾再去跑任务，和我用sunshine连到电脑，用vscode跑任务，好像没有什么实质性的区别，都是远程指挥ai干活儿。  
相比较来说，还是用sunshine加上vscode能省一点token。两种方案各有利弊吧，部署在服务器上的小龙虾可以供我和我朋友多人使用，用sunshine远程更省token，但是电脑不能关机，而且只能我一人使用。

## 好用的小工具
### maa mcp
> 基于 MaaFramework 的 MCP 服务器 为 AI 助手提供 Android 设备和 Windows 桌面自动化能力

[MAA-AI/MaaMCP: 基于 MaaFramework 的 MCP 服务器 为 AI 助手提供 Android 设备和 Windows 桌面自动化能力](https://github.com/MAA-AI/MaaMCP)  
{% image "https://img.antares.xin/assets/ai/1.webp", "MaaMCP" %}  
这个是最近发现的好东西，其实我很早就听说小龙虾在mac系统上可以直接操作系统，只可惜我没有mac设备没法测试。前段时间刷B站我就在B站看到了maa mcp的视频——[豆包电脑](https://www.bilibili.com/video/BV1eGmhBaEZz/)，这下在Windows下应该也可以实现类似功能了。  
这个真的很强，可以让ai直接操作电脑了，相当于直接让ai长出双手，不过这个东西我用的还不多，等我再用用我再来讲使用体验。  
当然现在装这种mcp服务器很简单，只需要跟ai讲一下你需要装什么，ai会自动去找项目，然后安装依赖，完全不用操心。  
### cc switch
> 统一管理你的 AI 编程工具工作流

{% image "https://img.antares.xin/assets/ai/2.webp", "cc switch" %}  
这个工具可以让claude code和codex的api配置过程变得非常简单。  
（搞这个主要是因为我把mimo的额度蹬完了，得想办法找替代方案了。）  
{% image "https://img.antares.xin/assets/ai/3.webp", "mimo" %}  

### 替代方案
目前我在考虑是继续用deepseek接到cc里用，还是去看看有没有靠谱的中转站整点token给codex用，或者试试能不能直接开一个gpt plus。  
对于中转站方案，其实我也有想过自己去部署一个new api或是sub2 api来聚合几个中转站，那样的话我自己就可以用自己部署的中转站来使用，如果出现中转站挂了的情况也能自动切换。  
但是部署完之后感觉没什么必要，因为目前我并不打算把它接入到openclaw，我的openclaw用的还是deepseek，如果只是给Claude code和Codex用的话，cc switch的功能已经绰绰有余了。其实就我一个人使用的话，似乎还是cc switch稍微方便一点。  
我看了不少开土区gpt plus和日区gpt plus 的教程，不过一直没有去做，一是因为自己没有外币卡，二是担心刚一搞就被封号，三是正在纠结是否真的有开gpt plus来用的必要，四是因为纯懒。

我的妈耶，写的好水啊，算了，就这样吧~