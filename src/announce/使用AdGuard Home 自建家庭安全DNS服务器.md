---
title: 使用AdGuard Home 自建家庭安全DNS服务器
description: 我通过AdGuard Home 构建家庭安全DNS解决方案。采用DOH和DOT协议加密DNS查询。AdGuard Home 还能实现广告拦截，能够自定义过滤规则，屏蔽各类广告和跟踪器。
date: 2025-10-21
tags: [测试公告]
category: 公告
keywords: [AdGuard, DNS, AdGuard Home]
author: 星辰曦羽
cover: https://img.antares.xin/assets/adguard/1.webp
layout: layouts/announce.njk
---
## 测试公告
以下内容来自：[使用AdGuard Home 自建家庭安全DNS服务器](https://www.antares.xin/blog/%E4%BD%BF%E7%94%A8AdGuard%20Home%20%E8%87%AA%E5%BB%BA%E5%AE%B6%E5%BA%AD%E5%AE%89%E5%85%A8DNS%E6%9C%8D%E5%8A%A1%E5%99%A8/)


## 前言
前段时间我对家里的服务器进行了一下小小的升级，顺便把服务器的系统也重装了下，这几天正在逐渐把原来的功能重新搞回来。AdGuard Home其实我已经用了有一段时间了，部署很方便，安装过程挺傻瓜式的，界面也都有中文。我之前挺担心这台服务器挂掉导致家里断网的情况，不过现实情况是这玩意儿挺稳定的，并没有出现不可用的情况。至于广告拦截效果和追踪器拦截效果，我自己感觉有点用，但是效果不是非常明显，基本上是一个有点用但是不多的情况。

>AdGuard Home 是一种基于网络的广告和跟踪器拦截解决方案。只需在您的路由器上安装一次，即可覆盖您家庭网络中的所有设备——无需额外的客户端软件。这对于各种经常威胁您隐私的物联网设备尤其重要。

## 如何部署AdGuard Home
安装主要是参考[官方的文档](https://adguard-dns.io/kb/zh-CN/adguard-home/getting-started/)，安装方式可以选择直接安装或是采用docker的方式安装。  
Windows下还是直接安装吧，不要使用什么Docker Desktop了，这玩意儿不好用。  
linux下可以选择直接安装，也可以选择使用Docker的方式安装，linux下还是使用Docker吧。
>至于为什么用Windows不用linux主要原因还是因为我懒，倒也不是不会用，纯粹是习惯了图形化界面懒得敲命令行。
### 安装

#### 直接安装
先说直接安装  
去[Github仓库](https://github.com/AdguardTeam/AdGuardHome)下载对应版本的文件。解压对应的文件切换到目标路径并执行`sudo ./AdGuardHome -s install`，Win下改成`AdGuardHome.exe -s install`即可（注意一下文件名字即可）  
{% image "https://img.antares.xin/assets/adguard/2.webp", "下载文件" %}  
安装完成后就可以访问ip:3000来进行安装配置了，接下去全是图形化操作，也都有中文，基本上就是一路下一步就行。

#### Docker安装
Docker先看[官方的仓库](https://hub.docker.com/r/adguard/adguardhome)，这下面已经给出了具体的安装命令。

```shell
docker run --name adguardhome\
    --restart unless-stopped\
    -v /my/own/workdir:/opt/adguardhome/work\
    -v /my/own/confdir:/opt/adguardhome/conf\
    -p 53:53/tcp -p 53:53/udp\
    -p 67:67/udp -p 68:68/udp\
    -p 80:80/tcp -p 443:443/tcp -p 443:443/udp -p 3000:3000/tcp\
    -p 853:853/tcp\
    -p 784:784/udp -p 853:853/udp -p 8853:8853/udp\
    -p 5443:5443/tcp -p 5443:5443/udp\
    -d adguard/adguardhome
```
上面-v就是将对应的路径映射给Docker容器做数据持久化用的，这样即使你把这个容器删除了重装，你的配置数据什么的还是会在的，不需要重新再配置一遍。在你的服务器上创建路径，并吧前面的部分`/my/own/workdir`改成你创建的路径即可。  
下面的-p端口部分，53是最基础的，DNS服务器需要用。  
67、68端口是给DHCP服务器用的，有需要就带上，没需要就可以直接删了，我这边DHCP还是用路由器的，所以这些端口就没必要用了。  
80端口是默认的配置网页的端口，安装过程中他会问你要哪个端口作为平时配置的端口，我不想给他80端口，让他继续用3000端口，所以80端口也砍掉。  
443端口是作为DoH服务器和网页https用的；784、853、8853是作为DoQ服务器用的，如果要使用，官方推荐保留一到两个端口。  
5443端口是给什么DNSCrypt用的，这个我不太懂，就不乱说了。

总而言之就是按需分配，要什么功能给什么端口，如果不懂具体要哪些功能，就直接按照官方的命令来,比如说这样：
```shell
docker run --name adguardhome\
    --restart unless-stopped\
    -v /home/user/adguard/workdir:/opt/adguardhome/work\
    -v /home/user/adguard/confdir:/opt/adguardhome/conf\
    -p 53:53/tcp -p 53:53/udp\
    -p 67:67/udp -p 68:68/udp\
    -p 80:80/tcp -p 443:443/tcp -p 443:443/udp -p 3000:3000/tcp\
    -p 853:853/tcp\
    -p 784:784/udp -p 853:853/udp -p 8853:8853/udp\
    -p 5443:5443/tcp -p 5443:5443/udp\
    -d adguard/adguardhome
```
像我这边，因为是局域网，只需要基础的DNS服务器，命令可以删减很多。  
```shell
docker run --name adguardhome\
    --restart unless-stopped\
    -v /home/user/adguard/workdir:/opt/adguardhome/work\
    -v /home/user/adguard/confdir:/opt/adguardhome/conf\
    -p 53:53/tcp -p 53:53/udp\
    -p 3000:3000/tcp\
    -d adguard/adguardhome
```

### 配置
配置容易得多，主要关注一个DNS设置和DNS黑名单和白名单即可。 

#### DNS设置
首先是DNS设置，先提一下DoH (DNS over HTTPS) DoT (DNS over TLS) DoQ (DNS over QUIC)
>**DoH (DNS over HTTPS)**：  
  DoH是一种通过HTTPS协议传输DNS查询的方法。它利用了HTTPS协议天然的加密特性来保障数据传输的隐私性和安全性。DoH的引入使DNS查询与普通的WEB流量混合，从而更难被封锁或监控。  
  **DoT (DNS over TLS)**：  
  DoT利用传输层安全性协议（TLS）来加密DNS查询，确保数据在传输过程中不被监听或篡改。DoT通常在853端口上运行，并提供了一种端到端加密的解决方案。  
  **DoQ (DNS over QUIC)**：
  DoQ是一种新兴的技术，它结合了DNS查询和QUIC协议的优势。QUIC是一个基于UDP的多路复用传输协议，它减少了连接建立时间，并提供了更好的性能和加密支持。DoQ旨在进一步提升DNS查询的效率和隐私性。

>优缺点  
  **DNS**  
  优点：原生支持，广泛部署，无需额外配置。  
  缺点：明文传输，容易受到篡改和监听。  
  **DoH**  
  优点：与HTTPS流量不可区分，难以被审查，易于绕过某些网络限制。  
  缺点：可能与现有的网络基础设施（如中间件、缓存）存在兼容性问题。  
  **DoT**  
  优点：设计简洁，易于实现，提供端到端加密。  
  缺点：可被ISP或网络防火墙识别并阻止，因为使用了专用端口。  
  **DoQ**  
  优点：减少连接延迟，提高传输效率，支持并发请求。  
  缺点：目前支持度不广，需要进一步测试和部署。  

选择哪些DNS服务器可以参考下下面两篇文章  
[国内外免费公共 DoT/DoH 加密 DNS 服务器地址大全](https://blog.3ms.run/archives/12986.html)  
[国内目前可用的DoH（2025-06-15）](https://coding.gs/2024/06/09/available-doh/)  
我这边使用的是如下DNS
```
https://223.5.5.5/dns-query
https://223.6.6.6/dns-query
https://1.12.12.12/dns-query
https://120.53.53.53/dns-query
tls://223.5.5.5
tls://223.6.6.6
tls://1.12.12.12
tls://120.53.53.53
quic://dns.alidns.com
```
讲一个有意思的事情，我能用Cloudflare的1.0.0.1的DNS，但是用不了https://1.0.0.1/dns-query和tls://1.0.0.1  
不可抗力，没有办法  
{% image "https://img.antares.xin/assets/adguard/3.webp", "DNS配置" %}  
这一段时间用下来还是阿里的DNS服务器速度比较快，我之前也添加了`1.0.0.1、2606:4700:4700::1111、2606:4700:4700::1001`这仨Cloudflare的DNS服务器，响应时间在140ms到150ms之间，甚至比某些国内DNS服务器响应速度快……大抵是因为不加密的速度快吧……   
{% image "https://img.antares.xin/assets/adguard/4.webp", "速度对比" %}  

#### DNS黑名单
我使用的是[秋风广告规则](https://awavenue.top/Sub.html)，直接将AdGuard 订阅链接和AdGuard 补充规则丢进去即可。
{% image "https://img.antares.xin/assets/adguard/5.webp", "秋风广告规则" %}  
{% image "https://img.antares.xin/assets/adguard/6.webp", "秋风广告规则" %}  

## 其他
我对于某公司不信任，加上之前出的流氓事件，在加上我只使用他公司的一个产品，那个产品还没有什么联网需求  
所以~  
给我死!!!
{% image "https://img.antares.xin/assets/adguard/7.webp", "自定义规则" %}  
说真的，你也是真牛逼，繁殖能力堪比广东小精灵，给我整烦了你们一家一起死。  
{% image "https://img.antares.xin/assets/adguard/8.png", "自定义规则" %}  
{% image "https://img.antares.xin/assets/adguard/9.webp", "自定义规则" %}  