---
title: Automating Backups with Cron & GitHub
permalink: cron-github
---

Back when I was using [Ghost](https://ghost.org/) as my blogging platform, I had a problem. I wanted to keep my blog backed up, but I was too cheap to pay the extra \$1 a month for Digital Ocean to do it for me.

Being me, I found a _hacky_ way around paying.

I wrote a script to zip my ghost folder and push it up to my GitHub in some repo specifically for storing backups. Using [cron](https://en.wikipedia.org/wiki/Cron), I made it run weekly. It worked great! With git's version control, I could go through my previous backups, so it was just like how Digital Ocean might do it 👍. <!--more-->

To do this, make sure git is installed on your Linux/Unix system.

Then set your username and email in the git preferences through the terminal.

```
git config --global user.name "FIRST_NAME LAST_NAME"
git config --global user.email "MY_NAME@example.com"
```

Next create an empty secret repo in your GitHub and clone it on your machine locally.

```
git clone https://github.com/dannydenenberg/mybackupsrepo.git
```

Make sure you can stay authenticated on your local device (you don't have to enter your password to GitHub on every push up). You can use [ssh keys](https://help.github.com/en/articles/connecting-to-github-with-ssh) to do this.

Make sure you have `zip` installed with `sudo apt install zip`, then write your bash script looking something like this (example from my Ghost blog):

```bash
#!/bin/bash
zip /home/mybackupsrepo/mybackup.zip /var/www/ghost # zip the folder
cd /home/mybackupsrepo # go to the backups repo
git add . && git commit -m "$(date)" && git push origin master # commit, push
sudo rm -Rf /home/mybackupsrepo/mybackup.zip # clean
```

Make it executable: `chmod +x /home/whereveryoustoredthisbashscript`

And add it to your cronjobs. To edit the cronjobs running, execute `crontab -e` (the actual file is stored in `/var/spool/cron`).

Here is a quick reference for creating new cronjobs and how to schedule them properly:

```bash
# crontab -e
SHELL=/bin/bash
MAILTO=root@example.com
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin

# For details see man 4 crontabs

# Example of job definition:
# .---------------- minute (0 - 59)
# |  .------------- hour (0 - 23)
# |  |  .---------- day of month (1 - 31)
# |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
# |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat
# |  |  |  |  |
# *  *  *  *  * user-name  command to be executed

# backup using the rsbu program to the internal 4TB HDD and then 4TB external
01 01 * * * /usr/local/bin/rsbu -vbd1 ; /usr/local/bin/rsbu -vbd2

# Set the hardware clock to keep it in sync with the more accurate system clock
03 05 * * * /sbin/hwclock --systohc

# Perform monthly updates on the first of the month
# 25 04 1 * * /usr/bin/dnf -y update
```
