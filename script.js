window.onload = function() {

	// Video
	var video = document.getElementById("video");
	var transcript_area = document.getElementById('transcript');

	// Buttons
	var playButton = document.getElementById("play-pause");
	var muteButton = document.getElementById("mute");
	var fullScreenButton = document.getElementById("full-screen");
	var subtitles = document.getElementById("closed-caption");
	var speed = document.getElementById("playback-speed");

	// Sliders
	var volumeBar = document.getElementById("volume-bar");

	// Progress
	var progress_bar = document.getElementById('progress-bar');
	var buffer_bar = document.getElementById('buffer-bar');

	//Time
	var current_time = document.getElementById('current-time');


	// Array of object for transcript text with start and finish
	var transcript_array = [
		{"start": "0.00",
			"fin": "7.535",
			"text": "Now that we've looked at the architecture of the internet, let's see how you might connect your personal devices to the internet inside your house."},
		{"start": "7.536",
			"fin": "13.960",
			"text": "Well there are many ways to connect to the internet, and most often people connect wirelessly."},
		{"start": "13.961",
			"fin": "17.940",
			"text": "Let's look at an example of how you can connect to the internet."},
		{"start": "17.941",
			"fin": "30.920",
			"text": "If you live in a city or a town, you probably have a coaxial cable for cable Internet, or a phone line if you have DSL, running to the outside of your house, that connects you to the Internet Service Provider, or ISP."},
		{"start": "32.100",
			"fin": "41.190",
			"text": "If you live far out in the country, you'll more likely have a dish outside your house, connecting you wirelessly to your closest ISP, or you might also use the telephone system."},
		{"start": "42.350",
			"fin": "53.760",
			"text": "Whether a wire comes straight from the ISP hookup outside your house, or it travels over radio waves from your roof, the first stop a wire will make once inside your house, is at your modem."},
		{"start": "53.761",
			"fin": "57.780",
			"text": "A modem is what connects the internet to your network at home."},
		{"start": "57.781",
			"fin": "59.000",
			"text": "A few common residential modems are DSL or--"}   
	];
	// Event listener for the play/pause button
	playButton.addEventListener("click", function() {
		if (video.paused == true) {
			// Play the video
			video.play();

			// Update the button text to 'Pause'
			playButton.innerHTML = '<img src="icons/pause-icon.png"/>';
		} else {
			// Pause the video
			video.pause();

			// Update the button text to 'Play'
			playButton.innerHTML = '<img src="icons/play-icon.png"/>';
		}
	});

	// Utility function to format time nicely
	function format_time(seconds) {
	    var minutes = Math.floor(seconds / 60);
	    minutes = (minutes >= 10) ? minutes : "0" + minutes;
	    seconds = Math.floor(seconds % 60);
	    seconds = (seconds >= 10) ? seconds : "0" + seconds;
	    return minutes + ":" + seconds;
	}


// Event listener for the mute button
	muteButton.addEventListener("click", function() {
		if (video.muted == false) {
			// Mute the video
			video.muted = true;

			// Update the button text
			muteButton.innerHTML = '<img src="icons/volume-off-icon.png"/>';
			volumeBar.value=0;
		} else {
			// Unmute the video
			video.muted = false;

			// Update the button text
			muteButton.innerHTML = '<img src="icons/volume-on-icon.png"/>';
			volumeBar.value=100;
		}
	});


	// Event listener for the full-screen button
	fullScreenButton.addEventListener("click", function() {
		if (video.requestFullscreen) {
			video.requestFullscreen();
		} else if (video.mozRequestFullScreen) {
			video.mozRequestFullScreen(); // Firefox
		} else if (video.webkitRequestFullscreen) {
			video.webkitRequestFullscreen(); // Chrome and Safari
		}
	});



	// Event listener for the volume bar
	volumeBar.addEventListener("change", function() {
		// Update the video volume
		video.volume = volumeBar.value;
		if (volumeBar.value==1) {
			muteButton.innerHTML = '<img src="icons/volume-on-icon.png"/>';
		}
		if (volumeBar.value==0) {
			muteButton.innerHTML = '<img src="icons/volume-off-icon.png"/>';
		}
	});


	// Progress bar Change event
	progress_bar.addEventListener("change", function() {
		// Calculate the new time
		var time = video.duration * (progress_bar.value / 100);

		// Update the video time
		video.currentTime = time;
	});
	
	// Update video when progress bar changed, and-
	// During video play, check for time and place #highlight on the span to change the color of the text
	video.addEventListener("timeupdate", function() {
		// Calculate the slider value
		var value = (100 / video.duration) * video.currentTime;

		// calculate the buffer value;
		var buffer_value = (100 / video.duration) * video.buffered.end(0);

		// Update the slider and buffer value
		progress_bar.value = value;
		buffer_bar.value = buffer_value;

		// update current-time value;
		current_time.innerHTML = format_time(video.currentTime);

		// highlight the appropriate transcript span
		for (var i = 0; i < transcript_array.length; i++) {

			// remove .highlight from all span elements first, and then
			document.getElementById(transcript_array[i].start).classList.remove('highlight');

			// find the span element with the correct id
			if (video.currentTime >= transcript_array[i].start && video.currentTime <= transcript_array[i].fin) {

				// append .highlight to the correct span
				document.getElementById(transcript_array[i].start).classList.add('highlight');

			}
		}
	});

	// Update video playback when progress bar is clicked anywhere
	progress_bar.addEventListener('click', function(e) {
	   var pos = (e.pageX  - (this.offsetLeft + this.offsetParent.offsetLeft)) / this.offsetWidth;
	   video.currentTime = pos * video.duration;
	});



	subtitles.addEventListener('click', function(e) {
     	var mode = video.textTracks[0].mode;
     	if (mode=='showing'){
        	video.textTracks[0].mode = 'hidden';
        	subtitles.innerHTML = '<strike>CC</strike>';
     	}
     	else {
     		video.textTracks[0].mode='showing';
     		subtitles.innerHTML = 'CC';
     	}
		});

	speed.addEventListener('click', function(e) {
     	var normalSpeed = video.playbackRate;
     	if (normalSpeed==1){
        	video.playbackRate = 1.5;
        	speed.innerHTML = '1.5x';
     	}
     	else {
     		video.playbackRate = 1;
     		speed.innerHTML = 'Normal';
     	}
		});


// Skip video to the time specified in span ID
	function skip_to_text(e) {
		video.currentTime = e.target.id;
		video.play();
	}

	// Place text inside the #transcript with appropriate span and id
	function prep_transcript() {
		var temp;
		for (var i = 0; i < transcript_array.length; i++) {
			// create a span element
			temp = document.createElement('span');

			// put the text to the span element
			temp.innerHTML = transcript_array[i].text + ' ';

			// set the id to the time of start of the cue
			temp.setAttribute('id', transcript_array[i].start);

			// append the element to transcript area
			transcript_area.appendChild(temp);

			// attach event listener that will fire skip_to_text when span is clicked
			temp.addEventListener('click', skip_to_text);
		}
	}

	// Function calls
	prep_transcript();

};