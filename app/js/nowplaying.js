const playIcon = document.querySelector('.fa-play-circle');
const audio = document.querySelector('audio');
const progressBar = document.querySelector('.progress-bar');
const progress = document.querySelector('.progress');
const circle = document.querySelector('.circle');

//This function updates the progress bar over time
audio.addEventListener('timeupdate', () => {
	const currentTime = audio.currentTime;
	const duration = audio.duration;
	const progressPercent = (currentTime / duration) * 100;
	progress.style.width = `${progressPercent}%`;
	circle.style.left = `${progressPercent}%`;
	
  }); 
  
//This function updates the progress bar when it is clicked by the user
progressBar.addEventListener('click', (e) => {
	const progressBarWidth = progressBar.offsetWidth;
	const clickX = e.offsetX;
	const percent = (clickX / progressBarWidth) * 100;
	audio.currentTime = (percent / 100) * audio.duration;
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
	  audio.currentTime = (percent / 100) * audio.duration;
	}
}); 
  
//This function changes the play icon to pause if the song is playing
playIcon.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    playIcon.classList.remove('fa-play-circle');
    playIcon.classList.add('fa-pause-circle');
  } else {
    audio.pause();
    playIcon.classList.remove('fa-pause-circle');
    playIcon.classList.add('fa-play-circle');
  }
});
