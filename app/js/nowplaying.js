import { nowPlayingSong, playIcon } from "./index.js";
const progressBar = document.querySelector('.progress-bar');
const progress = document.querySelector('.progress');
const circle = document.querySelector('.circle');
const elapsedTime = document.querySelector('.elapsed-time');
const remainingTime = document.querySelector('.remaining-time');

//This function updates the progress bar over time
nowPlayingSong.addEventListener('timeupdate', () => {
 const currentTime = nowPlayingSong.currentTime;
 const duration = nowPlayingSong.duration;
 const progressPercent = (currentTime / duration) * 100;
 progress.style.width = `${progressPercent}%`;
 circle.style.left = `${progressPercent}%`;

 // Update elapsed time
 const elapsedMinutes = Math.floor(currentTime / 60);
 const elapsedSeconds = Math.floor(currentTime % 60);
 elapsedTime.innerHTML = `${elapsedMinutes}:${elapsedSeconds < 10 ? '0' : ''}${elapsedSeconds}`;

 // Update remaining time
 const remainingMinutes = Math.floor((duration - currentTime) / 60);
 const remainingSeconds = Math.floor((duration - currentTime) % 60);
 remainingTime.innerHTML = `-${remainingMinutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
});

//This function updates the progress bar when it is clicked by the user
progressBar.addEventListener('click', (e) => {
 const progressBarWidth = progressBar.offsetWidth;
 const clickX = e.offsetX;
 const percent = (clickX / progressBarWidth) * 100;
 nowPlayingSong.currentTime = (percent / 100) * nowPlayingSong.duration;
});

let isDragging = false;

//These three functions function update the progress bar when it is dragged by the user
circle.addEventListener('mousedown', () => {
 isDragging = true;
});

document.addEventListener('mouseup', () => {
 isDragging = false;
});

progressBar.addEventListener('mousemove', (e) => {
 if (isDragging) {
   const progressBarWidth = progressBar.offsetWidth;
   const clickX = e.offsetX;
   const percent = (clickX / progressBarWidth) * 100;
   nowPlayingSong.currentTime = (percent / 100) * nowPlayingSong.duration;
 }
});

//This function changes the play icon to pause if the song is playing
playIcon.addEventListener('click', () => {
  if (nowPlayingSong.paused) {
    nowPlayingSong.play();
    playIcon.classList.remove('fa-play-circle');
    playIcon.classList.add('fa-pause-circle');
  } else {
    nowPlayingSong.pause();
    playIcon.classList.remove('fa-pause-circle');
    playIcon.classList.add('fa-play-circle');
  }
});