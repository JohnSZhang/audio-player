;$(function(){
  function musicPlayer() {
    this.list = [];
  }

  musicPlayer.prototype.addSong = function (song) {
    if( !player.isDuplicate(song)) {
      console.log( $(song).attr('title') + " is already in playlist");
    } else {
      this.list.push(song)
    }
  };

  musicPlayer.prototype.play = function () {
    var song = this.getCurrentSong();
    if(!this.playing) {
      this.playing = true
      song.play();
    } else {
      this.playing = false
      song.pause();
    }
    this.updateStatus();

  };
  musicPlayer.prototype.updateStatus = function () {
    var self = this;
    var song = this.getCurrentSong();
    var progress = Math.floor(song.currentTime / song.duration * 100);
    $('#status span').css("left", progress + "%")
    if (progress === 100 ) {
      this.forward();
    }
    if(this.playing) {
      window.setTimeout(function(){
        self.updateStatus();
      }, 500);
    }
  };

  musicPlayer.prototype.forward = function () {
    this.pauseCurrent();
    var currentIndex = $.inArray(this.getCurrentSong(), this.list);
    this.resetTrack(currentIndex);
    if(currentIndex === this.list.length - 1) {
      this.setCurrentSong(0);
    } else {
      this.setCurrentSong(currentIndex + 1);
    }
    this.play();
    this.render();
  };

  musicPlayer.prototype.backward = function () {
    this.pauseCurrent();
    var currentIndex = $.inArray(this.getCurrentSong(), this.list);
    this.resetTrack(currentIndex);
    if(currentIndex === 0) {
      this.setCurrentSong(this.list.length - 1);
    } else {
      this.setCurrentSong(currentIndex - 1);
    }
    this.play();
    this.render();
  };

  musicPlayer.prototype.pauseCurrent = function () {
    if(this.playing) {
      this.playing = false;
      this.getCurrentSong().pause();
    }
  };

  musicPlayer.prototype.getCurrentSong = function () {
    if(!this.currentSong){
      this.currentSong = this.list[0]
    }
    return this.currentSong
  };

  musicPlayer.prototype.setCurrentSong = function (index) {
    this.currentSong = this.list[index]
  };
  musicPlayer.prototype.setAndPlay = function (index) {
    this.pauseCurrent();
    this.setCurrentSong(index);
    this.play();
    this.render();
  }

  musicPlayer.prototype.removeTrack = function (index) {
    var currentIndex = $.inArray(this.getCurrentSong(), this.list);
    console.log(currentIndex)
    if (currentIndex !== index) {
      this.list.splice(index, 1)
      this.render();
    } else {
      console.log('cannot remove currently playing track');
    }
  };

  musicPlayer.prototype.isDuplicate = function (song) {
    return ($.inArray(song, this.list) === -1)
  };

  musicPlayer.prototype.resetTrack = function (index) {
    this.list[0].currentTime = 0;
  };

  musicPlayer.prototype.render = function() {
    var playlistCon = $('#playlist>ul');
    playlistCon.empty();
    var currentSong = player.getCurrentSong();
    for(var i=0; i < player.list.length; i++){
      var song = player.list[i];
      if (song === currentSong) {
        playlistCon.append('<a href="#" class="remove">x</a>'
            + '<li class="track current" number="' + i
            +'">' + $(song).attr('title') + '</li>')
      } else {
        playlistCon.append(' <a href="#" class="remove"> x </a> '
            + '<li class="track" number="'+ i
            + '">' + $(song).attr("title") + '</li>')
      }
    }
  }

  var player = new musicPlayer();

  $('.add.albumn').on("click", function(event){
    var albumn = $(event.target).next().children();
    for( var i=0; i < albumn.length; i++) {
      player.addSong($(albumn[i]).children("audio")[0]);
    }
    player.render();
  });

  $('a.play').on("click", function(event){
    event.preventDefault();
    player.play();
    $('a.play').toggleClass("pause")
    $('#playlist li.current').toggleClass("pause")
  });

  $('a.backward').on("click", function(event){
    event.preventDefault();
    player.backward()
  });

  $('a.forward').on("click", function(event){
    event.preventDefault();
    player.forward()
  });

  $('#add-song').on("click", "a", function(event){
    event.preventDefault();
    player.addSong($('#new-song').val());
    player.render();
  });

  $("#status").slider({
    change: function( event, ui ) {
      var progress = ui.value
      var song = player.getCurrentSong();
      if (song) {
        song.currentTime = song.duration * progress / 100;
      }
    }
  });

  $('#playlist').on('click', 'li.track', function(event){
    var selectedTrack = $(event.currentTarget).attr('number');
    player.setAndPlay(selectedTrack)
  });

  $('#playlist').on('click', 'a.remove', function(event){
    console.log()
    var selectedTrack = $(event.currentTarget).next().attr('number');
    console.log(selectedTrack)
    player.removeTrack(selectedTrack)
  });

  $('#library').on('click', "a.track", function (event) {
    var track = $(event.currentTarget).next();
    player.addSong(track[0])
    player.render();
  });
});
