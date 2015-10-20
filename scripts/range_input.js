function RangeInput( inputId, valueId, possibleValues, onInput )
{
var inputElement = document.getElementById( inputId );
var valueElement = document.getElementById( valueId );
var length = possibleValues.length;

inputElement.min = 0;
inputElement.max = length - 1;
inputElement.step = 1;

inputElement.oninput = function( event )
    {
    var position = parseInt( event.target.value, 10 );
    var value = possibleValues[ position ];

    valueElement.innerHTML = value;
    onInput( value );
    };


this.input_element = inputElement;
this.value_element = valueElement;
this.possible_values = possibleValues;
}


RangeInput.prototype.getValue = function()
{
var position = parseInt( this.input_element.value, 10 );

return this.possible_values[ position ];
};


RangeInput.prototype.setValue = function( value )
{
this.input_element.value = this.possible_values.indexOf( value );
this.value_element.innerHTML = value;
};