'use strict';

import { Round } from './classes/Round.js'
import { Constants } from '../../services/Constants.js'
import { Utils } from '../../services/Utils.js'

export const RoundPage = {
  render: async () => {
    const round = new Round();
    const view = await round.createRound();
    return view.outerHTML;
  },
  postRender: () => { 
    const backButton = document.querySelector('.go-back-button');
    const answerOptions = Array.from(document.querySelectorAll('.question-answers-list-item'));
    const popupButton = document.querySelector('.popup-button');
    const finishRoundButton = document.querySelector('.round-result-popup-button');
    const dotsArr = Array.from(document.querySelectorAll('.round-dot-item'));
    const timerValueElem = document.querySelector('.timer-value');
    let timerInterval;

    const galleryData = JSON.parse(localStorage.getItem('gallery-data'));
    const quizType = localStorage.getItem('chosen-quiz-type');
    const roundInd = Number(localStorage.getItem('round-ind'));
    const roundResultsObj = JSON.parse(localStorage.getItem('round-results-data')) || {};
    const isTimerOn = Number(localStorage.getItem('is-timer-on'));

    if (!roundResultsObj[roundInd]) roundResultsObj[roundInd] = {};
    
    answerOptions.forEach(option => option.addEventListener('click', chooseAnswer));
    
    finishRoundButton.addEventListener('click', finishRound);
    
    popupButton.addEventListener('click', () => {
      const questionInfoPopup = document.querySelector('.question-info-popup');

      if (popupButton.classList.contains('last-question-info-popup-button')) {
        questionInfoPopup.classList.add('hidden');
        setTimeout(() => {
          showRoundResultPopup();
        }, 500);
      }
    });

    if (isTimerOn) timerInterval = timerCountdown(timerValueElem);

    function timerCountdown(timerElem) {
      const timerInterval = setInterval(() => {
        const request = Utils.parseRequestURL();
        const parsedURL = (request.resource ? '/' + request.resource : '/'); 
        const timerValue = Number(timerElem.innerHTML);
  
        if (timerValue > 0) timerElem.innerHTML = timerValue - 1
        else {
          localStorage.setItem('is-fail', 1);
          showRoundResultPopup();
          clearInterval(timerInterval);
        };

        if (parsedURL !== '/round') clearInterval(timerInterval);
      }, 1000);

      return timerInterval;
    }

    function finishRound() {
      const resultsData = JSON.parse(localStorage.getItem('results-data'));
      const roundResultsData = JSON.parse(localStorage.getItem('round-results-data')) || {};
      const playedRounds = JSON.parse(localStorage.getItem('played-rounds'));
      const isFail = Number(localStorage.getItem('is-fail'));
      
      if (!isTimerOn || !isFail) {
        resultsData[quizType][roundInd] = roundResultsData[roundInd];
        playedRounds[quizType][roundInd].isPlayed = true;
        
        localStorage.setItem('results-data', JSON.stringify(resultsData));
        localStorage.setItem('played-rounds', JSON.stringify(playedRounds));
      }

      localStorage.removeItem('round-results-data');
      localStorage.setItem('is-fail', 0);
    }

    function chooseAnswer(e) {
      const questionNum = Number(localStorage.getItem('question-num'));
      const questionInfo = galleryData[questionNum];
      const questionRoundInd = questionNum - (roundInd * Constants.questionsInRoundCount);
      let isCorrect = false;

      if (quizType === 'artists') {
        const optionElem = e.target.querySelector('.question-answers-list-item-name');
        if (optionElem.innerHTML === questionInfo.author) {
          e.target.classList.add('question-answers-list-item-correct');
          dotsArr[questionRoundInd].classList.add('round-dot-item-correct');
          isCorrect = true;
        }
        else {
          e.target.classList.add('question-answers-list-item-incorrect');
          dotsArr[questionRoundInd].classList.add('round-dot-item-incorrect');
        }
      }
      else if (quizType === 'paintings') {
        const answerNum = Number(e.target.getAttribute('question-num'));

        if (answerNum === questionNum) {
          e.target.classList.add('question-answers-list-item-img-correct');
          isCorrect = true;
        }
        else e.target.classList.add('question-answers-list-item-img-incorrect');
      }

      if (isCorrect) Utils.playResultPlayer('right-answer')
      else Utils.playResultPlayer('wrong-answer');

      if (!roundResultsObj[roundInd][questionNum]) roundResultsObj[roundInd][questionNum] = {};
      roundResultsObj[roundInd][questionNum].isCorrect = isCorrect;

      localStorage.setItem('round-results-data', JSON.stringify(roundResultsObj));
      clearInterval(timerInterval);

      setTimeout(() => {
        openQuestionInfoPopup(questionInfo, isCorrect);
      }, 1000);
    }

    function openQuestionInfoPopup(questionInfo, isCorrect) {
      const questionInfoPopupOverlay = document.querySelector('.question-info-popup-overlay');
      const questionInfoPopup = document.querySelector('.question-info-popup');
      const answerResult = document.querySelector('.question-info-result');
      const paintingImg = document.querySelector('.question-info-img');
      const paintingName = document.querySelector('.question-info-painting-name');
      const authorName = document.querySelector('.question-info-author-name');

      paintingName.innerHTML = `\"${questionInfo.name}\" (${questionInfo.year})`;
      authorName.innerHTML = `${questionInfo.author}`;
      paintingImg.src = `./assets/images/paintings/${questionInfo.imageNum}.jpg`;

      if (isCorrect) {
        answerResult.innerHTML = 'Правильно!';
        answerResult.classList = 'question-info-result question-info-result-correct';
      }
      else {
        answerResult.innerHTML = 'Не правильно!';
        answerResult.classList = 'question-info-result question-info-result-incorrect';
      }

      questionInfoPopup.classList.remove('hidden');
      questionInfoPopupOverlay.classList.remove('hidden');
    }

    function showRoundResultPopup() {
      const questionInfoPopup = document.querySelector('.question-info-popup-overlay');
      const roundResultPopup = document.querySelector('.round-result-popup');
      const roundResultTitle = document.querySelector('.round-result-title');
      const pointsInfo = document.querySelector('.round-result-points');
      const resultComment = document.querySelector('.round-result-comment');
      const isFail = Number(localStorage.getItem('is-fail'));

      const roundResultData = JSON.parse(localStorage.getItem('round-results-data')) || {};
      let pointsCount = 0;

      for (let questionInd in roundResultData[roundInd]) {
        if (roundResultData[roundInd][questionInd].isCorrect) pointsCount++;
      }

      if (isTimerOn && isFail) {
        Utils.playResultPlayer('fail');
        pointsInfo.remove();
        
        roundResultTitle.innerHTML = 'Время истекло!';
        resultComment.innerHTML = 'К сожалению, время истекло :(\nНо можно попробовать еще раз!';
      }
      else {
        Utils.playResultPlayer('finish-round');

        roundResultTitle.innerHTML = 'Раунд завершен!';
        pointsInfo.innerHTML = `Ваш результат:<br>${pointsCount} / ${Constants.questionsInRoundCount}`;
        const resultProcessValue = Math.floor(pointsCount / Constants.questionsInRoundCount * 100);
        
        resultComment.innerHTML = resultProcessValue === 100 ? 'Вау! Вы музейный гид?!'
                                  : resultProcessValue >= 80 ? 'Отлично! Мало кто может похвастаться таким результатом!'
                                  : resultProcessValue >= 60 ? 'А это хорошо! Вы точно сможете покозырять знаниями перед своими друзьями!'
                                  : resultProcessValue >= 40 ? 'Неплохо! Уверены, в следующий раз будет лучше!'
                                  : resultProcessValue >= 20 ? 'Вы в начале пути, но что-то уже знаете! Давайте пробовать дальше!'
                                  : 'Результат, конечно, неутешительный... Но теперь вы знаете больше!';
      }

      questionInfoPopup.classList.add('hidden');
      roundResultPopup.classList.remove('hidden');
      questionInfoPopup.classList.remove('hidden');
    }
   }
}

export default RoundPage;