---
title: PVE折腾日记——CPU频率调整（失败）
description: PVE折腾日记——CPU频率调整（失败）
date: 2025-09-18
tags: [PVE, 服务器]
category: 杂项
author: 星辰曦羽
cover: https://img.antares.xin/assets/PVE/1.webp
layout: layouts/post.njk
---
处理器为2696 v3  
想给PVE机器降一下功耗，降低一下CPU频率，频率下去了，性能也下去了，功耗没降多少，然后又调回性能模式了

```shell
# 查看支持的 CPU 电源模式
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_available_governors
# 查看当前的 CPU 电源模式
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
```
| 电源模式    | 解释说明                                                                                                |
| ----------- | ------------------------------------------------------------------------------------------------------- |
| performance | 性能模式，将 CPU 频率固定工作在其支持的较高运行频率上，而不动态调节。                                                     |
| userspace   | 系统将变频策略的决策权交给了用户态应用程序，较为灵活。                                                                       |
| powersave   | 省电模式，CPU 会固定工作在其支持的最低运行频率上。                                                                         |
| ondemand    | 按需快速动态调整 CPU 频率，没有负载的时候就运行在低频，有负载就高频运行。                                                               |
| conservative| 与 ondemand 不同，平滑地调整 CPU 频率，频率的升降是渐变式的，稍微缓和一点。                                                              |
| schedutil   | 负载变化回调机制，后面新引入的机制，通过触发 schedutil sugov_update 进行调频动作。                                                    |

检测CPU是否支持睿频

```shell
grep -c 'physical id' /proc/cpuinfo
```

输出36，大于0说明可以睿频

修改启动项

```shell
vim /etc/default/grub
```

修改配置文件中的一行内容，修改为如下

```shell
GRUB_CMDLINE_LINUX_DEFAULT="quiet intel_pstate=disable"
```

退出后更更新grub

```shell
update-grub
```

安装cpufrequtils

```shell
apt-get install cpufrequtils
```

查看CPU

```shell
cpufreq-info
```

编辑文件

```shell
vim /etc/init.d/cpufrequtils
```

修改内容

```shell
ENABLE="true"
GOVERNOR="conservative"
MAX_SPEED="3200"
MIN_SPEED="2200"
```

重启服务

```shell
systemctl daemon-reload
/etc/init.d/cpufrequtils restart
```

后面发现问题，一直在最低速度上，速度不会上去，而且功耗基本没降  
重新修改，换回性能模式，必须是0000，否则无效

```shell
ENABLE="true"
GOVERNOR="conservative"
MAX_SPEED="0000"
MIN_SPEED="0000"
```
 
>查看CPU频率：cat /proc/cpuinfo | grep MHz