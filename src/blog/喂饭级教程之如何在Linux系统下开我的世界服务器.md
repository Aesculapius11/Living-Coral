---
title: 喂饭级教程之如何在Linux系统下开我的世界服务器
description: 众所周知呢，MC的服务器在Linux下的表现会比在Windows下的表现好那么一捏捏，本教程详细介绍了如何在Ubuntu系统下开MC服务器。
date: 2025-10-30
tags: [MC, Linux, 服务器]
category: MC
keywords: [MC, Linux, 服务器, 我的世界, Minecraft]
author: 星辰曦羽
cover: https://img.antares.xin/assets/mconlinux/22.webp
layout: layouts/post.njk
---

## 前言
众所周知呢，MC的服务器在Linux下的表现会比在Windows下的表现好那么一捏捏，但是相比于我们日常使用的Windows，由于Linux并没有图形化界面，上手门槛会比Windows稍微高一点点。  
所以我就打算做一期详细的教程来帮助新人服务员(服务器管理员)来实现Linux系统下的开服。教程内容包括如何连接Linux服务器，一些最为基础的Linux命令，以及具体怎么开启MC服务器。  
本篇教程只会包含最简单最必要的内容，以成功开服为目标，本教程使用的系统为Ubuntu 24.04

{% image "https://img.antares.xin/assets/mconlinux/1.webp", "服务器承载人数计算" %}  

## 开服

### 连接服务器

#### 准备SSH客户端工具
我们需要一个SSH客户端，我这边用的是XShell，如果你有其他熟悉的SSH客户端可以使用你自己熟悉的。  
找到XShell的[家庭和学校用户的免费许可证](https://www.xshell.com/zh/free-for-home-school/)版本，下载并安装XShell和Xftp，XShell负责向服务器传命令，Xftp负责向服务器传文件（如果要传存档之类的）  

{% image "https://img.antares.xin/assets/mconlinux/2.webp", "XShell和Xftp" %}  

我们先去找到服务器的ip，我这边拿阿里的控制台面板演示下，我们需要的是红框内的公网ip地址。  

{% image "https://img.antares.xin/assets/mconlinux/3.webp", "服务器ip" %}  

打开XShell，新建连接，将你的公网ip输进去。这里肯定有眼尖的服务员发现了，我这里输入的是局域网ip，我解释下，因为那个阿里云的服务器性能过于孱弱，我就在自己主机上虚拟了一台服务器出来做演示。
#### 使用工具连接服务器

{% image "https://img.antares.xin/assets/mconlinux/4.webp", "输入服务器ip" %}  

点击用户身份验证，输入你的用户名和密码。  

{% image "https://img.antares.xin/assets/mconlinux/5.webp", "输入服务器账密" %}  

用户名默认为root，密码是你租服务器时候让你设置的密码，这个密码必须是强密码！不然被黑了你就烷基八氮了。如果忘了密码可以去这里重置。 

{% image "https://img.antares.xin/assets/mconlinux/7.webp", "重置密码" %}  

点击这个创建出来的新会话连接服务器。

{% image "https://img.antares.xin/assets/mconlinux/6.webp", "连接服务器" %}  

连接完成后会是这样一个界面，点击这个绿色的按钮会直接调出Xftp。

{% image "https://img.antares.xin/assets/mconlinux/8.png", "XShell" %}  

{% image "https://img.antares.xin/assets/mconlinux/9.webp", "Xftp" %}  

### 安装Java

#### 更新软件包  
注意如果你的登录用户名为root则不需要在前面加sudo，如果不是root用户就需要加。同时非root用户在执行后还要再输入一次密码，你输密码的时候他不会有任何显示，这是正常的，你只要输密码然后回车就行。  
>sudo 是一个 Linux 和 macOS 系统下的命令，它的意思是 "Superuser Do"，也就是“以超级用户的身份执行”。简单来说，它允许普通用户以管理员（root）的权限运行特定的命令。

```shell
sudo apt-get update
```

{% image "https://img.antares.xin/assets/mconlinux/10.png", "安装" %}  

```shell
sudo apt-get upgrade -y
```

这行命令执行之后他会更新所有软件包，咔咔咔咔会往下走很多，这是正常的，如果速度慢稍微等一会儿即可。  

{% image "https://img.antares.xin/assets/mconlinux/11.png", "安装" %}  

#### 安装Java

我这边以Java21为例  

```shell
sudo apt-get install openjdk-21-jdk -y
```

Java17就是  

```shell
sudo apt-get install openjdk-17-jdk -y
```

安装完成后我们输入`java --version`检查下是否安装成功了，看到如下输出就说明安装成功了。  

{% image "https://img.antares.xin/assets/mconlinux/12.png", "安装" %}  

### 预开服

#### 准备服务端

我这边以fabric端为例，我们找到fabric的服务端下载。  
[fabric服务端](https://fabricmc.net/use/server/)  

{% image "https://img.antares.xin/assets/mconlinux/13.png", "fabric服务端" %}  

哎呀这fabric真好，把命令都准备好了直接复制粘贴就行。  
为了方便管理，我们先新建一个文件夹  

```shell
mkdir minecraft-server
```

用ls命令展示当前路径下的所有文件  

```shell
ls
```

用cd命令切换到对应路径（文件夹）

```shell
cd minecraft-server
```

{% image "https://img.antares.xin/assets/mconlinux/14.png", "切换路径" %}  

使用fabric准备好的预制命令来下载服务端  

```shell
curl -OJ https://meta.fabricmc.net/v2/versions/loader/1.21.10/0.17.3/1.1.0/server/jar
```

{% image "https://img.antares.xin/assets/mconlinux/15.png", "下载" %}  

下载完成后用第二个预制命令来预开服  

```shell
java -Xmx2G -jar fabric-server-mc.1.21.10-loader.0.17.3-launcher.1.1.0.jar nogui
```

之后又是咔咔咔咔的一段，然后就停下来了，开服固定环节之同意eula条约。  

{% image "https://img.antares.xin/assets/mconlinux/16.png", "同意条约" %}  

#### 同意EULA
OK，到这一步我们需要去修改一下eula文件，我们使用vim编辑器打开eula.txt文件 

```shell
vim eula.txt
```

{% image "https://img.antares.xin/assets/mconlinux/17.webp", "编辑文件" %}  

用上下左右键将光标移动到对应位置，按下i进入输入模式（非输入模式是不能编辑的）  
把`false`改成`true`之后按下esc键，再输入`:wq`回车退出  

{% image "https://img.antares.xin/assets/mconlinux/18.webp", "编辑文件" %}  
是不是很简单，我告诉你个更简单的办法，你去Xftp里找到对应路径，把文件拉到你自己的电脑里编辑完再扔进去也可以
{% image "https://img.antares.xin/assets/mconlinux/19.webp", "嘿嘿" %}  
你看这个文件目录是不是很熟悉
{% image "https://img.antares.xin/assets/mconlinux/20.webp", "嘿嘿" %}  
再把之前的命令输一遍

```shell
java -Xmx2G -jar fabric-server-mc.1.21.10-loader.0.17.3-launcher.1.1.0.jar nogui
```

{% image "https://img.antares.xin/assets/mconlinux/21.png", "开服" %}  
可以看到服务器已经开起来了，哎呀木得问题  
{% image "https://img.antares.xin/assets/mconlinux/22.webp", "开服" %}  
我们先关服去调整一下配置文件  
一种办法，用vim编辑器去修改文件，这个我们上面教过  

```shell
vim server.properties
```

当然我跟喜欢邪修的办法，直接把文件拽到桌面，修改完再扔进去。

### 正式开服

#### 创建会话
在正式开服前我再讲一个`screen`命令  
>screen 命令让你在 Linux 终端中创建和管理多个会话，即使终端断开连接，会话也能在后台继续运行。
创建一个叫Minecraft的会话

```shell
screen -S Minecraft
```

正式开服，这个命令可以自己改一下，比如说内存最大给它调成8GB

```shell
java -Xmx8G -jar fabric-server-mc.1.21.10-loader.0.17.3-launcher.1.1.0.jar nogui
```

{% image "https://img.antares.xin/assets/mconlinux/23.png", "开服" %}  
这时候你直接把XShell关掉也可以，按下Ctrl A D三个键将Minecraft这个会话扔到后台再关掉XShell也可以。

#### 恢复会话

用`screen -ls`展示所有的会话  

```shell
screen -ls
```

{% image "https://img.antares.xin/assets/mconlinux/24.webp", "恢复会话" %}  

可以看到叫Minecraft的这个会话，再输入`screen -r Minecraft`恢复会话  

```shell
screen -r Minecraft
```

{% image "https://img.antares.xin/assets/mconlinux/25.png", "恢复会话" %}  

## 其他
简单提一下整合包和其他服务端吧。  
其实很简单，就是把准备服务端那几步改一下，你可以直接用Xftp把你的整合包、服务端、存档、mod什么的直接扔进去，他的这个文件目录其实和在Windows下是一模一样的。  
需要注意的就是开服命令上可能有点区别，得把`fabric-server-mc.1.21.10-loader.0.17.3-launcher.1.1.0.jar`改成你目录下具体的jar文件的名字。

```shell
java -Xmx8G -jar fabric-server-mc.1.21.10-loader.0.17.3-launcher.1.1.0.jar nogui
```

{% image "https://img.antares.xin/assets/mconlinux/26.png", "文件目录" %}  