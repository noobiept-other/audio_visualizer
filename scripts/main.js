var G = {
        CANVAS: null,
        STAGE: null,
        FPS: 60
    };

var BARS = [];
var SHAPE_WIDTH;


window.onload = function()
{
G.CANVAS = document.querySelector( '#MainCanvas' );
G.STAGE = new createjs.Stage( G.CANVAS );

G.CANVAS.width = 700;
G.CANVAS.height = 400;


Sound.init();
Menu.init();

    // files can be dragged and dropped on the body element
document.body.addEventListener( 'dragenter', function( event )
    {
    event.stopPropagation();
    event.preventDefault();
    });
document.body.addEventListener( 'dragover', function( event )
    {
    event.stopPropagation();
    event.preventDefault();
    });
document.body.addEventListener( 'drop', function( event )
    {
    event.stopPropagation();
    event.preventDefault();

    Menu.addSound( event.dataTransfer.files[ 0 ] );
    });

document.body.addEventListener( 'keyup', keyboardShortcuts );

    // :: draw the bar shapes :: //
var numberOfPoints = Sound.getNumberOfPoints();
SHAPE_WIDTH = Math.floor( G.CANVAS.width / numberOfPoints );

for (var a = 0 ; a < numberOfPoints ; a++)
    {
    var bar = new Bar( SHAPE_WIDTH * a, G.CANVAS.height );

    BARS.push( bar );
    }

createjs.Ticker.setFPS( G.FPS );
createjs.Ticker.on( 'tick', tick );
};


function keyboardShortcuts( event )
{
switch( event.keyCode )
    {
        // space key
    case 32:
        Menu.startStop();
        break;
    }
}


function tick( event )
{
if ( !Sound.isPlaying() )
    {
    return;
    }


var numberOfPoints = Sound.getNumberOfPoints();
var freqByteData = Sound.getByteFrequencyData();

for (var a = 0 ; a < numberOfPoints ; a++)
    {
    var value = freqByteData[ a ];
    var percent = value / 256;
    var height = 0.9 * G.CANVAS.height * percent;

    BARS[ a ].setDimensions( SHAPE_WIDTH, -height );
    }


G.STAGE.update();
}
