(function(window)
{
function Circle( x, y, isEnemy )
{
var radius = 10;

    // shape part
var shape = new createjs.Shape();

shape.x = x;
shape.y = y;

var g = shape.graphics;

if ( isEnemy )
    {
    g.beginFill( 'red' );
    }

else
    {
    g.beginFill( 'blue' );
    }

g.drawCircle( 0, 0, radius );
g.endFill();

G.STAGE.addChild( shape );

    // body part
var bodyDef = new b2BodyDef;

bodyDef.type = b2Body.b2_dynamicBody;
bodyDef.position.x = x / SCALE;
bodyDef.position.y = y / SCALE;

var fixDef = new b2FixtureDef;

fixDef.density = 1;
fixDef.friction = 0.5;
fixDef.restitution = 0.2;
fixDef.shape = new b2CircleShape( 10 / SCALE );

var body = WORLD.CreateBody( bodyDef );

body.CreateFixture( fixDef );
body.SetUserData( this );

this.isEnemy = isEnemy;
this.shape = shape;
this.body = body;
}


Circle.prototype.applyImpulse = function( impulseX, impulseY )
{
this.body.ApplyImpulse( new b2Vec2( impulseX, impulseY ), this.body.GetWorldCenter() );
};


Circle.prototype.updateShapePosition = function()
{
var position = this.body.GetWorldCenter();

this.shape.x = position.x * SCALE;
this.shape.y = position.y * SCALE;
};


Circle.prototype.remove = function()
{
G.STAGE.removeChild( this.shape );

WORLD.DestroyBody( this.body );
};


window.Circle = Circle;

}(window));