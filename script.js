const songList = [
  {
    name: "Closer",
    artist: "The Chainsmokers, Halsey",
    image: "assets/images/closer.jpg",
    path: "assets/songs/Closer.mp3",
  },
  {
    name: "Cheap Thrills",
    artist: "Sia",
    image: "assets/images/sia.jpg",
    path: "assets/songs/CheapThrills.mp3",
  },
  {
    name: "Mera Safar",
    artist: "Iqlips Nova",
    image: "assets/images/merasafar.jpg",
    path: "assets/songs/MeraSafar.mp3",
  },
  {
    name: "Unstoppable",
    artist: "Sia",
    image: "assets/images/unstoppable.jpg",
    path: "assets/songs/Unstoppable.mp3",
  },
];

let musicListSection = document.querySelector(".musicListSection");
let musicDetailDiv, musicDetailSongName, musicDetailArtistName;
let songDurationSlider = document.querySelector(".songDurationSlider");

let playSongIcon = document.querySelector(".play");
let pauseSongIcon = document.querySelector(".pause");

let songIndex = 0,
  songIsPlaying = false,
  songPlayingOnLoop = false;

let audioTag = document.createElement("audio");
let songThumbnail = document.querySelector(".songImage");
let songname = document.querySelector(".songName");
let artistName = document.querySelector(".artistName");
let volumeSlider = document.querySelector(".volumeSelecetRange");
let loopSongIcon = document.querySelector(".fa-repeat");

// ITERATE ON SONG_LIST ARRAY
songList.forEach((song, index) => {
  musicDetailDiv = document.createElement("div");
  musicDetailDiv.className = "musicDetail";
  musicDetailDiv.onclick = () => {
    songClicked(index);
  };
  musicDetailDiv.style.cursor = "pointer";

  musicDetailSongName = document.createElement("h3");
  musicDetailSongName.className = "musicDetailSongName";

  musicDetailArtistName = document.createElement("p");
  musicDetailArtistName.className = "musicDetailArtistName";

  let horizontalLineDiv = document.createElement("div");
  horizontalLineDiv.className = "horizontaline";

  musicDetailSongName.textContent = song.name;
  musicDetailArtistName.textContent = song.artist;

  musicDetailDiv.append(musicDetailSongName, musicDetailArtistName);
  musicListSection.append(musicDetailDiv, horizontalLineDiv);
});

//SET SONG DETAIL
let setSong = (song) => {
  songDurationSlider.value = 0;
  audioTag.setAttribute("src", song.path);
  let songTotalDuration = document.querySelector(".songTotalDuration");

  audioTag.onloadedmetadata = () => {
    let songTotalDurationInMinute = Math.floor(audioTag.duration / 60);
    songTotalDurationInMinute =
      songTotalDurationInMinute >= 10
        ? songTotalDurationInMinute
        : `0${songTotalDurationInMinute}`;

    let songTotalDurationInSecond = Math.floor(audioTag.duration % 60);
    songTotalDurationInSecond =
      songTotalDurationInSecond >= 10
        ? songTotalDurationInSecond
        : `0${songTotalDurationInSecond}`;

    songTotalDuration.textContent = `${songTotalDurationInMinute}:${songTotalDurationInSecond}`;
  };

  audioTag.volume = 0.5;

  songThumbnail.style.backgroundImage = `url(${song.image})`;
  songname.textContent = song.name;
  artistName.textContent = song.artist;

  setSongBackground(songIndex);
};

// UPDATE SONG CURRENT DURATION
audioTag.addEventListener("timeupdate", () => {
  let songCurrentDuration = document.querySelector(".songCurrentDuration");

  let songCurrentTimeInMinute = Math.floor(audioTag.currentTime / 60);
  songCurrentTimeInMinute =
    songCurrentTimeInMinute >= 10
      ? songCurrentTimeInMinute
      : `0${songCurrentTimeInMinute}`;

  let songCurrentTimeInSecond = Math.floor(audioTag.currentTime % 60);
  songCurrentTimeInSecond =
    songCurrentTimeInSecond >= 10
      ? songCurrentTimeInSecond
      : `0${songCurrentTimeInSecond}`;

  songCurrentDuration.textContent = `${songCurrentTimeInMinute}:${songCurrentTimeInSecond}`;

  songDurationSlider.value = (audioTag.currentTime / audioTag.duration) * 100;
});

setSong(songList[songIndex]);

// PLAY AND PAUSE SONG
let playPauseSong = () => {
  if (songIsPlaying) {
    songIsPlaying = false;
    audioTag.pause();
    pauseSongIcon.style.display = "none";
    playSongIcon.style.display = "block";
  } else {
    songIsPlaying = true;
    audioTag.play();
    pauseSongIcon.style.display = "block";
    playSongIcon.style.display = "none";
  }
};

// PLAY NEXT SONG
let playNextSong = () => {
  songIndex >= songList.length - 1 ? (songIndex = 0) : songIndex++;
  setSong(songList[songIndex]);
  songIsPlaying = false;
  playPauseSong();
  songPlayingOnLoop = false;
  loopSongIcon.style.color = "#ffffff";
  audioTag.loop = false;
};

// PLAY PREVIOUS SONG
let playPreviousSong = () => {
  songIndex <= 0 ? (songIndex = songList.length - 1) : songIndex--;
  setSong(songList[songIndex]);
  songIsPlaying = false;
  playPauseSong();
  songPlayingOnLoop = false;
  loopSongIcon.style.color = "#ffffff";
  audioTag.loop = false;
};

// CLICK ANY SONG TO PLAY
let songClicked = (index) => {
  setSong(songList[index]);
  setSongBackground(index);
  songIsPlaying = false;
  playPauseSong();
  songPlayingOnLoop = false;
  loopSongIcon.style.color = "#ffffff";
  audioTag.loop = false;
  songIndex = index;
};

// FUNCTION FOR SET BACKGROUND FOR PLAYING SONG
function setSongBackground(index) {
  let musicDetailDivs = document.querySelectorAll(".musicDetail");
  musicDetailDivs.forEach((value) => {
    value.style.backgroundColor = "transparent";
  });
  musicDetailDivs[index].style.backgroundColor = "rgba(202, 213, 226,0.4)";
}

// CONTROL VOLUME
let volumeControl = () => {
  volumeSlider.style.display = "block";
  volumeSlider.addEventListener("input", () => {
    // NOTE: DIVIDE VOLUME_SLIDER VALUE BY 100 BECAUSE AUDIOTAG.VOLUME ONLY ACCEPT VALUE BETWEEN 0 T0 1
    audioTag.volume = volumeSlider.value / 100;
  });
};

// HIDDEN VOLUME SLIDER ON CHANGING SLIDER VALUE
volumeSlider.addEventListener("change", () => {
  volumeSlider.style.display = "none";
});

// UPDATE SONG AS SLIDER VALUE CHANGED
songDurationSlider.addEventListener("input", () => {
  // NOTE: USING SIMPLE PERCENTAGE FINDING FORMULA TO FIND HOW MUCH PERCENTAGE SONG IS PLAYING
  audioTag.currentTime = (songDurationSlider.value * audioTag.duration) / 100;
});

// PLAY NEXT SONG WHEN CURRENT SONG IS ENDED
audioTag.addEventListener("ended", () => {
  playNextSong();
});

// PLAY SONG ON LOOP
let loopSong = () => {
  if (songPlayingOnLoop) {
    songPlayingOnLoop = false;
    loopSongIcon.style.color = "#ffffff";
    audioTag.loop = false;
  } else {
    songPlayingOnLoop = true;
    loopSongIcon.style.color = "#000000";
    audioTag.loop = true;
  }
};
