function Bar( x, y )
{
    // shape
var shape = new createjs.Shape();

shape.x = x;
shape.y = y;

G.STAGE.addChild( shape );

this.shape = shape;
}


Bar.prototype.setDimensions = function( width, height )
{
var g = this.shape.graphics;

g.clear();
g.beginFill( 'black' );
g.drawRect( 0, 0, width, height );
g.endFill();
};


Bar.prototype.remove = function()
{
G.STAGE.removeChild( this.shape );

this.shape = null;
};