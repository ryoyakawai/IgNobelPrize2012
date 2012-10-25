/*! Ig2012.js - v1.0 - 2012-10-25
 * Copyright (c) 2012 Ryoya KAWAi; Licensed MIT, GPL */ 

var IgNobel = function() {

  return {
    init: function() {
      this.nowPlaying = false;
      this.audioContext = new webkitAudioContext();
      this.localMediaStream=null;
      this.video=null;
      this.audio=null;
      this.intervalId = null;
      this.imgHeight = 100;
      this.imgWidth = 132;
      this.browser='Webkit';
      this.drawContext = null;
      this.analyserNodeCanvas = null;
      this.delayNode = this.audioContext.createDelayNode();
      this.delaySec = 0;
      this.canvasMeter = null;
      
      this.analyserNode = null;
    },
    
    jamOn: function() {
      this.nowPlaying = true;
      self=this;
      navigator.webkitGetUserMedia({video: false, audio: true}, this.gotStream, onFailSoHard);
      var onFailSoHard = function(e) {
        alert('Failed to initialize the simupator. Reload and try again.');
      };
    },
    
    gotStream: function(localMediaStream) {
      self.localMediaStream = localMediaStream;
      self.audioStream = self.audioContext.createMediaStreamSource(localMediaStream);
      self.analyserNode = self.audioContext.createAnalyser();
      //self.delayNode.delayTime.value = self.delaySec;
      self.delayNode.delayTime.value = 10;
      self.audioStream.connect(self.delayNode);
      self.delayNode.connect(self.analyserNode);
      self.analyserNode.connect(self.audioContext.destination);
      
      // spectrum analyser                                                                                                                                      
      self.analyserNode.fftSize = 2048;
      self.analyserNode.maxDecibles = 0;
      
      self.drawContext = document.getElementById('audioStream');
      self.analyserNodeCanvas = self.drawContext.getContext('2d');
      self.canvasMeter = new CanvasMeter(self.analyserNode, self.analyserNodeCanvas);
      
      function updateVisualiser(time) {
        self.canvasMeter.updateAnalyser(self.analyserNode, self.analyserNodeCanvas);
        self.canvasMeter.rafID = window.webkitRequestAnimationFrame( updateVisualiser );
      }
      updateVisualiser(0);
      // spectrum analyser                                                                                                                                      
    },

    jamOff: function(){
      this.nowPlaying = false;
      switch( this.browser ) {
      case 'Webkit':
        this.localMediaStream.stop();
        this.audioStream.disconnect();
        break;
      }
      clearInterval(this.intervalId);
    },

    setDelaySec: function(value) {
      this.delaySec = value;
      this.delayNode.delayTime.value = value;
    }
    
    
  };
};

var igNobel = new IgNobel();
igNobel.init();

$(function() {
    $('#delaySlider').slider(
      {
        orientation: "vertical",
        range: "min",
        animate: true,
        value: 0,
        min: 0,
        max: 1,
        step: 0.01
      },
      {
        slide: function(event, ui) {
          var sec = ui.value;
          $('div.delaySec').text(sec + ' Sec.');
          igNobel.setDelaySec(sec);
        }
      }

    );


    $('div.container').hide();
    $(document).ready(function(){
                        $('div.container').fadeIn();
                        var sInitVal = 0.2;
                        $('#delaySlider').slider('value', sInitVal);
                        $('div.delaySec').text(sInitVal + ' Sec.');
                        igNobel.setDelaySec(sInitVal);
                      });


    $('input.jamOn').click(function(){
                             var status = $('input.jamOn').val();
                             switch(status) {
                             case 'On':
                               alert('This simulator will use your microphone and speaker connected to your PC. Please DO NOT play with the biggest volume in case of to damage your speaker.');
                               $('input.jamOn').removeClass('btn-danger')
                                 .addClass('btn-primary').attr('value', 'Off');
                               $('span.live').fadeIn().text('Jamming!!');
                               $('span.spectrum').fadeOut();
                               igNobel.jamOn();
                               break;
                             case 'Off':
                               $('input.jamOn').removeClass('btn-primary')
                                 .addClass('btn-danger').attr('value', 'On');
                               $('span.live').fadeOut();
                               $('span.spectrum').fadeIn();
                               igNobel.jamOff();
                               break;
                             }
                           });


});


