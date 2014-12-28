;$(function(){
  function musicPlayer() {
    this.list = [];
  }

  musicPlayer.prototype.addSong = function (song) {
    if( !player.isDuplicate(song)) {
      console.log( song + " is already in playlist");
    } else {
      this.list.push(song)
    }
  };

  musicPlayer.prototype.play = function () {
    var song = this.getCurrentSong();
    if(!this.playing) {
      this.playing = true
      song[0].play();
    } else {
      this.playing = false
      song[0].pause();
    }
  };

  musicPlayer.prototype.forward = function () {
    this.pauseCurrent();
    var currentIndex = $.inArray(this.getCurrentSong(), this.list);
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
      this.getCurrentSong()[0].pause();
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

  musicPlayer.prototype.isDuplicate = function (song) {
    return ($.inArray(song, this.list) === -1)
  };

  musicPlayer.prototype.render = function() {
    var playlistCon = $('#playlist>ul');
    playlistCon.empty();
    var currentSong = player.getCurrentSong();
    for(var i=0; i < player.list.length; i++){
      var song = player.list[i];
      if (song === currentSong) {
        playlistCon.append('<li class="current">' + $(song).attr('title') + '</li>')
      } else {
        playlistCon.append('<li>' + $(song).attr("title") + '</li>')
      }
    }
  }

  var player = new musicPlayer();

  $('.add.albumn').on("click", function(event){
    var albumn = $(event.target).next().children();
    for( var i=0; i < albumn.length; i++) {
      player.addSong($(albumn[i]).children("audio"));
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

});
