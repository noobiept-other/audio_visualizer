(function(window)
{
function Audio()
{

}

var IS_PLAYING = false;

var SOUND_INSTANCE = null;
var ANALYSER_NODE = null;

    // arrays to retrieve data from the analyser node
var FREQ_FLOAT_DATA;
var FREQ_BYTE_DATA;
var TIME_BYTE_DATA;


Audio.init = function( callback )
{
var success = createjs.Sound.registerPlugins( [ createjs.WebAudioPlugin ] );

if ( !success )
    {
    console.log( "Error: No support for web audio plugin." );
    return false;
    }


    // :: add an analyser node :: //
var context = createjs.Sound.activePlugin.context;

var analyser = context.createAnalyser();

analyser.fftSize = 128;
analyser.smoothingTimeConstant = 0.9;

    // add the analyser as the last node before the destination
    // need to change the last node connected, from the destination to the analyser
var dynamicsNode = createjs.Sound.activePlugin.dynamicsCompressorNode;
dynamicsNode.disconnect();  // disconnect from destination

dynamicsNode.connect( analyser );
analyser.connect( context.destination );

    // set up the arrays that we use to retrieve the analyserNode data
FREQ_FLOAT_DATA = new Float32Array( analyser.frequencyBinCount );
FREQ_BYTE_DATA = new Uint8Array( analyser.frequencyBinCount );
TIME_BYTE_DATA = new Uint8Array( analyser.frequencyBinCount );

ANALYSER_NODE = analyser;

var manifest = [
        { id: 'half_life', src: 'audio/half_life_1.ogg' }
    ];

createjs.Sound.alternateExtensions = [ 'mp3' ];
createjs.Sound.addEventListener( 'fileload', function()
    {
    SOUND_INSTANCE = createjs.Sound.createInstance( 'half_life' );

    if ( callback )
        {
        callback();
        }
    });
createjs.Sound.registerManifest( manifest );

return true;
};



Audio.start = function()
{
IS_PLAYING = true;

    // sound constantly looping
SOUND_INSTANCE.play( createjs.Sound.defaultInterruptBehavior, 0, 0, -1 );
};


Audio.stop = function()
{
IS_PLAYING = false;

SOUND_INSTANCE.stop();
};


Audio.getNumberOfPoints = function()
{
    // this represents half of the FFT size, which means the points that its being used (since the fft is symmetric)
return ANALYSER_NODE.frequencyBinCount;
};


Audio.getFloatFrequencyData = function()
{
ANALYSER_NODE.getFloatFrequencyData( FREQ_FLOAT_DATA );  // this gives us the dBs

return FREQ_FLOAT_DATA;
};


Audio.getByteFrequencyData = function()
{
ANALYSER_NODE.getByteFrequencyData( FREQ_BYTE_DATA );  // this gives us the frequency

return FREQ_BYTE_DATA;
};


Audio.getByteTimeDomainData = function()
{
ANALYSER_NODE.getByteTimeDomainData( TIME_BYTE_DATA );  // this gives us the waveform

return TIME_BYTE_DATA;
};


Audio.isPlaying = function()
{
return IS_PLAYING;
};


window.Audio = Audio;

}(window));