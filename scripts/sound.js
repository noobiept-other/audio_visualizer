var Sound;
(function (Sound) {


var AUDIO_CONTEXT;
var IS_PLAYING = false;

var BUFFER_LIST = [];

var SOURCE_NODE;
var ANALYSER_NODE;
var GAIN_NODE;    // last node before connecting to the audio destination

    // arrays to retrieve data from the analyser node
var FREQ_FLOAT_DATA;
var FREQ_BYTE_DATA;
var TIME_BYTE_DATA;


Sound.init = function()
{
AUDIO_CONTEXT = new AudioContext();


    // initialize the analyser node
ANALYSER_NODE = AUDIO_CONTEXT.createAnalyser();
ANALYSER_NODE.fftSize = 128;
ANALYSER_NODE.smoothingTimeConstant = 0.9;

    // set up the arrays that we use to retrieve the analyserNode data
FREQ_FLOAT_DATA = new Float32Array( ANALYSER_NODE.frequencyBinCount );
FREQ_BYTE_DATA = new Uint8Array( ANALYSER_NODE.frequencyBinCount );
TIME_BYTE_DATA = new Uint8Array( ANALYSER_NODE.frequencyBinCount );


    // add a gain node, will be used to control the volume
GAIN_NODE = AUDIO_CONTEXT.createGain();

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
    }

IS_PLAYING = true;

var source = AUDIO_CONTEXT.createBufferSource();

source.buffer = BUFFER_LIST[ position ];
source.connect( ANALYSER_NODE );
source.start();

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


Sound.getFloatFrequencyData = function()
{
ANALYSER_NODE.getFloatFrequencyData( FREQ_FLOAT_DATA );  // this gives us the dBs

return FREQ_FLOAT_DATA;
};


Sound.getByteFrequencyData = function()
{
ANALYSER_NODE.getByteFrequencyData( FREQ_BYTE_DATA );  // this gives us the frequency

return FREQ_BYTE_DATA;
};


Sound.getByteTimeDomainData = function()
{
ANALYSER_NODE.getByteTimeDomainData( TIME_BYTE_DATA );  // this gives us the waveform

return TIME_BYTE_DATA;
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


})(Sound || (Sound = {}));