---
layout: post
title: Pot Fall (#GPCv12)
date: 2012-04-17 00:00:00
---
After following several game jams/prototype challenges like Game Prototype Challenge, [Ludum Dare](http://ludumdare.com), and [Experimental Gameplay Project](http://experimentalgameplay.com/) for a while, I finally got around to participate in one of them.

[Pot Fall](projects/bacterial-world/index.html) is my entry for #GPCv12. The themes were MOMENTUM and FLOURISH.  So I think a falling flower pot fits those nicely. I prototyped the idea on a paper notebook on my way home from work and was quite discouraged by the outcome as most of the drawings looked pretty crappy (I suck at drawing). But after starting to digitize some of the ideas by redrawing them with the calligraphic tool in Inkscape I really started to like the look and feel I got.

![Pot Fall Screenshot]({{ site.url }}/assets/pot_fall.png)

The game itself is implemented in JavaScript using the HTML5 Canvas element and requestAnimationFrame for drawing and the HTML5 Audio Tag for background music (didn’t get around to implement proper preloading for the audio so it is going to start with some delay and might be halting from time to time when it is played for the first time). To get started more quickly I used [html5boilerplate.com](http://html5boilerplate.com)

Everything is cluttered into the global namespace and there are a lot of unnecessary window.setTimeout calls for spawning objects, etc. which should be consolidated into the main game loop called by requestAnimationFrame instead. Collision checking isn’t implemented properly either but it works good enough. The game is also only optimized for one resolution and doesn’t scale but you have to cut corners in a prototype somewhere.

All in all I am pretty happy how it turned out after putting ~12h of work into it and considering that it was my first entry in a prototype challenge/game jam ever. All source and assets are available on [GitHub](https://github.com/mneubrand/pot-fall).

PS: "Flight of the Bumblebee" version used is from the [US Army Band](http://archive.org/details/FlightOfTheBumblebee). Apparently their work is public domain ("This file is a work of a sailor or employee of the U.S. Army, taken or made during the course of the person’s official duties. As a work of the U.S. federal government, the file is in the public domain."). Learned something new there.