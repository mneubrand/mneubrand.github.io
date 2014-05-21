---
layout: post
title: bomb.js entered into js13kGames
date: 2012-09-06 00:00:00
---
I finally finished up my js13kGames entry bomb.js. You can check it out on the js13kGames entry page here: [http://js13kgames.com/entries/bomb-js/](http://js13kgames.com/entries/bomb-js/).

The sound effects in the game are dynamically created with [jsfxr](https://github.com/mneubrand/jsfxr), a port of Tom Vian’s [as3fxr](http://www.superflashbros.net/as3sfxr/) I created. Porting from ActionScript to JavaScript was pretty straightforward. Instead of Flash’s Sound API jsfxr uses TypedArrays and the Blob API to create a temporary .wav file which can be played through HTML5 Audio.

The background music was created by rez from [chiptune.com](http://www.chiptune.com/) who thankfully gave me permission to use it. The tune is called "Bubble toast (score)" and is in the .mod file format. To play it back I use an extremely stripped down version of [jsmodplayer](https://github.com/BillyWM/jsmodplayer). Every line of code which wasn’t essential to play back this specific .mod was ripped out and instead of dynamicaudio I reused the jsfxr routine to create a .wav file.

To save space all graphics in the game are drawn with canvas primitives instead of graphic files. Usually I created them in inkscape first with the simplest shapes possible and then translated them to canvas calls. Though this procedure was a major pain in the ass it allowed me to pack some nice graphical variety into the 13kb limit.

For minification I use Closure in Advanced Mode followed by UglifyJS. I also experimented with JSCrush and Packify. In the end though those tools are replacing recurring sequences of characters which is very similar to what zip compression does anyways. So they ended up loosing whatever they gained in bytecount when I created the zip in the last build step. Their runtimes were also horrible and it took minutes for them to process the entire script. The entry ended up being 12816 bytes, well under the 13312 bytes limit.