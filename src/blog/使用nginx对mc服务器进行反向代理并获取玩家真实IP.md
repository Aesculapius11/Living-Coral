---
title: 使用nginx对mc服务器进行反向代理并获取玩家真实IP
description: 通过nginx对mc服务器进行反向代理，隐藏源站ip并实现负载均衡，通过proxy protocol协议获取玩家真实IP
date: 2025-10-08
tags: [MC, nginx, 服务器]
category: 技术
author: 星辰曦羽
cover: https://img.antares.xin/nginx-mc/6.png
layout: layouts/post.njk
---

## 前言
mc的反向代理服务端主要有这俩——[waterfall](https://papermc.io/downloads/waterfall)和
[velocity](https://papermc.io/software/velocity)。这玩意儿是给群组服，或者说是做跨服端用的。昨天晚上呢，我突然脑洞大开，如果只是要反向代理的话，nginx不是也是反向代理服务器嘛，这玩意儿好像也可以用来反向代理mc服务器吼。我们先来介绍一下反向代理。

### 什么是反向代理
> 反向代理服务器是位于客户端和一组后端服务器之间的中间层服务器。它代表后端服务器接收来自客户端的请求，并将这些请求路由到适当的后端服务器进行处理。然后，反向代理服务器接收来自后端服务器的响应，并将这些响应返回给客户端，就像这些响应直接来自反向代理服务器本身一样。

简单来说，就是给你的mc服务器套了一个“壳”，所有流量要先经过这个“壳”才能到达你的mc服务器，那么这玩意儿有什么用呢？

### 反向代理的好处
1. 抗ddos  
理论上讲啊，这个反向代理服务器可以隐藏你的真实mc服务器ip，你暴露出去的地址只有这个反向代理服务器的ip。简单来说这个反向代理服务器就是个沙包，拿出去挨揍的，就算被揍爆了你实际上运行mc的那个服务器还是活着的，稍微提高了一捏捏安全性吧。

2. 负载均衡  
    >如果您有多个 Minecraft 服务器，Nginx 可以用作负载均衡器，将玩家连接分配到不同的服务器。 这可以提高整体性能，防止单个服务器过载，并确保玩家获得流畅的游戏体验。  
    
    额……这玩意儿真的有用吗。可能能有用吧，比如说你搞了一堆小游戏服务器，把人放进去的时候搞一下负载均衡，但是真要这样搞得话还是应该上专门的跨服端的反向代理才对。


### 搞这反向代理的原因
简单来说就是我傻逼了，我试图用nginx反向代理来解决没有公网ip的问题，开始写得时候我才突然意识到——你没公网ip nginx怎么给你反向代理啊（除非反向代理服务器和mc服务器在一个局域网里，比如说你问云服务商买两个服务器，一个高性能服务器没外网用来跑mc，一个防ddos服务器，用来反向代理……有意义吗，有点意义，但好像不大）  
真想解决没有公网ip的问题还是得需要用内网映射，可以看下这篇教程[如何通过云服务器自建内网映射隧道](https://www.antares.xin/blog/如何通过云服务器自建内网映射隧道/)  
反正既然说nginx有这些功能，我们就来玩一玩，看一下这玩意儿能不能使。

## 配置过程

### 安装nginx
其实nginx的安装还算是方便吧，你如果不太会的话可以装个面板什么的，宝塔、1panel都可以，我这边拿Ubuntu做例子吧。  
连上服务器后依次输入
```shell
sudo apt update #更新软件包

sudo apt install nginx -y #安装nginx

sudo apt install nginx-extras #安装nginx其他功能模块

sudo systemctl start nginx #启动nginx

sudo systemctl enable nginx #设置nginx开机自启动

sudo systemctl status nginx #查看nginx运行状态
```
### 配置nginx
nginx在Ubuntu下的默认配置文件路径为/etc/nginx/nginx.conf，如果不是这个路径你可以用命令`nginx -t`他会向你展示配置文件在哪。

接下去修改配置文件`vim /etc/nginx/nginx.conf`加入内容如下
> vim操作：按下i进入输入模式 输入完毕后按下esc退出，按下:wq退出

```nginx
stream {
    upstream minecraft {
        server 114.5.1.4:25565; #你的mc服务器的地址
    }

    server {
        listen 25565;  # 反向代理服务器监听的端口
        proxy_pass minecraft;
        tcp_nodelay on;
        proxy_timeout 300s;
    }
}
```
![nginx配置文件](https://img.antares.xin/nginx-mc/1.png)

输入`nginx -t`测试配置文件看到OK就是没问题的了，然后重启nginx
```shell
sudo systemctl restart nginx #重启nginx

sudo systemctl status nginx #查看nginx运行状态
```


## 负载均衡测试
这边我用的是paper端1.21.8版本进行测试，我开了两个服务器，一个是25566端口一个是25567端口。
修改nginx的配置文件，修改完毕后重启nginx
```nginx
stream {
    upstream minecraft {
        server 114.5.1.4:25566; #第一个服务器
        server 114.5.1.4:25567; #第二个服务器
    }

    server {
        listen 25565;  # 反向代理服务器监听的端口
        proxy_pass minecraft;
        tcp_nodelay on;
        proxy_timeout 300s;
    }
}
```
![nginx配置文件](https://img.antares.xin/nginx-mc/2.png)
可以看到我两次进出服务器，每次进去的服务器都不是同一个，被nginx扔到了两个不同的服务器上，也是做到了负载均衡。  
![服务端](https://img.antares.xin/nginx-mc/3.png)

### nginx负载均衡规则

nginx负载均衡的规则还是比较复杂的，我贴一个AI的回答以供参考

1. 轮询（Round Robin）：  
    描述： 这是最简单也是默认的负载均衡算法。 Nginx 按照后端服务器在配置文件中出现的顺序，依次将每个新的客户端请求分配给一个服务器。  
    优点： 简单易于配置。  
    缺点： 没有考虑服务器的实际负载情况，可能会导致性能较差的服务器过载。  
    配置示例：  
    ```nginx
    upstream backend {  
        server backend1.example.com;  
        server backend2.example.com;  
        server backend3.example.com;  
    }
    ```
2. 加权轮询（Weighted Round Robin）：  
    描述： 类似于轮询，但允许为每个后端服务器分配一个权重。 Nginx 会根据权重比例将请求分配给服务器。 权重较高的服务器会接收更多的请求。  
    优点： 可以根据服务器的性能调整请求分配。  
    缺点： 仍然没有考虑服务器的实时负载情况。  
    配置示例：  
    ```nginx
    upstream backend {  
       server backend1.example.com weight=5;  # backend1 接收 5 份请求  
       server backend2.example.com weight=3;  # backend2 接收 3 份请求  
       server backend3.example.com weight=2;  # backend3 接收 2 份请求  
    }  
    ```
3. 最少连接（Least Connections）：  
    描述： Nginx 将新的请求分配给当前连接数最少的后端服务器。  
    优点： 考虑了服务器的实时负载情况，可以更有效地利用资源。  
    缺点： 连接数不一定是衡量服务器负载的唯一指标，某些请求可能比其他请求更消耗资源。  
    配置示例：  
    ```nginx
    upstream backend {  
        least_conn;  
        server backend1.example.com;  
        erver backend2.example.com;  
        server backend3.example.com;  
    }
    ```
4. IP Hash：  
        描述： Nginx 根据客户端的 IP 地址的哈希值将请求分配给特定的后端服务器。 这确保了来自同一 IP 地址的客户端始终连接到同一服务器 (会话保持)。  
        优点： 可以实现会话保持，对于需要维护用户会话的应用程序非常有用。  
        缺点： 如果客户端 IP 地址分布不均匀，可能会导致某些服务器过载。 另外，如果客户端使用代理服务器，所有请求将来自同一个 IP 地址。  
        配置示例：  
    ```nginx
    upstream backend {  
        ip_hash;  
        server backend1.example.com;  
        server backend2.example.com;  
        server backend3.example.com;  
    }
    ```
5. Generic Hash (Nginx Plus)：  
    描述： Nginx Plus 版本提供了一种更通用的哈希算法，允许您根据任何请求变量（例如 URL、cookie 或 HTTP 头部）的哈希值将请求分配给后端服务器。  
    优点： 比 IP Hash 更灵活，可以实现更复杂的会话保持策略。  
    缺点： 仅适用于 Nginx Plus 版本。  
    配置示例：  
    ```nginx
    upstream backend {  
        hash $request_uri consistent;  # 基于请求 URI 进行哈希  
        server backend1.example.com;  
        server backend2.example.com;  
        server backend3.example.com;  
    }
    ```
6. Random (Nginx Plus)：  
    描述： Nginx Plus 版本提供了一种随机选择后端服务器的算法。 您可以选择完全随机，或者指定两个服务器，让 Nginx 随机选择，但倾向于选择第一个服务器。  
    优点： 简单，并且可以用于一些特殊的场景。  
    缺点： 没有考虑服务器的负载情况。  
    配置示例：  
    ```nginx
    upstream backend {  
        random two; # 随机选择两个服务器，倾向于选择第一个  
        server backend1.example.com;  
        server backend2.example.com;  
        server backend3.example.com;  
    }
    ```
7. 健康检查：  
    除了选择负载均衡算法之外，配置健康检查也很重要。 Nginx 可以定期检查后端服务器的健康状况，如果服务器出现故障，Nginx 会自动将其从负载均衡池中移除，直到服务器恢复正常。  
    配置示例：  
    ```nginx
    upstream backend {  
    server backend1.example.com max_fails=3 fail_timeout=30s;  
    server backend2.example.com max_fails=3 fail_timeout=30s;  
    server backend3.example.com max_fails=3 fail_timeout=30s;  
    }  
    ```
    max_fails=3：在 fail_timeout 时间内，如果服务器连接失败超过 3 次，则认为服务器不可用。  
    fail_timeout=30s：服务器被标记为不可用的时间。  


## 玩家真实ip传递
关闭paper端，打开paper文件夹下的config文件夹下的paper-global.yml，修改配置行,找到proxy-protocol: false，把false改成true
```yml
  proxy-protocol: true
```
![paper配置文件](https://img.antares.xin/nginx-mc/4.png)
这个的目的主要是让paper知道自己是后端服务器，让它接受从反向代理传过来的玩家ip，如果不开启这一项就会导致在paper上，所有的玩家ip都是反向代理服务器的那个ip。这个功能打开后，直接连paper是连不上了，只能从反向代理服务器上走。
同时nginx的配置文件也需要修改
```nginx
stream {
    upstream minecraft {
        server 114.5.1.4:25566; #你的mc服务器的地址1
        server 114.5.1.4:25567; #你的mc服务器的地址2
    }

    server {
        listen 25565 ;  # 反向代理服务器监听的端口
        proxy_pass minecraft;
        proxy_protocol on; #开启proxy protocol协议来传递真实ip
        tcp_nodelay on;
        proxy_timeout 300s;
    }
}
```
![nginx配置文件](https://img.antares.xin/nginx-mc/5.png)

在修改后重启nginx，再次登录服务器可以看到成功获取到了玩家的真实ip。

![服务端](https://img.antares.xin/nginx-mc/6.png)

## 安全方面
有了反向代理之后，我们可以让mc服务器的端口只允许反向代理服务器访问，其他ip一律禁掉。  
windows可以在高级防火墙设置里面设置规则，放行mc的端口，同时只允许特定ip访问。  
![windows防火墙](https://img.antares.xin/nginx-mc/7.png)
如果mc运行在云服务器上，还可以在云服务器的安全组里设置仅允许某些ip访问。 

