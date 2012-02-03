// keyconfs
var keyConf1 = {
    up : 'arrow-up',
    down : 'arrow-down',
    left : 'arrow-left',
    right : 'arrow-right'
};

var bot1Conf = {
    "posX" : 200,
    "posY" : 200,
    "vel" : 2,
    "color" : "blue",
};
var bot2Conf = {
    "posX" : 300,
    "posY" : 300,
    "vel" : 1,
    "color" : "red",
};

var behaviour = {
    "default" : "random",
};

function addPoints(angle, vel) {
    updatePointsBoard(angle, vel);
}

var addPointer = addPoints;

var motionEngine = new motionEngine(addPointer);
var motionEngineRunning = false;
var motionEnginePaused = false;
var points = 0;

//***************************************
// Agrego objectos al motor de movimiento
motionEngine.addObject(new car(1, 450, 200, addPointer, keyConf1, motionEngine));
motionEngine.addObject(new carBot(2, bot1Conf, addPointer, motionEngine, behaviour));
motionEngine.addObject(new carBot(3, bot2Conf, addPointer, motionEngine, behaviour));

var circuit = new circuit("circuit" + 3);
motionEngine.addObject(circuit);

for(var i = 0; i < circuit.borders.length; i++) {
    motionEngine.addObject(circuit.borders[i]);
}
//****************************************

$(document).ready(function() {
    $("button").button();
});
function updatePointsBoard(points, vel) {
    $("#points").text(points);
    $("#vel").text(vel);
}

/** captura de eventos del teclado **/
$(document).keydown(function(e) {
    if(motionEngineRunning) {
        var mkey = motionEngine.getMapped(e.keyCode);
        motionEngine.pushEvent(new event('keyboard', {
            "keycode" : mkey
        }));
    }
});
$(document).keyup(function(e) {
    if(motionEngineRunning) {
        var mkey = motionEngine.getMapped(e.keyCode);
        motionEngine.pushEvent(new event('keyboard', {
            "keyup" : mkey
        }));
    }
});
function startGame() {
    if(!motionEngineRunning) {
        motionEngineRunning = true;
        motionEngine.init();

    } else {
        motionEngine.startLoop();
    }
}

function pauseGame() {
    motionEngine.stop();
}