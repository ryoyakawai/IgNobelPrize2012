/*! Ig2012.js - v1.0 - 2012-10-25
 * Copyright (c) 2012 Ryoya KAWAi; Licensed MIT, GPL */ 

var CanvasMeter = function( analyserNode, analyserNodeCanvas ) {
		var rafID = null;
		var drawContext = analyserNodeCanvas;
		var windowObj = window;
		var SPACER_WIDTH = 3;
		var BAR_WIDTH = 3;
		var CANVAS_WIDTH = 360;
		var CANVAS_HEIGHT = 225;

		return {
				'init': function() {
						this.analyserNode = analyserNode;
						this.analyserNodeCanvas = analyserNodeCanvas;
						this.rafID = null;
						this.drawContext = analyserNodeCanvas;
						this.windowObj = window;
				},
				'updateAnalyser': function(analyserNode, drawContext) {
						var numBars = Math.round(CANVAS_WIDTH / SPACER_WIDTH);
						var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);
      
						analyserNode.getByteFrequencyData(freqByteData);

						drawContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
						drawContext.fillStyle = '#F6D565';
						drawContext.lineCap = 'round';
						var multiplier = analyserNode.frequencyBinCount / numBars;

						// Draw rectangle for each frequency bin.
						for (var i = 0; i < numBars; ++i) {
								var magnitude = 0;
								var offset = Math.floor( i * multiplier );
								// gotta sum/average the block, or we miss narrow-bandwidth spikes
								for (var j = 0; j< multiplier; j++) {
										magnitude += freqByteData[offset + j];
        }
								magnitude = 1.2 * magnitude / multiplier;
								var magnitude2 = freqByteData[i * multiplier];
								drawContext.fillStyle = "hsl( " + Math.round((i*360)/numBars) + ", 100%, 60%)";
								drawContext.fillRect(i * SPACER_WIDTH, CANVAS_HEIGHT, BAR_WIDTH, -magnitude);
						}
				}
		};
};
