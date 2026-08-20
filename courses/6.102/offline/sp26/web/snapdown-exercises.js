/*
 * Script used in readings with Snapdown exercises.
 */

var snapdownTypingTimer = {};
const SNAPDOWN_DIAGRAM_INTERVAL = 300;

function snapdownTextboxOnChange(eltId, redrawDiagram=true) {
    var timeouts = {};

    if (redrawDiagram) {
        timeouts[eltId + '-diagram'] = { interval: SNAPDOWN_DIAGRAM_INTERVAL, function: snapdownRenderDiagram };
    }

    for (const [timeoutId, timeoutInfo] of Object.entries(timeouts)) {
        if (snapdownTypingTimer[timeoutId]) {
            clearTimeout(snapdownTypingTimer[timeoutId]);
        }
        snapdownTypingTimer[timeoutId] = setTimeout(() => timeoutInfo.function(eltId), timeoutInfo.interval);
    }
}

function snapdownRenderDiagram(eltId) {
    var snapdownElt = document.getElementById(eltId);
    if ( ! snapdownElt) { return; }
    
    var text = document.getElementById(eltId + '-text').value;
    
    var elts = document.querySelectorAll(`[id^="${eltId}-json-"]`);
    var errorElement = document.getElementById(eltId + '-err');
    snapdownElt.text = text;
    try {
        Snapdown.render(snapdownElt);
        for (var previousElt of elts) {
            if (previousElt) previousElt.remove();
            if (previousElt.id.includes("svg")) {
                previousElt.style.opacity = "1";
            }
        }
        errorElement.style.display = "none";
    } catch (err) {
        if (console && console.error) console.error(err);
        for (var previousElt of elts) {
            if (previousElt.id.includes("svg")) {
                previousElt.style.opacity = "0.5";
            }
        }
        errorElement.style.display = "block";
    }
}

window.onHandoutDidRenderThen = function(done) {
    document.body.insertAdjacentHTML('afterbegin', '<div id="snapdown-help-location"></div>');
    Snapdown.populateHelp('snapdown-help-location');
    Snapdown.renderAll(true, done);
}

window.onHandoutReady = function() {
    document.querySelectorAll('button.snapdown-show-help').forEach(function (b) {
        b.addEventListener('click', function() { Snapdown.showHelp(); });
    });
}
