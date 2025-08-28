---
title: 这真 保姆级教程 如何通过白嫖阿里云服务器免费搭建Teamspeak3 语音服务器
description: 之前为了连麦打游戏有个更好的体验，就去网上研究了下怎么搭建ts的服务器，整个流程下来总体来说还是蛮简单的，做这个教程一是为了分享一下如何搭建服务器，二是防止自己忘记怎么搭（老健忘症了）
date: 2023-12-11
tags: [连麦, 游戏, 云服务器]
category: 技术
author: 星辰曦羽
cover: https://img.antares.xin/ts/40.avif
layout: layouts/post.njk
---
    一、一些废话

     之前为了连麦打游戏有个更好的体验，就去网上研究了下怎么搭建ts的服务器，整个流程下来总体来说还是蛮简单的，做这个教程一是为了分享一下如何搭建服务器，二是防止自己忘记怎么搭（老健忘症了）

    二、服务器的准备

    （一）注册与领券

     我这边使用的是阿里云服务器，因为阿里云有一个高校学生免费试用的活动，有一张300元的无门槛优惠券（能白嫖为啥不白嫖呢 bushi）

（注册应该不需要我讲了吧，支付宝扫码登录就行）

![](https://img.antares.xin/ts/1.webp)

阿里云首页

![](https://img.antares.xin/ts/2.webp)

领券界面

这里需要扫码验证

![](https://img.antares.xin/ts/3.avif)

验证通过界面

  
    其实如果不是学生的话也是可以进行试用的，在权益中心下方还有一个个人试用，同样在认证完成之后就可以试用了，这里因为我之前试用过了，所以就不展示了。

![](https://img.antares.xin/ts/4.avif)

个人试用界面

  
    （二）服务器的购买（白嫖）

     这边我们选择的是云服务器ECS

![](https://img.antares.xin/ts/5.avif)

主页-产品-云服务器ECS

  
        进入云服务器ECS的详情界面后点击购买

![](https://img.antares.xin/ts/6.avif)

云服务器ECS详情

  
    购买界面也是真的复杂，我其实也不是很懂，我就讲一下我能讲清的部分吧

    第一个是包年包月，主要是我想一次性吧这张券用完

    第二个是地域，也就是服务器所处的位置，因为我自己就在杭州，所以服务器也是选在了杭州

    第三个是实例规格，因为TS的服务器真的用不了多少性能，所以我直接怎么便宜怎么来

![](https://img.antares.xin/ts/7.avif)

购买详情一

  
    镜像选什么其实都问题不大，Linux相对Window又更稳定一点，随便选一个Linux系统就可以，至于系统盘，TS用不了多少读写性能的，选择最便宜的就可以了。

![](https://img.antares.xin/ts/8.avif)

购买详情二

 这里我们需要勾选公网IP 按固定带宽 语音聊天其实不会很占带宽3Mbps就差不多够用了

（因为TS的免费服务器的人数限制为32人，只要不传文件什么的还是够用的）

    其实这里可以选择按流量收费，语音聊天用的流量其实不多，而且作为臭打游戏的也不是24小时挂在麦上，这里选择按固定带宽是因为我是个懒狗，搭完服务器后八成不会去管它。用流量收费他会按照每GB流量收费，然后就需要往里面充钱保证余额够用。QWQ 啊！好麻烦！好麻烦！！！还有一个就是那个券应该是一次性的，也就是说流量还得额外收费，这和我们白嫖的精神不符，不选（Doge）

    这个密码建议改成自定义密码然后自己设置密码即可

![](https://img.antares.xin/ts/9.avif)

购买详情三

  
    最后勾选下单即可

    三、服务器的配置

    进入控制台

![](https://img.antares.xin/ts/10.avif)

主页

  
    选择服务器所在地址，红色框所在的就是我们刚购买（白嫖）的服务器

![](https://img.antares.xin/ts/11.avif)

服务器实例

  
    点击此处的远程连接

![](https://img.antares.xin/ts/12.avif)

远程连接

  
    我们使用Workbench进行远程连接

![](https://img.antares.xin/ts/13.avif)

远程连接

  
    点击后会进入如下界面，输入你一开始在购买界面设置的密码即可进入

![](https://img.antares.xin/ts/14.avif)

Workbench输入密码

  
    ~~什么你密码忘了，怎么重置？~~

![](https://img.antares.xin/ts/15.avif)

重置密码

  
    点击登录后会进入这个界面

![](https://img.antares.xin/ts/16.avif)

主界面

  
    点击文件，打开文件树

![](https://img.antares.xin/ts/17.avif)

文件树

  
    点击后会展示服务器的文件

![](https://img.antares.xin/ts/18.avif)

文件树

  
    此时我们需要向服务器传一个文件——TS服务器的配置文件

    这个文件可以在TS的下载界面找到，因为服务器的镜像64位的所以我们也下载64位的文件

    链接：[https://teamspeak.com/zh-CN/downloads/#server](https://teamspeak.com/zh-CN/downloads/#server "https://teamspeak.com/zh-CN/downloads/#server")

    TeamSpeak 下载 | TeamSpeak

    千万别下载错了，别一不小心到了什么teamspeak中文网去了

![](https://img.antares.xin/ts/20.avif)

下载界面

  
    回到Workbench右键文件树上传文件

![](https://img.antares.xin/ts/21.avif)

终于写到上传了吗感觉已经写了一万年了

  
    上传刚才下载的文件就行

![](https://img.antares.xin/ts/22.avif)

上传刚才下载的文件

  
    等待上传完成即可

![](https://img.antares.xin/ts/23.avif)

上传完成界面如下

  
    上传完成后你会在文件树中看到这个文件

    接下去输入以下代码进行文件解压（蓝色部分为文件名字如果未来版本更新了就把文件蓝色框内的内容改一下）

`tar -xjf teamspeak3-server_linux_amd64-3.13.7.tar.bz`

（现在ts下载的文件可能变成.tar.bz2这一格式，反正把后面那一段文件名改成你自己上传的文件的名字就行了）

    完成后回车即可

![](https://img.antares.xin/ts/24.avif)

解压

  
    然后就解压成……卧槽怎么错了

    这里可以看到它提示了路径未找到或是文件不存在

    所以我们输入

`cd /`

    或是

`cd ..`

   更改路径后再执行即可 如果你的压缩包上传位置不是在根目录下方的话也可以通过cd /+路径找到文件

![](https://img.antares.xin/ts/25.avif)

解压二

  
    解压成功后就会冒出这个文件夹

![](https://img.antares.xin/ts/26.avif)

解压成功

  
    这里我嫌弃他文件名字太长于是重命名来下

    重命名为teamspeak3

![](https://img.antares.xin/ts/27.avif)

重命名

  
    接下去将路径改到teamspeak3文件夹

`cd /teamspeak3`

![](https://img.antares.xin/ts/28.avif)

改路径

  
    安装ts3许可证

`touch .ts3server_license_accepted`

![](https://img.antares.xin/ts/29.avif)

安装许可

  
    启用ts3服务

`./ts3server_startscript.sh start`

![](https://img.antares.xin/ts/30.avif)

启用服务

  
    （如果还是出现找不到文件的情况可以试一下绝对路径）

    运行后会出现如下界面

![](https://img.antares.xin/ts/31.avif)

运行结果

  
    红色框内的秘钥是第一次登录ts语音时输入该秘钥的用户会成为服务器管理员

    蓝色框内的好像是一个比服务器管理员权限更高的角色

    **==这段内容记得保存好，很重要==**

    接下去就是配置服务的自启动了，类似于开机自启动吧

    输入来创建一个自启动的脚本

`sudo vi /lib/systemd/system/teamspeak.service`

（如果是root用户登录的话可以把前面的sudo去掉）

按i进行输入  
    输入以下内容

```
[Unit]
Description=TeamSpeak 3 Server
After=network.target
[Service]
WorkingDirectory=/teamspeak3
User=root
Type=forking
ExecStart=/teamspeak3/ts3server_startscript.sh start inifile=ts3server.ini
ExecStop=/teamspeak3/ts3server_startscript.sh stop
PIDFile=/teamspeak3/ts3server.pid
RestartSec=15
Restart=always
[Install]
WantedBy=multi-user.target
```

![](https://img.antares.xin/ts/32.webp)

    如果你的路径和我的不一样就需要修改其中红框内的四行路径

    输入完成后按esc，再输入:wq退出编辑器

`systemctl enable teamspeak.service`

![](https://img.antares.xin/ts/33.avif)

新建脚本

  
    启动脚本

`systemctl start teamspeak.service`

    出现Job……巴拉巴拉的不用管再输入一次就行

![](https://img.antares.xin/ts/34.avif)

启动脚本

  
    最后输入

`systemctl | grep teamspeak.service`

    查看服务是否正常启用

    出现以下提示就是启用成功了

![](https://img.antares.xin/ts/35.avif)

检验服务是否启用

  
四、配置防火墙

    回到阿里云的管理界面进入安全组 管理规则

![](https://img.antares.xin/ts/36.avif)

安全组

  
    在这里我们需要手动添加四条规则

9987 UDP  
30033 TCP  
10011 TCP  
41144 TCP

![](https://img.antares.xin/ts/37.avif)

添加规则

![](https://img.antares.xin/ts/38.avif)

  
添加规则

    五：登录客户端

    终于可以登录了

    在阿里云服务器管理界面实例配置中找到地址

![](https://img.antares.xin/ts/39.avif)

  
IP地址在这儿

打开TS3客户端

    将刚刚复制的地址填入此处即可

![](https://img.antares.xin/ts/40.avif)

连接服务器

  
    连接之后会跳出填入权限码的界面

    将刚才保存下来的token里的内容填进去

![](https://img.antares.xin/ts/41.avif)

运行结果

![](https://img.antares.xin/ts/45.avif)

  
输入权限码

![](https://img.antares.xin/ts/42.avif)

输入权限码  
        

    现在就可以和你的朋友们快乐地连麦了

    如果配置了安全组而且服务是成功启动但是还是无法连接至服务器的话

    可以尝试输入以下内容手动开启防火墙端口

    重新进入workbench输入

`systemctl start firewalld`

![](https://img.antares.xin/ts/43.avif)

输入这一行是因为我发现防火墙没开启 手动开启防火墙

`firewall-cmd --zone=public --add-port=9987/udp --permanent`

`firewall-cmd --zone=public --add-port=10011/tcp --permanent`

`firewall-cmd --zone=public --add-port=30033/tcp --permanent`

`firewall-cmd --zone=public --add-port=41144/tcp --permanent`

`firewall-cmd --reload`

![](https://img.antares.xin/ts/44.avif)

设置防火墙