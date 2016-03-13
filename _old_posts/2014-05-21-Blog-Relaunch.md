---
title: Blog Relaunch
date: 2014-05-21 00:00:00
---
I finally completed the relaunch of my site. I'm now using [GitHub Pages](https://pages.github.com/) and [Jekyll](http://jekyllrb.com/) to generate the site and don't self-host Wordpress on my slow VPS anymore. The theme is based on [Bootstrap](http://getbootstrap.com/) and uses the [Flat UI theme](http://designmodo.github.io/Flat-UI/) from designmodo. I've never used bootstrap before but it worked out great so far.

Originally I just put a project/games portfolio and a resume on the page and used [mustache.js](https://github.com/janl/mustache.js) templates to generate frontend. But this approach wasn't very scalable so I ported the mustache templates to Liquid templates used by Jekyll. Because I used mustache.js all template input data was in JSON format. Unfortunately GitHub pages doesn't support Jekyll Plugins I couldn't make use of them to expose JSON in Liquid templates directly. Instead I used a node.js based command-line utility ([json2yaml](https://github.com/coolaj86/json2yaml)) and put the resulting yaml files into the _data folder.

I'll make some more tweaks over the next weeks but so far I'm pretty happy with the new look & feel.