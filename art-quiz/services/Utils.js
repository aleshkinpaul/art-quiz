'use strict';

import { Constants } from './Constants.js';
import { audioTapPlayer, audioResultPlayer } from './Player.js';

export const Utils = {
  parseRequestURL : () => {
    const url = location.hash.slice(1).toLowerCase() || '/';
    const r = url.split("/")
    const request = {
        resource      : null,
        subresource   : null,
        id            : null,
    }    
    request.resource    = r[1];
    request.subResource = r[2];
    request.id          = r[3];
    return request
  },
  saveGalleryData: async () => {
    let galleryData = JSON.parse(localStorage.getItem('gallery-data'));

    if (!galleryData) {
      const galleryImagesRequest = await fetch('./data/gallery-images.json');
      const galleryObj = await galleryImagesRequest.json();
      galleryData = galleryObj.gallery;  
      localStorage.setItem('gallery-data', JSON.stringify(galleryData));
    }
  },
  getUniqueArtists: () => {
    const galleryData = JSON.parse(localStorage.getItem('gallery-data'));
    const artistsArr = galleryData.map(galleryItem => galleryItem.author);
    const uniqueArtistsArr = Array.from(new Set(artistsArr));  
    localStorage.setItem('artists-data', JSON.stringify(uniqueArtistsArr));
  },
  saveQuizTypes: async () => {
    let quizTypesData = JSON.parse(localStorage.getItem('quiz-types'));

    if (!quizTypesData) {
      const quizTypesRequest = await fetch('./data/quiz-types.json');
      const quizTypesObj = await quizTypesRequest.json();
      const quizTypesData = quizTypesObj.items;    
      localStorage.setItem('quiz-types', JSON.stringify(quizTypesData));
    }
  },
  saveQuizResults: () => {
    let resultsObj = JSON.parse(localStorage.getItem('results-data'));

    if (!resultsObj) {
      const quizTypes = JSON.parse(localStorage.getItem('quiz-types'));
      const galleryData = JSON.parse(localStorage.getItem('gallery-data'));
      const roundsCount = galleryData.length / Constants.questionsInRoundCount;
      resultsObj = {};

      for (let quizTypeInd = 0; quizTypeInd < quizTypes.length; quizTypeInd++) {
        resultsObj[quizTypes[quizTypeInd].id] = {};

        for (let roundInd = 0; roundInd < roundsCount; roundInd++) {
          const minQuestionInd = roundInd * Constants.questionsInRoundCount;
          const maxQuestionInd = (roundInd + 1) * Constants.questionsInRoundCount;
          resultsObj[quizTypes[quizTypeInd].id][roundInd] = {};

          for (let questionInd = minQuestionInd; questionInd < maxQuestionInd; questionInd++) {
            resultsObj[quizTypes[quizTypeInd].id][roundInd][questionInd] = {};
            resultsObj[quizTypes[quizTypeInd].id][roundInd][questionInd]['isCorrect'] = false;
          }
        }
      }
      localStorage.setItem('results-data', JSON.stringify(resultsObj));
    }
  },
  savePlayedRounds: () => {
    let playedRoundsObj = JSON.parse(localStorage.getItem('played-rounds'));

    if (!playedRoundsObj) {
      const quizTypes = JSON.parse(localStorage.getItem('quiz-types'));
      const galleryData = JSON.parse(localStorage.getItem('gallery-data'));
      const roundsCount = galleryData.length / Constants.questionsInRoundCount;
      playedRoundsObj = {};

      for (let quizTypeInd = 0; quizTypeInd < quizTypes.length; quizTypeInd++) {
        playedRoundsObj[quizTypes[quizTypeInd].id] = {};

        for (let roundInd = 0; roundInd < roundsCount; roundInd++) {
          playedRoundsObj[quizTypes[quizTypeInd].id][roundInd] = {};
          playedRoundsObj[quizTypes[quizTypeInd].id][roundInd].isPlayed = false;
        }
      }
      localStorage.setItem('played-rounds', JSON.stringify(playedRoundsObj));
    }
  },
  saveSoundsData: async () => {
    let soundsData = JSON.parse(localStorage.getItem('sounds-data'));

    if (!soundsData) {
      const soundsDataRequest = await fetch('./data/audio-data.json');
      const soundsDataObj = await soundsDataRequest.json(); 
        
      localStorage.setItem('sounds-data', JSON.stringify(soundsDataObj));
    }
  },
  saveGameSettings: async () => {
    const isTimerOn = localStorage.getItem('is-timer-on');
    const timerValue = localStorage.getItem('timer-value');
    const volume = localStorage.getItem('volume');
    const isMute = localStorage.getItem('is-mute');
    
    if (isTimerOn === null || timerValue === null || volume === null || isMute === null) {
      const soundsDataRequest = await fetch('./data/settings-data.json');
      const soundsDataObj = await soundsDataRequest.json();

      if (isTimerOn === null) localStorage.setItem('is-timer-on', soundsDataObj.isTimerOn);
      if (timerValue === null) localStorage.setItem('timer-value', soundsDataObj.timerValue);
      if (volume === null) localStorage.setItem('volume', soundsDataObj.volume);
      if (isMute === null) localStorage.setItem('is-mute', soundsDataObj.isMute);
    } 
  },
  deleteRoundResult: () => {
    localStorage.removeItem('round-results-data');
    localStorage.removeItem('round-ind');
    localStorage.removeItem('question-num');
  },
  randomize: () => {
    return Math.random() - 0.5;
  },
  getRandomInd: (minInd, maxInd) => {
    return Math.floor(Math.random() * (maxInd - minInd) + minInd);
  },
  playTapAudio: () => {
    const soundsData = JSON.parse(localStorage.getItem('sounds-data'));
    const soundSrc = soundsData['tap'].src;

    audioTapPlayer.currentTime = 0;
    audioTapPlayer.src = soundSrc;
    audioTapPlayer.play();
  },
  playResultPlayer: (soundName) => {
    const soundsData = JSON.parse(localStorage.getItem('sounds-data'));
    const soundSrc = soundsData[soundName].src;

    audioResultPlayer.currentTime = 0;
    audioResultPlayer.src = soundSrc;
    audioResultPlayer.play();
  },
  changeVolume: () => {
    const volumeValue = Number(localStorage.getItem('volume')) / 100;

    audioTapPlayer.volume = volumeValue;
    audioResultPlayer.volume = volumeValue;
  },
  resetFullScreen: () => {
    localStorage.setItem('is-full-screen', 0);
  }
}

export default Utils;