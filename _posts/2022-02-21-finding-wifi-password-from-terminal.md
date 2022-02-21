---
layout: post
title: Finding your wifi password from the Mac terminal
published: true
---

Have you ever wondered, "What's the password of the wifi that I'm already connected to?".

Well, here's how to find it once again. Execute this command in your termainal. Remember to replace the `<WIFI NAME>` with your network's name.

```bash
security find-generic-password -D "AirPort network password" -a "<WIFI NAME>" -g | grep "password:"
```

Also **note** that you may be prompted to enter the username and password to your computer.