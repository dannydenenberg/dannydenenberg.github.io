---
title: Setting up an Apache server on a Raspberry Pi
permalink: apache-server-pi
---

## Contents

- [Install apache](#install-apache)
- [Test the web server](#test-the-web-server)
- [Changing the default page](#changing-the-default-page)
- [Install PHP (If you want)](#install-php-if-you-want)
- [Making it public](#making-it-public)
- [Port forwarding](#port-forwarding)

## Install apache

1. Install apache. Head into terminal and update the available packages

````bash
$ sudo apt-get update
```<!--more-->

2. Then, install apache2

```bash
$ sudo apt-get install apache2 -y
````

## Test the web server

By default, Apache puts a test HTML file in the web folder. This default web page is served when you browse to http://localhost/ on the pi itself, or http://192.168.0.6 (whatever the pi's internal ip address is) from another computer on the local network. To find the pi's ip address, type `hostname -I` at the terminal. Learn more about [finding IP's](https://www.raspberrypi.org/documentation/remote-access/ip-address.md)

The default page will look something like this:

![](https://i.snap.as/btmE04z.png)

If you see this, you have apache working!

## Changing the default page

This default web page is an HTML file on the filesystem. It is located at `/var/www/html/index.html`.

Navigate to this directory in terminal and see what is in there:

```bash
$ cd /var/www/html
$ ls -al
```

This will spit out:

```bash
total 12
drwxr-xr-x  2 root root 4096 Jan  8 01:29 .
drwxr-xr-x 12 root root 4096 Jan  8 01:28 ..
-rw-r--r--  1 root root  177 Jan  8 01:29 index.html
```

This means that there is one file in /var/www/html/ called `index.html` and is owned by the `root` user. In order to edit the file, you have to change ownership. You could use `sudo`. Like this: `sudo chown pi: index.html`.

Now, if you want to put files in your website, you can place them in the `/var/www/html` folder!

## Install PHP (If you want)

Go into terminal and type:

```bash
$ sudo apt-get install php libapache2-mod-php -y
```

Now, you can run php from your server. We are going to try it!

Go into the web folder where `index.html` is stored (`/var/www/html`) and remove the index by typing:

```bash
$ sudo rm index.html
```

Now, we are going to create an index for our site in php. Create and edit a new index:

```bash
$ sudo nano index.php
```

_NOTE: Nano is a text editor pre-installed on all Raspberry Pi's (and Linux/Unix devices for that matter)_

Put some PHP in it (we'll make it dynamic):

```php
<?php echo "hello world. Today is " . date('Y-m-d H:i:s'); ?>
```

## Making it public

This will explain how others can access your web site through port forwarding and your IPv4 address.

Go to terminal. If you type `ifconfig` and press enter, you will get something like this:

```bash
pi@raspberrypi:~ $ ifconfig
eth0      Link encap:Ethernet  HWaddr b8:27:eb:96:cc:5a
          inet addr:192.168.0.10  Bcast:192.168.0.255  Mask:255.255.255.0
          inet6 addr: fe80::bb8e:9610:ab7b:7ae5/64 Scope:Link
          inet6 addr: 2600:8804:1e80:6e30:c8b6:a7d8:c897:cd8f/64 Scope:Global
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:18607 errors:0 dropped:0 overruns:0 frame:0
          TX packets:8644 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000
          RX bytes:2282499 (2.1 MiB)  TX bytes:1025772 (1001.7 KiB)

lo        Link encap:Local Loopback
          inet addr:127.0.0.1  Mask:255.0.0.0
          inet6 addr: ::1/128 Scope:Host
          UP LOOPBACK RUNNING  MTU:65536  Metric:1
          RX packets:101 errors:0 dropped:0 overruns:0 frame:0
          TX packets:101 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1
          RX bytes:9505 (9.2 KiB)  TX bytes:9505 (9.2 KiB)

wlan0     Link encap:Ethernet  HWaddr b8:27:eb:c3:99:0f
          inet addr:192.168.0.200  Bcast:192.168.0.255  Mask:255.255.255.0
          inet6 addr: fe80::ba27:ebff:fec3:990f/64 Scope:Link
          inet6 addr: 2600:8804:1e80:6e30:ba27:ebff:fec3:990f/64 Scope:Global
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:58092 errors:0 dropped:48756 overruns:0 frame:0
          TX packets:830 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000
          RX bytes:9698158 (9.2 MiB)  TX bytes:90407 (88.2 KiB)
```

Now, if you want to get your internal ip address, you can search for the value after `inet addr:my.ip.add.ress`. Search for it like this:

```bash
$ ifconfig | grep "inet addr:"
```

This address you can type into any computer attatched to the local network and be able to access your server's site.

**But what if you want for everyone to be able to access your website?**

To do this you have to use something called **port forwarding**. Port forwarding makes it so that when a request comes in to your router on a certain port, it can be redirected to a local computer. We will make it so that when you type in the browser `my.routers.ip.address:8090` you will be able to access your website from anywhere.

## Port forwarding

1. Log into your router's configuration page. To do this, go into your browser and type in the ip for the page. Usually the ip is something like this: `192.168.0.1`. If it is not that, search the web for your router's configuration page address and type that as the url.

2. When you get to the login page you will need to input the username and password. Usually, the username is `admin` and the password is `password`

3. When you are in, navigate to a tab called firewalls, and find a page called `port forwarding/virtual servers`.

4. To add a port forwarding rule, click `add`

5. Fill out all of the ports with this number: `8090`. _NOTE: I would normally use port `80` so people would not have to bother with typing the port more than once, but some companies (like cox) do not allow forwarding on 80_
6. For the IP address, put in the ip for your raspberry pi (inet addr: **my.r.pi's.ip**). We found our pi's ip in the previous section.

7. For the option to use `TCP`, `UDP`, or `BOTH`, choose `BOTH`.

8. Click the add button

You have now successfully added port forwarding for your website and can access it outside of LAN!
