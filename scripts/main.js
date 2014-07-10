/*
    createjs
        easeljs  : 0.7
        soundjs  : 0.5
        box2dweb : 2.1
 */

var G = {
        CANVAS: null,
        CANVAS_DEBUG: null,
        STAGE: null,
        DEBUG: false,
        FPS: 60
    };

var BASE_URL = '';

var BARS = [];
var SHAPE_WIDTH;

var PLAYER = null;
var CIRCLES = [];
var NEW_CIRCLE_INTERVAL = 1000;
var NEW_CIRCLE_COUNT = 0;

    // box2dweb
var WORLD;
var SCALE = 30;

var ELEMENTS_TO_REMOVE = [];

var b2World = Box2D.Dynamics.b2World;
var b2Body = Box2D.Dynamics.b2Body;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2ContactListener = Box2D.Dynamics.b2ContactListener;

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

var listener = new b2ContactListener;

    // can't create/destroy box2d elements here
listener.BeginContact = function( contact )
    {
    var objectA = contact.GetFixtureA().GetBody().GetUserData();
    var objectB = contact.GetFixtureB().GetBody().GetUserData();

    if ( objectA && objectB )
        {
        var isEnemyA = objectA.isEnemy;
        var isEnemyB = objectB.isEnemy;

            // detect collision between the player and some other circle
        if ( isEnemyA === true && isEnemyB === false )
            {
            ELEMENTS_TO_REMOVE.push( objectA );
            }

        else if ( isEnemyA === false && isEnemyB === true )
            {
            ELEMENTS_TO_REMOVE.push( objectB );
            }
        }

    };

WORLD.SetContactListener( listener );

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
if ( G.DEBUG )
    {
    var debugDraw = new b2DebugDraw();

    debugDraw.SetSprite( G.CANVAS_DEBUG.getContext( '2d' ) );
    debugDraw.SetDrawScale( SCALE );
    debugDraw.SetFillAlpha( 0.5 );
    debugDraw.SetLineThickness( 1 );
    debugDraw.SetFlags( b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit );

    WORLD.SetDebugDraw( debugDraw );
    }


    // :: draw the shapes :: //
var numberOfPoints = Audio.getNumberOfPoints();
SHAPE_WIDTH = G.CANVAS.width / numberOfPoints;


for (var a = 0 ; a < numberOfPoints ; a++)
    {
    var bar = new Bar( SHAPE_WIDTH * a, G.CANVAS.height );

    BARS.push( bar );
    }


    // :: add the player :: //
PLAYER = new Circle( 50, 20, false );

CIRCLES.push( PLAYER );

window.addEventListener( 'keyup', keyboardShortcuts, false );
createjs.Ticker.setFPS( G.FPS );
createjs.Ticker.on( 'tick', tick );
}


function keyboardShortcuts( event )
{
var key = event.keyCode;
var impulse = 2;

if ( key == EVENT_KEY.leftArrow || key == EVENT_KEY.a )
    {
    PLAYER.applyImpulse( -impulse, 0 );
    }

else if ( key == EVENT_KEY.rightArrow || key == EVENT_KEY.d )
    {
    PLAYER.applyImpulse( impulse, 0 );
    }

else if ( key == EVENT_KEY.upArrow || key == EVENT_KEY.w )
    {
    PLAYER.applyImpulse( 0, -impulse );
    }

else if ( key == EVENT_KEY.downArrow || key == EVENT_KEY.s )
    {
    PLAYER.applyImpulse( 0, impulse );
    }
}


function tick( event )
{
if ( !Audio.isPlaying() )
    {
    return;
    }


while( ELEMENTS_TO_REMOVE.length > 0 )
    {
    var element = ELEMENTS_TO_REMOVE.pop();

    element.remove();
    }

ELEMENTS_TO_REMOVE.length = 0;

NEW_CIRCLE_COUNT += event.delta;

if ( NEW_CIRCLE_COUNT >= NEW_CIRCLE_INTERVAL )
    {
    NEW_CIRCLE_COUNT = 0;

    CIRCLES.push( new Circle( 50, 20, true ) );
    }


var numberOfPoints = Audio.getNumberOfPoints();
var freqByteData = Audio.getByteFrequencyData();

for (var a = 0 ; a < numberOfPoints ; a++)
    {
    var value = freqByteData[ a ];
    var percent = value / 256;
    var height = 0.9 * G.CANVAS.height * percent;

    BARS[ a ].setDimensions( SHAPE_WIDTH, -height );
    }


for (var a = 0 ; a < CIRCLES.length ; a++)
    {
    CIRCLES[ a ].updateShapePosition();
    }


WORLD.Step( 1 / G.FPS, 10, 10 );
WORLD.DrawDebugData();
WORLD.ClearForces();

G.STAGE.update();
}


function initMenu()
{
var container = document.querySelector( '#Menu' );

    // start/stop
var startElement = container.querySelector( '#StartStop' );

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
var volume = container.querySelector( '#Volume' );
var volumeValue = container.querySelector( '#VolumeValue' );

var currentVolume = createjs.Sound.getVolume();

volume.value = currentVolume;
volumeValue.innerHTML = currentVolume;

volume.oninput = function( event )
    {
    volumeValue.innerHTML = volume.value;
    createjs.Sound.setVolume( volume.value );
    };

container.style.display = 'block';
}