(function(window)
{
function Bar( x, y )
{
    // shape
var shape = new createjs.Shape();

shape.x = x;
shape.y = y;

G.STAGE.addChild( shape );

    // body
var fixDef = new b2FixtureDef;

fixDef.density = 1;
fixDef.friction = 0.5;
fixDef.restitution = 0.2;
fixDef.shape = new b2PolygonShape;

var bodyDef = new b2BodyDef;

var width = SHAPE_WIDTH;
var height = 40;

bodyDef.type = b2Body.b2_kinematicBody;
fixDef.shape.SetAsBox( width / SCALE, height / SCALE );
bodyDef.position.Set( x / SCALE, (y + height) / SCALE );

var body = WORLD.CreateBody( bodyDef );

body.CreateFixture( fixDef );

this.body_height = height;
this.body = body;
this.shape = shape;
}


Bar.prototype.setDimensions = function( width, height )
{
var g = this.shape.graphics;

g.clear();
g.beginFill( 'black' );
g.drawRect( 0, 0, width, height );
g.endFill();


var targetY = this.shape.y + height;
var currentY = this.body.GetPosition().y * SCALE - this.body_height + 1;

var velocity = 10;
var direction = 0;

if ( currentY > targetY )
    {
    direction = -1;
    }

else if ( currentY < targetY )
    {
    direction = 1;
    }


this.body.SetLinearVelocity( new b2Vec2( 0, direction * velocity ) );
};


window.Bar = Bar;

}(window));