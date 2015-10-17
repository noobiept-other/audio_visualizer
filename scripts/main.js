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


    // :: draw the bar shapes :: //
var numberOfPoints = Sound.getNumberOfPoints();
SHAPE_WIDTH = G.CANVAS.width / numberOfPoints;

for (var a = 0 ; a < numberOfPoints ; a++)
    {
    var bar = new Bar( SHAPE_WIDTH * a, G.CANVAS.height );

    BARS.push( bar );
    }

createjs.Ticker.setFPS( G.FPS );
createjs.Ticker.on( 'tick', tick );
};


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
