var requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

var renderToCanvas = function (width, height, renderFunction) {
    var buffer = document.createElement('canvas');
    buffer.width = width;
    buffer.height = height;
    renderFunction(buffer.getContext('2d'));
    return buffer;
};

var drill = (function () {
    var SOUND_ENABLED = true;

    var State = {
        STOPPED: 'stopped',
        RUNNING: 'running',
        DEAD: 'dead',
        WON: 'won',
        GAME_WON: 'game_won'
    }

    var LEFT = 0;
    var RIGHT = 1;

    var OIL = JSON.stringify([ 0, 0, 0, 255 ]);
    var SELF = JSON.stringify([ 48, 78, 95, 255 ]);
    var STONE = JSON.stringify([ 102, 102, 102, 255 ]);
    var TOUGH = JSON.stringify([ 203, 192, 160, 255 ]);
    var WATER = JSON.stringify([ 154, 213, 221, 255 ]);

    var drillSprites = [
        'drill/frame0.png', 'drill/frame1.png', 'drill/frame2.png', 'drill/frame3.png', 'drill/frame4.png', 'drill/frame5.png'
    ];

    var fireSprites = [
        'fire/frame0.png', 'fire/frame1.png', 'fire/frame2.png', 'fire/frame3.png'
    ];

    var miscSprites = [
        'header.png', 'header_fill.png', 'check.png', 'level_cleared.png', 'level_failed.png', 'game_won.png'
    ];

    var keys = [];

    var ctx;
    var canvasWidth, canvasHeight;

    var sprites = {};
    var sounds = {};

    var currentSound = null;

    var levels = [
        {
            svg: 'levels/level1.svg',
            width: 2988,
            height: 3348,
            oilRegions: [
                { x: 140, y: 2494, width: 1680, height: 737 }
            ]
        },
        {
            svg: 'levels/level2.svg',
            width: 4113,
            height: 4308,
            oilRegions: [
                { x: 2308, y: 3300, width: 1578, height: 918 }
            ]
        },
        {
            svg: 'levels/level3.svg',
            width: 4113,
            height: 4308,
            oilRegions: [
                { x: 1707, y: 1902, width: 894, height: 546 },
                { x: 2145, y: 2628, width: 456, height: 426 }
            ]
        },
        {
            svg: 'levels/level4.svg',
            width: 4113,
            height: 4308,
            oilRegions: [
                { x: 797, y: 2814, width: 905, height: 738 },
                { x: 2391, y: 3006, width: 876, height: 612 }
            ]
        },
        {
            svg: 'levels/level5.svg',
            width: 5523,
            height: 4308,
            oilRegions: [
                { x: 1763, y: 408, width: 1150, height: 1100 },
                { x: 2950, y: 384, width: 1150, height: 1100 },
                { x: 569, y: 1338, width: 1150, height: 1100 },
                { x: 551, y: 2238, width: 1150, height: 1100 },
                { x: 1757, y: 3168, width: 1150, height: 1100 },
                { x: 2956, y: 2214, width: 1150, height: 1100 },
                { x: 4167, y: 3186, width: 1150, height: 1100 },
                { x: 4173, y: 1338, width: 1150, height: 1100 }
            ]
        },
        {
            svg: 'levels/level6.svg',
            width: 5523,
            height: 4308,
            oilRegions: [
                { x: 395, y: 132, width: 1189, height: 1044 },
                { x: 401, y: 3114, width: 1189, height: 1044 },
                { x: 4065, y: 3118, width: 1189, height: 1044 },
                { x: 4065, y: 150, width: 1189, height: 1044 },
                { x: 1643, y: 1314, width: 2405, height: 1506 }
            ]
        }
    ]

    // per level
    var level;
    var currentLevel;

    var checks = {};
    var player;


    function loop() {
        ctx.save();

        // Center at player
        var offsetX = Math.max(0, Math.min(level.width - canvasWidth, player.x - canvasWidth / 2));
        var offsetY = Math.max(0, Math.min(level.height - canvasHeight + 189, player.y - canvasHeight / 2));
        ctx.translate(-offsetX, -offsetY);

        // Clear
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, 300, 150);

        // Header
        ctx.drawImage(sprites['header_fill.png'], 0, 0, level.width, 189);
        ctx.drawImage(sprites['header.png'], (level.width - canvasWidth) / 2, 0);

        // Current level state
        ctx.drawImage(level.canvas, 0, 189);

        // Player
        updatePlayer();

        // Draw checks
        for (var check in checks) {
            var size = 70;
            ctx.drawImage(sprites['check.png'], checks[check].x - size / 2, checks[check].y - size / 2, size, size);
        }

        ctx.restore();

        if (player.state == State.DEAD) {
            ctx.drawImage(sprites['level_failed.png'], (canvasWidth - 608) / 2, (canvasHeight - 131) / 2);
        } else if (player.state == State.WON) {
            ctx.drawImage(sprites['level_cleared.png'], (canvasWidth - 685) / 2, (canvasHeight - 131) / 2);
        } else if (player.state == State.GAME_WON) {
            ctx.drawImage(sprites['game_won.png'], (canvasWidth - 442) / 2, (canvasHeight - 132) / 2);
        }

        ctx.fillStyle = '#d35f5f';
        ctx.fillRect(canvasWidth - 221, 11, 210, 200 * level.height / level.width + 10);
        ctx.drawImage(level.miniMap, canvasWidth - 216, 16);

        if (player.y > 190) {
            var miniMapPlayerX = player.x / level.width * 200;
            var miniMapPlayerY = (player.y - 189) / level.height * (200 * level.height / level.width);

            ctx.beginPath();
            ctx.arc(canvasWidth - 216 + miniMapPlayerX, 16 + miniMapPlayerY, 4, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
        }

        requestAnimationFrame(loop);
    }

    function updatePlayer() {
        var x = player.x - player.width / 2;
        var y = player.y - player.height / 2;

        if (player.state == State.STOPPED || player.state == State.DEAD || player.state == State.WON || player.state == State.GAME_WON) {

            ctx.save();
            ctx.translate(player.x, player.y);
            ctx.rotate(toRadians(player.rotation));
            ctx.translate(-player.x, -player.y);
            ctx.drawImage(sprites[drillSprites[0]], x, y, player.width, player.height);
            ctx.restore();

            if (player.state == State.DEAD) {
                // Update animations state
                player.fire.framesSinceLastUpdate++;
                if (player.fire.framesSinceLastUpdate >= 8) {
                    player.fire.framesSinceLastUpdate = 0;
                    player.fire.currentFrame++;
                    if (player.fire.currentFrame > fireSprites.length - 1) {
                        player.fire.currentFrame = 0;
                    }
                }
                ctx.drawImage(sprites[fireSprites[player.fire.currentFrame]], x, y, player.fire.width, player.fire.height);
            }
        } else if (player.state == State.RUNNING) {
            // Update animations state
            player.framesSinceLastUpdate++;
            if (player.framesSinceLastUpdate >= 5) {
                player.framesSinceLastUpdate = 0;
                player.currentFrame++;
                if (player.currentFrame > drillSprites.length - 1) {
                    player.currentFrame = 0;
                }
            }

            // Draw
            ctx.save();
            ctx.translate(player.x, player.y);
            ctx.rotate(toRadians(player.rotation));
            ctx.translate(-player.x, -player.y);
            ctx.drawImage(sprites[drillSprites[player.currentFrame]], x, y, player.width, player.height);
            ctx.restore();

            // Get current material that's drilled through
            var lookAheadX = 40 * Math.cos(toRadians(90 + player.rotation));
            var lookAheadY = 40 * Math.sin(toRadians(90 + player.rotation));
            var imageData = level.canvasCtx.getImageData(player.x + lookAheadX, player.y - 189 + lookAheadY, 1, 1);
            var modifier = getModifier([ imageData.data[0], imageData.data[1], imageData.data[2], imageData.data[3] ]);
            if (modifier == 0 || (player.y < 190 && player.started)) {
                player.state = State.DEAD;
                sounds[currentSound].stop();
                if(SOUND_ENABLED) {
                    sounds['explosion'].play();
                }
            } else if (modifier == -1) {
                for (var i = 0; i < level.oilRegions.length; i++) {
                    var checkX = player.x + lookAheadX;
                    var checkY = player.y + lookAheadY - 189;

                    var isContained = contains(level.oilRegions[i], checkX, checkY);
                    var notYetChecked = !checks.hasOwnProperty(i + '');
                    if (isContained && notYetChecked) {
                        console.log('Check at ' + checkX + ',' + checkY);
                        checks[i + ''] = { x: checkX, y: checkY + 189};
                        if(SOUND_ENABLED) {
                            sounds['check'].play();
                        }

                        if (Object.keys(checks).length >= level.oilRegions.length) {
                            if (currentLevel < levels.length - 1) {
                                player.state = State.WON;
                            } else {
                                player.state = State.GAME_WON;
                            }
                            sounds[currentSound].stop();
                        }
                    }
                }
                modifier = 1;
            }

            var newSound = getSound(modifier);
            if (player.state == State.RUNNING && currentSound != newSound) {
                sounds[currentSound].stop();
                if(SOUND_ENABLED) {
                    sounds[newSound].play({ loops: 3 });
                }
                currentSound = newSound;
            }

            // Calculate new position
            var moveX = modifier * player.speed * Math.cos(toRadians(90 + player.rotation));
            var moveY = modifier * player.speed * Math.sin(toRadians(90 + player.rotation));

            // Draw dirt in offscreen canvas
            level.canvasCtx.save();
            var long = Math.max(Math.abs(moveX), Math.abs(moveY));
            for (var i = 0; i < long; i++) {
                level.canvasCtx.fillStyle = '#304e5f';
                level.canvasCtx.beginPath();
                level.canvasCtx.arc(player.x + moveX * i / long, player.y - 189 + moveY * i / long, 16, 0, 2 * Math.PI, false);
                level.canvasCtx.fill();
                level.canvasCtx.closePath();
            }
            level.canvasCtx.restore();

            // Update position
            player.x += moveX;
            player.y += moveY;

            // Handle input
            if (player.y > 190) {
                player.started = true;
                var maxIndex = getMaxIndex(keys);
                if (maxIndex == LEFT) {
                    //console.log('Turning left');
                    player.rotation += player.rotationSpeed;
                } else if (maxIndex == RIGHT) {
                    //console.log('Turning right');
                    player.rotation -= player.rotationSpeed;
                }
            }
        }
    }

    function contains(region, x, y) {
        return x > region.x && x < region.x + region.width
            && y > region.y && y < region.y + region.height;
    }

    function getSound(modifier) {
        if(modifier < 1) {
            return 'drill_tough';
        } else if(modifier > 1) {
            return 'drill_fast';
        } else {
            return 'drill_normal';
        }
    }

    function getModifier(imageData) {
        var comp = JSON.stringify(imageData);
        if (TOUGH === comp) {
            return 0.3;
        } else if (WATER == comp) {
            return 3;
        } else if (STONE == comp || SELF == comp) {
            return 0;
        } else if (OIL == comp) {
            return -1;
        } else {
            return 1;
        }
    }

    function toRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    function getMaxIndex(keys) {
        var maximum = 0;
        var maxIndex = -1;
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] > maximum) {
                maximum = keys[i];
                maxIndex = i;
            }
        }
        return maxIndex;
    }


    function action() {
        if (player.state == State.STOPPED) {
            player.state = State.RUNNING;
            if(SOUND_ENABLED) {
                sounds['drill_normal'].play({ loops: 3 });
            }
            currentSound = 'drill_normal';
        } else if (player.state == State.DEAD) {
            loadLevel(currentLevel);
        } else if (player.state == State.WON) {
            loadLevel(currentLevel + 1);
        }
    }

    function loadLevel(toLoad) {
        level = levels[toLoad];
        currentLevel = toLoad;
        checks = {};

        level.canvas = renderToCanvas(level.width, level.height, function (ctx) {
            ctx.drawSvg(level.svg, 0, 0, level.width, level.height);
        });
        level.canvasCtx = level.canvas.getContext('2d');
        level.miniMap = renderToCanvas(200, 200 * level.height / level.width, function (ctx) {
            ctx.drawSvg(level.svg, 0, 0, 200, 200 * level.height / level.width);
        });

        player = {
            // Position & State
            x: 0,
            y: 0,
            rotation: 0,
            started: false,
            state: State.STOPPED,

            // Constants
            width: 70,
            height: 120,
            speed: 8,
            rotationSpeed: 3,

            // Animation
            framesSinceLastUpdate: 0,
            currentFrame: 0,
            fire: {
                width: 71,
                height: 90,
                framesSinceLastUpdate: 0,
                currentFrame: 0
            }
        };

        player.x = level.width / 2;
        player.y = 105;
    }

    function init() {
        console.log('Initializing');
        ctx = document.getElementById('main').getContext('2d');
        $('#main').attr('height', window.innerHeight);
        $('#instructions').height(window.innerHeight);

        canvasWidth = $('#main').width();
        canvasHeight = window.innerHeight;
        console.log('Width: ' + canvasWidth + ' Height: ' + canvasHeight);

        var loaded = 0;
        var sources = [];
        var soundsLoaded = 0;
        var soundPaths = [ 'drill_normal', 'drill_fast', 'drill_tough', 'check', 'explosion' ];

        for (var i = 0; i < drillSprites.length; i++) {
            sources.push('img/' + drillSprites[i]);
        }
        for (var i = 0; i < miscSprites.length; i++) {
            sources.push('img/' + miscSprites[i]);
        }
        for (var i = 0; i < fireSprites.length; i++) {
            sources.push('img/' + fireSprites[i]);
        }

        var onload = function () {
            loaded++;
            var name = this.id.substr(this.id.indexOf('/') + 1);
            console.log('Loaded ' + this.id);
            sprites[name] = this;
            if (loaded >= sources.length && soundsLoaded >= soundPaths.length) {
                console.log('Starting game');
                loadLevel(0);
                requestAnimationFrame(loop);
            }
        }

        for (var i = 0; i < sources.length; i++) {
            var imageObj = new Image();
            imageObj.onload = onload;
            imageObj.id = sources[i];
            imageObj.src = sources[i];
        }

        var onloadSound = function () {
            soundsLoaded++;
            console.log('Loaded sound ' + this.id);
            if (loaded >= sources.length && soundsLoaded >= soundPaths.length) {
                console.log('Starting game');
                loadLevel(0);
                requestAnimationFrame(loop);
            }
        }

        function loadSounds() {
            for (var i = 0; i < soundPaths.length; i++) {
                sounds[soundPaths[i]] = soundManager.createSound({
                    id: soundPaths[i],
                    url: 'sfx/' + soundPaths[i] + '.wav',
                    autoLoad: true,
                    volume: 60,
                    onload: onloadSound
                });
            }
        }

        soundManager.setup({
            url: 'js/vendor/swf',
            preferFlash: true,
            debugMode: false,
            flashVersion: 9, // optional: shiny features (default = 8)
            // optional: ignore Flash where possible, use 100% HTML5 mode
            // preferFlash: false,
            onready: function () {
                loadSounds();
            }
        });


        //Set up key listener
        var keyListener = function (e) {
            var pressed = e.type == 'keydown';
            switch (e.keyCode) {
                case 65: //a
                case 37: //left arrow
                    keys[RIGHT] = pressed ? e.timeStamp : 0;
                    return true;

                case 68: //d
                case 39: //left arrow
                    keys[LEFT] = pressed ? e.timeStamp : 0;
                    return true;

                case 32: //space
                    e.preventDefault();
                    if (!pressed) {
                        action();
                    }
                    return true;
            }
        };
        document.onkeyup = keyListener;
        document.onkeydown = keyListener;
    }

    return {
        init: init
    };
})();

window.onload = drill.init;