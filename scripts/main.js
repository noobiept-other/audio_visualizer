/*
    createjs
        easeljs : 0.7
        soundjs : 0.5
 */

var G = {
        CANVAS: null,
        CANVAS_DEBUG: null,
        STAGE: null,
        DEBUG: true,
        FPS: 30
    };

var BASE_URL = '';

var BARS = [];
var SHAPE_WIDTH;


    // box2dweb
var WORLD;
var SCALE = 30;

var b2World = Box2D.Dynamics.b2World;
var b2Body = Box2D.Dynamics.b2Body;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;


window.onload = function()
{
G.CANVAS = document.querySelector( '#MainCanvas' );
G.STAGE = new createjs.Stage( G.CANVAS );
G.CANVAS_DEBUG = document.querySelector( '#DebugCanvas' );

G.CANVAS.width = 700;
G.CANVAS.height = 400;

var canvasPosition = G.CANVAS.getBoundingClientRect();

G.CANVAS_DEBUG.width = G.CANVAS.width;
G.CANVAS_DEBUG.height = G.CANVAS.height;

G.CANVAS_DEBUG.style.left = canvasPosition.left + 'px';
G.CANVAS_DEBUG.style.top = canvasPosition.top + 'px';

    // calls start() if the audio loads
Audio.init( start );
};


function start()
{
initMenu();

WORLD = new b2World(
        new b2Vec2( 0, 10 ),    // gravity
        true                    // allow sleep
    );


    // :: create the walls around the canvas :: //
var thickness = 1;

var fixDef = new b2FixtureDef;

fixDef.density = 1;
fixDef.friction = 0.5;
fixDef.restitution = 0.2;
fixDef.shape = new b2PolygonShape;

var bodyDef = new b2BodyDef;

bodyDef.type = b2Body.b2_staticBody;

    // bottom
fixDef.shape.SetAsBox( G.CANVAS.width / SCALE, thickness / SCALE );
bodyDef.position.Set( 0, (G.CANVAS.height - thickness) / SCALE );
WORLD.CreateBody( bodyDef ).CreateFixture( fixDef );

    // top
fixDef.shape.SetAsBox( G.CANVAS.width / SCALE, thickness / SCALE );
bodyDef.position.Set( 0, 0 );
WORLD.CreateBody( bodyDef ).CreateFixture( fixDef );

    // left
fixDef.shape.SetAsBox( thickness / SCALE, G.CANVAS.height / SCALE );
bodyDef.position.Set( 0, 0 );
WORLD.CreateBody( bodyDef ).CreateFixture( fixDef );

    // right

fixDef.shape.SetAsBox( thickness / SCALE, G.CANVAS.height / SCALE );
bodyDef.position.Set( (G.CANVAS.width - thickness) / SCALE, 0 );
WORLD.CreateBody( bodyDef ).CreateFixture( fixDef );

    // :: setup the debug draw :: //
var debugDraw = new b2DebugDraw();

debugDraw.SetSprite( G.CANVAS_DEBUG.getContext( '2d' ) );
debugDraw.SetDrawScale( SCALE );
debugDraw.SetFillAlpha( 0.5 );
debugDraw.SetLineThickness( 1 );
debugDraw.SetFlags( b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit );

WORLD.SetDebugDraw( debugDraw );


    // :: draw the shapes :: //
var numberOfPoints = Audio.getNumberOfPoints();
SHAPE_WIDTH = G.CANVAS.width / numberOfPoints;


for (var a = 0 ; a < numberOfPoints ; a++)
    {
    var bar = new Bar( SHAPE_WIDTH * a, G.CANVAS.height );

    BARS.push( bar );
    }


    // :: add the player :: //
bodyDef.type = b2Body.b2_dynamicBody;

fixDef.shape.SetAsBox( 10 / SCALE, 10 / SCALE );
bodyDef.position.x = 20 / SCALE;
bodyDef.position.y = 20 / SCALE;

var player = WORLD.CreateBody( bodyDef ).CreateFixture( fixDef );

createjs.Ticker.setFPS( G.FPS );
createjs.Ticker.on( 'tick', tick );
}


function tick()
{
if ( !Audio.isPlaying() )
    {
    return;
    }

var numberOfPoints = Audio.getNumberOfPoints();
var freqByteData = Audio.getByteFrequencyData();

for (var a = 0 ; a < numberOfPoints ; a++)
    {
    var value = freqByteData[ a ];
    var percent = value / 256;
    var height = G.CANVAS.height * percent;

    BARS[ a ].setDimensions( SHAPE_WIDTH, -height );
    }

WORLD.Step( 1 / G.FPS, 10, 10 );
WORLD.DrawDebugData();
WORLD.ClearForces();

G.STAGE.update();
}


function initMenu()
{
    // start/stop
var startElement = document.querySelector( '#StartStop' );

Audio.stop();
startElement.value = 'Start';

startElement.onclick = function()
    {
    if ( Audio.isPlaying() )
        {
        startElement.value = 'Start';

        Audio.stop();
        }

    else
        {
        startElement.value = 'Stop';

        Audio.start();
        }
    };

    // volume
var volume = document.querySelector( '#Volume' );
var volumeValue = document.querySelector( '#VolumeValue' );

var currentVolume = createjs.Sound.getVolume();

volume.value = currentVolume;
volumeValue.innerHTML = currentVolume;

volume.oninput = function( event )
    {
    volumeValue.innerHTML = volume.value;
    createjs.Sound.setVolume( volume.value );
    };
}