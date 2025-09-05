---
title: 自建基于Cloudflare和Resend搭建的临时邮箱收发平台
description: 使用Cloudflare和Resend的免费服务来自建一个域名临时邮箱收发平台
date: 2025-09-05
tags: [邮箱, 域名]
category: 杂项
author: 星辰曦羽
cover: https://img.antares.xin/mail/1.webp
layout: layouts/post.njk
---
## 前言
域名邮箱我其实已经玩了很久了，收邮件是比较容易的，使用Cloudflare进行邮件转发即可，Cloudflare会自动把你的邮件转发到你的邮箱里。发邮件就相对麻烦一点，得用Resend的api或是smtp，我自己用倒是还行，但是因为没有做合适的可视化的平台，这玩意儿想要给我朋友用还是有点麻烦的。

这次用到的项目：
[dreamhunter2333/cloudflare_temp_email: CloudFlare free temp domain email 免费收发 临时域名邮箱 支持附件 IMAP SMTP TelegramBot](https://github.com/dreamhunter2333/cloudflare_temp_email)
![dreamhunter2333/cloudflare_temp_email: CloudFlare free temp domain email 免费收发 临时域名邮箱 支持附件 IMAP SMTP TelegramBot](https://img.antares.xin/mail/1.webp)

## 教程
官方的说明文档和大佬做的手把手教程已经非常非常详细了，我就不再做重复工作了。  
[【教程】小白也能看懂的自建Cloudflare临时邮箱教程（域名邮箱） - 文档共建 - LINUX DO](https://linux.do/t/topic/316819)
![教程](https://img.antares.xin/mail/3.webp)
[书接上回——如何让你的CF临时邮箱可以发邮件😁 - 开发调优 - LINUX DO](https://linux.do/t/topic/515642)
![教程2](https://img.antares.xin/mail/4.webp)
[初始化/更新 D1 数据库 | 临时邮箱文档](https://temp-mail-docs.awsl.uk/zh/guide/ui/d1.html)
![官方文档](https://img.antares.xin/mail/2.webp)

## 补充点
1. Cloudflare的workers的绑定界面发生了变化，绑定D1数据库的地方不在设置里了，而是放到了外面  

	老界面：
	![老界面](https://img.antares.xin/mail/10.webp)
	新界面：
	![新界面](https://img.antares.xin/mail/5.webp)
2. 参数的值请直接从官方文档上复制，不要手敲，防止出现中英文引号不一致的问题，我是直接从官方文档里复制的，没有碰到问题  
	[Worker 变量说明 | 临时邮箱文档](https://temp-mail-docs.awsl.uk/zh/guide/worker-vars)
	![参数](https://img.antares.xin/mail/9.webp)
3. 我这边发送用的是Resend的api，在设置发送邮件的地方只需要添加变量`RESEND_TOKEN`即可，不需要添加`SMTP_CONFIG`。如果需要用SMTP 发送邮件才需要配置SMTP_CONFIG，关于使用SMTP发送邮件的部分可以参考这位大佬的教程  
	[建立自己的域名邮箱系统 - 文档共建 - LINUX DO](https://linux.do/t/topic/675030)
	![SMTP设置](https://img.antares.xin/mail/8.webp)