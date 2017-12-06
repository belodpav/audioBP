;(function(){
	// Strict mode
	"use strict";

	// Constants 
	var MINUTE = 60;
	// Constructor 
	window.AudioBP = function() {

		//this.audioCore = new Audio();
		createElement = createElement.bind(this);

		var defaults = {
			autoplay: false,
			smoothChange: false,
			tracks: [
				{
					"author" : "Emily Edison",
					"preview" : "img/track-1.jpg",
					"src" : "track-1.mp3",
					"title" : "Just a song"
				},
				{
					"author" : "Michel Tel",
					"preview" : "img/track-2.jpg",
					"src" : "track-2.mp3",
					"title" : "Nosa Nosa"
				},
				{
					"author" : "Alai Oli",
					"preview" : "https://pp.userapi.com/c636816/v636816452/b2f93/mXx6KWof_bU.jpg",
					"src" : "http://storage.mp3cc.org/download/61228101/S1BjWHdiUlViU09RNktFWEdEbS8wWjNsV3dVcGhobzZ5Z1VGMFREZWxlQklBSWFZNmRpK1ZhbG9NNGM2NnlJczNlVGY5ZGFOdWEyMCtBTmxHcUQ4V3F0cW92Yk9qSjNweUgzM2NtU2s2YkNSRW14Y09oUkZJNkdMSEh3bnRmQlQ/alia-oli-krylya_(mp3.cc).mp3",
					"title" : "Крылья"
				},
				{
					"author" : "Русская Народная",
					"preview" : "",
					"src" : "http://music.xn--41a.ws/media/mp3/0/2681_ebd064785d71537edafffdc41448dd7c.mp3",
					"title" : "Катюша"
				}
			]
		};	
		this.options = {};
		if (arguments[0] && typeof arguments[0] == "object") {
			this.options = mergeProperties(defaults, arguments[0]);
		} else {
			this.options = defaults;
		}

		//

		// Initialization 
		// Let's issume that current track is 
		this.currentTrack = this.options.tracks[0];
		this.currentTrack.pos = 0;
		this.audioCore = new Audio();
		this.audioCore.src = this.currentTrack.src;
		// Building player 
		buildOut.call(this);
		updateTrackInfo.call(this);
		updateCurrentTime.call(this);
		//
		initEventListeners.call(this);
		//
	};

	// Public

	// Private 
	function mergeProperties(source, properties) {
		for(var prop in properties) {
			if (properties.hasOwnProperty(prop)) {
				source[prop] = properties[prop];
			}
		}
		return source;
	}

	// Initial Rendering 
	function buildOut() {
		var docFrag, playerWrapper, player;

		docFrag = document.createDocumentFragment();
		
		// Building Main player's box
		player = getStaticElement('div', 'audio-player');
		// Building player's wrapper 
		playerWrapper = getStaticElement('div', 'audio-player__inner');
		// Adding childrens to wrapper
		playerWrapper.appendChild(buildTrackDescr.call(this));
		playerWrapper.appendChild(buildTrackControls.call(this));
		playerWrapper.appendChild(buildTimeline.call(this));

		player.appendChild(playerWrapper);

		docFrag.appendChild(player);
		document.body.appendChild(docFrag);
	}


/*
	function View(settings) {
		this._htmlCode = settings.html;
		this._componentDidMount = false;
		this.getElement = function(parrent) {

		};
		this.render = function(parrent) {
			document.app
		};
		this.updateData = function() {

		};
		var newComponent = document.createElement(settings.type);
		newComponent.className = settings.className;
		newComponent.innerHTML = this._htmlCode;
	}

	var trackInfoSet = {
		type: '',
		htmlCode: ''
	} */
	
	function toTimeStringMMSS(seconds) {
		var min,
		s;
		min = Math.floor(seconds / MINUTE);
		s = Math.floor(seconds % MINUTE);
		s = s > 9 ? s + '' : '0' + s;
		return min + ':' + s;
	}
	function updateCurrentTime() {
		this.timerCurrent.innerText = toTimeStringMMSS(this.audioCore.currentTime);
	}
	function updateMaxTime() {
		this.timerMax.innerText = toTimeStringMMSS(this.audioCore.duration);
	}
	function normalizeTimePer(val, maxVal) {
		return Math.floor(100 * val / maxVal);
	}
	function updateTimelineActive() {
		this.timelineActive.style.width = normalizeTimePer(this.audioCore.currentTime, this.audioCore.duration) + '%';
	}
	function updateTimelineReady() {
		if (this.audioCore.buffered.length && this.audioCore.duration > 0) {
			this.timelineReady.style.width = 
			normalizeTimePer(this.audioCore.buffered.end(this.audioCore.buffered.length - 1), this.audioCore.duration) + '%';
		}
	}
	function buildTimeline() {
		var timelineBox, timelineInner, timerInner, progressBar, timeline;

		timelineBox = getStaticElement('div', 'audio-player__timeline');
		timelineInner = getStaticElement('div', 'timeline');
		timerInner = getStaticElement('div', 'timeline__timer');
		progressBar = getStaticElement('div', 'timeline__progress-bar');
		timeline = getStaticElement('div', 'timeline__bar timeline__bar-progress');

		createElement('timerCurrent', 'span', 'timeline__timer-current');
		createElement('timerMax', 'span', 'timeline__timer-max');

		createElement('timelineActive', 'div', 'timeline__bar timeline__bar-progress-active');
		createElement('timelineReady', 'div', 'timeline__bar timeline__bar-progress-ready');


		timerInner.appendChild(this.timerCurrent);
		timerInner.appendChild(this.timerMax);

		progressBar.appendChild(timeline);
		progressBar.appendChild(this.timelineActive);
		progressBar.appendChild(this.timelineReady);

		timelineInner.appendChild(timerInner);
		timelineInner.appendChild(progressBar);

		timelineBox.appendChild(timelineInner);
		return timelineBox;
	}



	function buildTrackControls() {
		var trackControls;

		trackControls = getStaticElement('div', 'audio-player__track-descr');
		createElement('play', 'button', 'audio-player__track-controls-btn audio-player__btn-play');
		createElement('next', 'button', 'audio-player__track-controls-btn audio-player__btn-next');
		createElement('prev', 'button', 'audio-player__track-controls-btn audio-player__btn-prev');
		trackControls.appendChild(this.prev);
		trackControls.appendChild(this.play);
		trackControls.appendChild(this.next);

		return trackControls;
	}
	function buildTrackDescr() {
		var descrBox, descrInner, descrInfo;

		descrBox = getStaticElement('div', 'audio-player__track-descr');
		descrInner = getStaticElement('div', 'ap-track-descr');
		descrInfo = getStaticElement('div', 'ap-track-descr__info');
		
		createElement('descrPhoto', 'div', 'ap-track-descr__track-photo');
		createElement('descrInfoTitle', 'div', 'ap-track-descr__info-title');
		createElement('descrInfoAuthor', 'div', 'ap-track-descr__info-author');

		descrInfo.appendChild(this.descrInfoTitle);
		descrInfo.appendChild(this.descrInfoAuthor);

		descrInner.appendChild(this.descrPhoto);
		descrInner.appendChild(descrInfo);
		descrBox.appendChild(descrInner);
		return descrBox;
	}

	function updateTrackInfo() {
		var currentTrack = this.currentTrack;
		if (currentTrack.preview && typeof currentTrack.preview === 'string') {
			this.descrPhoto.style.backgroundImage = 'url("' + currentTrack.preview + '")';
		} else {
			this.descrPhoto.style.backgroundImage = '';
		}
		if (currentTrack.title && typeof currentTrack.title === 'string') {
			this.descrInfoTitle.innerText = currentTrack.title;
		} else {
			this.descrInfoTitle.innerText = 'Track\'s name';
		}
		if (currentTrack.author && typeof currentTrack.author === 'string') {
			this.descrInfoAuthor.innerText = currentTrack.author;
		} else {
			this.descrInfoAuthor.innerText = 'Track\'s author';
		}
	}
	/* Creating DOM element function 
	   paramentrs: 
	   		name {string} - name of the element in Main object
	   		element {string} - type of DOM element
	   		className {string} - class name of the element
	*/ 
	function createElement(name, element, className) {
		this[name] = document.createElement(element);
		this[name].className = className;
	}
	function getStaticElement(element, className) {
		var node =  document.createElement(element);
		node.className = className;
		return node;
	}

	function getNextTrack() {
		var i = (this.currentTrack.pos + 1) % this.options.tracks.length;
		return i;
	}
	function nextTrack() {
		this.audioCore.pause();
		var newPos = getNextTrack.call(this);
		
		this.currentTrack = this.options.tracks[newPos];
		this.currentTrack.pos = newPos;
		this.audioCore.src = this.currentTrack.src; /*+ '?cb=' + new Date().getTime();*/
		this.audioCore.load();

		//
		updateTrackInfo.call(this);
		updateCurrentTime.call(this);
		//

		this.audioCore.play();

	}

	function initEventListeners() {
		var self = this;

		this.play.addEventListener('click', function() {
			if (self.audioCore.paused) {
				self.audioCore.play();
				this.className = this.className.replace('audio-player__btn-play','audio-player__btn-pause');
			} else {
				self.audioCore.pause();
				this.className = this.className.replace('audio-player__btn-pause','audio-player__btn-play');
			}
		});
		this.next.addEventListener('click', function() {
			nextTrack.call(self);
		});
		this.audioCore.addEventListener('ended', function() {
			nextTrack.call(self);
		});
		this.audioCore.addEventListener('timeupdate', function() {
			updateCurrentTime.call(self);
			updateTimelineActive.call(self);
			updateTimelineReady.call(self);
		});
		this.audioCore.addEventListener('loadedmetadata', function() {
			console.log('meta data is ready');
			updateCurrentTime.call(self);
			updateTrackInfo.call(self);
			updateMaxTime.call(self);
			updateTimelineActive.call(self);
			updateTimelineReady.call(self);
		});
		this.audioCore.addEventListener('progress', function() {
			updateTimelineReady.call(self);
		});
	}
})();

