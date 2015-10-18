var Sound;
(function (Sound) {


var AUDIO_CONTEXT;
var IS_PLAYING = false;

var BUFFER_LIST = [];

var SOURCE_NODE;
var FILTER_NODE;
var ANALYSER_NODE;
var GAIN_NODE;    // last node before connecting to the audio destination

    // array to retrieve data from the analyser node
var FREQ_BYTE_DATA;

var IS_FILTER_CONNECTED = false;


Sound.init = function()
{
AUDIO_CONTEXT = new AudioContext();


    // initialize the analyser node
ANALYSER_NODE = AUDIO_CONTEXT.createAnalyser();
ANALYSER_NODE.fftSize = 128;


    // set up the arrays that we use to retrieve the analyserNode data
FREQ_BYTE_DATA = new Uint8Array( ANALYSER_NODE.frequencyBinCount );


    // add a gain node, will be used to control the volume
GAIN_NODE = AUDIO_CONTEXT.createGain();

    // the filter is optional, so we're not connecting yet
FILTER_NODE = AUDIO_CONTEXT.createBiquadFilter();

    // make the node connections
ANALYSER_NODE.connect( GAIN_NODE );
GAIN_NODE.connect( AUDIO_CONTEXT.destination );
};


Sound.decodeAudio = function( arrayBuffer, successCallback )
{
AUDIO_CONTEXT.decodeAudioData(
    arrayBuffer,
    successCallback,
    function()
        {
        console.log( 'Error decoding the sound.' );
        });
};


Sound.addSound = function( buffer )
{
BUFFER_LIST.push( buffer );

return BUFFER_LIST.length - 1;
};


Sound.play = function( position )
{
if ( SOURCE_NODE )
    {
    SOURCE_NODE.stop();
    SOURCE_NODE.disconnect();
    }

IS_PLAYING = true;

var source = AUDIO_CONTEXT.createBufferSource();

source.buffer = BUFFER_LIST[ position ];
source.loop = true;
source.start();

if ( IS_FILTER_CONNECTED )
    {
    source.connect( FILTER_NODE );
    }

else
    {
    source.connect( ANALYSER_NODE );
    }

SOURCE_NODE = source;
};


Sound.stop = function()
{
IS_PLAYING = false;

SOURCE_NODE.stop();
};


Sound.getNumberOfPoints = function()
{
    // this represents half of the FFT size, which means the points that its being used (since the fft is symmetric)
return ANALYSER_NODE.frequencyBinCount;
};


Sound.getByteFrequencyData = function()
{
ANALYSER_NODE.getByteFrequencyData( FREQ_BYTE_DATA );  // this gives us the frequency

return FREQ_BYTE_DATA;
};


Sound.isPlaying = function()
{
return IS_PLAYING;
};


Sound.setGlobalGain = function( gain )
{
GAIN_NODE.gain.value = gain;
};


Sound.getGlobalGain = function()
{
return GAIN_NODE.gain.value;
};


Sound.setSmoothing = function( value )
{
ANALYSER_NODE.smoothingTimeConstant = value;
};


Sound.getCurrentSmoothing = function()
{
return ANALYSER_NODE.smoothingTimeConstant;
};


/**
 * See `https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode` for more information about what arguments to pass and its values.
 */
Sound.setFilter = function( type, frequency, detune, q, gain )
{
FILTER_NODE.type = type;
FILTER_NODE.frequency.value = 1000;

if ( !IS_FILTER_CONNECTED )
    {
    if ( SOURCE_NODE )
        {
        SOURCE_NODE.disconnect();
        SOURCE_NODE.connect( FILTER_NODE );
        }

    FILTER_NODE.connect( ANALYSER_NODE );

    IS_FILTER_CONNECTED = true;
    }
};


Sound.removeFilter = function()
{
if ( !IS_FILTER_CONNECTED )
    {
    return;
    }

IS_FILTER_CONNECTED = false;
FILTER_NODE.disconnect();

if ( SOURCE_NODE )
    {
    SOURCE_NODE.connect( ANALYSER_NODE );
    }
};


})(Sound || (Sound = {}));