---
title: 想让你的博客成为区块链的一部分吗，来玩玩Xlog吧
description: 事情是这样的，我在刷B站的时候偶然间发现了这个叫Xlog的博客平台，当时看到这个平台是通过区块链来存储数据就觉得蛮有意思的，于是乎就打算来搞一个来玩玩。
date: 2025-08-20
tags: [Xlog, 区块链]
category: 博客
author: 星辰曦羽
cover: https://img.antares.xin/xlog/1.webp
layout: layouts/post.njk
---
## 前言

事情是这样的，我在刷B站的时候偶然间发现了这个叫Xlog的博客平台，当时看到这个平台是通过区块链来存储数据就觉得蛮有意思的，然后去查了下发现是个免费的平台（我这白嫖怪顺着味儿就来了），于是乎就打算来搞一个来玩玩。目前使用下来体验还不错，界面和后台都蛮好看的。

~~说实话，就我写的这些垃圾东西，感觉真没有多少上链的必要，颇有一种把我的屎山代码埋到北极冻土层、把我的日记刻到石头里供子孙观赏的美。~~

>XLog是一个新的开源博客平台，使用区块链技术存储数据，并提供更好的开发和维护体验。用户可以在链上发布、评论和点赞文章，并自定义域名、导航栏和样式。该平台基于Next.js + Tailwind CSS + TypeScript + TanStack Query开发，使用一个名为Crossbell的EVM兼容链作为区块链。然而，使用该平台需要拥有以太坊钱包，这对于对区块链接触较少的用户来说可能是一个挑战。此外，由于区块链操作是透明和不可撤销的，用户无法删除文章，并且修改历史可以通过区块链历史查看。未来，XLog计划提供更多主题和插件系统，并探索博客的商业化可能性。
## 搭建

1. 首先先要准备一个钱包，点击[Xlog 官网](https://xlog.app/)右上角的连接，选择第一个钱包，此处它提示我们该浏览器没有安装Metamask，接下去准备安装Metamask。
	![选择钱包](https://img.antares.xin/xlog/2.webp)
	![选择钱包](https://img.antares.xin/xlog/3.webp)
2. 将Metamask安装到你的浏览器上
	![安装Metamask](https://img.antares.xin/xlog/4.webp)
	![安装Metamask](https://img.antares.xin/xlog/6.webp)
3. 安装完毕后，我们创建一个自己的钱包
	1. 此处我们选择使用助记词来创建，请妥善保管好你的助记词，这是你找回账户的唯一办法
	![创建钱包](https://img.antares.xin/xlog/9.webp)
	2. 设置密码，请不要忘记你的密码，每次打开Metamask都需要输入密码
	![设定密码](https://img.antares.xin/xlog/10.webp)
	3. 接下去就是最重要的助记词部分，请妥善保管好你的助记词，如果助记词丢失了，这个账户就永远无法登上了
	![助记词](https://img.antares.xin/xlog/11.webp)
4. 连接钱包，此时可以回到Xlog的官网，刷新网站并连接你的钱包
	![连接钱包](https://img.antares.xin/xlog/13.webp)
5. 创建角色并进入仪表盘
	1. 按照需求填入信息即可
	![创建角色](https://img.antares.xin/xlog/14.webp)
	2. 此时他会提示你的账户的虚拟货币不足，需要发帖来获取，不过我懒得去发，这边提供另外一个方式
	![创建角色](https://img.antares.xin/xlog/15.webp)
	3. 进入[水龙头](https://faucet.crossbell.io/)填入你的账号（账号在Metamask里复制），它会送你0.02虚拟币（一个账户的余额小于0.02时，就可以来这里获取，0.02也够用上好久了）
	![获取虚拟币](https://img.antares.xin/xlog/16.webp)
	4. 最后确认交易即可完成角色创建
	![创建角色](https://img.antares.xin/xlog/17.webp)
	5. 注意点：有些时候它虽然提示创建的用户ID（Handle）是可以使用的，但是交易始终无法完成，要不是燃料费不够，要不就是一直卡着，或者直接就报错，这种问题只能通过换一个用户ID来解决，我也不知道为什么，我一开始以为是燃料费不够的问题，特意等了一天又换到0.02虚拟币，但是还是不行，最后只能换ID。
## 使用
把上面这一堆东西搞完之后就可以去写文章了，总体来说还是蛮好用的，界面蛮好看的，图片拖上去就能自动上传，头像域名什么的都可以自己换。还是一个蛮不错的平台，值得一玩。
![写文章](https://img.antares.xin/xlog/18.webp)
![写文章](https://img.antares.xin/xlog/19.webp)
![写文章](https://img.antares.xin/xlog/20.webp)