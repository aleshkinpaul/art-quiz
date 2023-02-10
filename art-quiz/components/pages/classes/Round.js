'use strict';

import { Utils } from '../../../services/Utils.js'
import { Constants } from '../../../services/Constants.js'

export class Round {
  constructor() {
    const request = Utils.parseRequestURL();
    this.currentQuestionNum = Number(request.id);

    this.quizType = localStorage.getItem('chosen-quiz-type');
    this.roundInd = localStorage.getItem('round-ind');
    this.isTimerOn = Number(localStorage.getItem('is-timer-on'));
    this.timerValue = localStorage.getItem('timer-value');
    this.questionInRoundInd = this.currentQuestionNum - this.roundInd * Constants.questionsInRoundCount;

    this.roundQuestionsArr = this.getQuestionData();
  }

  async createRound() {
    const container = document.createElement('div');
    const questionInfoPopupOverlay = this.createPopupOverlay();
    const dotsList = this.createDotsList();
    const timerContainer = this.createTimer();
    const questionContainer = this.createQuestionCard();
    
    container.classList.add('main-container', 'container');

    container.append(dotsList);
    container.append(timerContainer);
    container.append(questionContainer);
    container.append(questionInfoPopupOverlay);

    return container;
  }

  createTimer() {
    if (this.isTimerOn) {
      const timerContainer = document.createElement('div');
      const timerSpan = document.createElement('span');

      timerSpan.innerHTML = this.timerValue;
      timerContainer.innerHTML = 'Время: ';

      timerSpan.classList.add('timer-value');
      timerContainer.classList.add('timer-container');

      timerContainer.append(timerSpan);

      return timerContainer;
    }
    else return '';
  }

  createPopupOverlay() {
    const questionInfoPopupOverlay = document.createElement('div');
    const questionInfoPopup = this.createQuestionInfoPopup();
    const roundResultPopup = this.createRoundResultPopup();
    
    questionInfoPopupOverlay.classList.add('question-info-popup-overlay', 'hidden');

    questionInfoPopupOverlay.append(questionInfoPopup);
    questionInfoPopupOverlay.append(roundResultPopup);

    return questionInfoPopupOverlay;
  }

  createRoundResultPopup() {
    const roundResultPopup = document.createElement('div');
    const resultTitle = document.createElement('h3');
    const resultInfo = document.createElement('div');
    const pointsInfo = document.createElement('span');
    const resultComment = document.createElement('p');
    const moveToRiundsListLink = document.createElement('a');

    moveToRiundsListLink.innerHTML = 'Завершить';
    moveToRiundsListLink.href = `#/rounds-list`;

    resultTitle.classList.add('round-result-title');
    resultInfo.classList.add('round-result-popup-container');
    pointsInfo.classList.add('result-info-paragraph', 'round-result-points');
    resultComment.classList.add('result-info-paragraph', 'round-result-comment');
    moveToRiundsListLink.classList.add('popup-button', 'round-result-popup-button');
    roundResultPopup.classList.add('round-result-popup', 'hidden');
    
    roundResultPopup.append(resultTitle);
    resultInfo.append(pointsInfo);
    resultInfo.append(resultComment);
    roundResultPopup.append(resultInfo);
    roundResultPopup.append(moveToRiundsListLink);

    return roundResultPopup;
  }

  createQuestionInfoPopup() {
    const questionInfoPopup = document.createElement('div');
    const resultInfo = document.createElement('h3');
    const questionInfo = document.createElement('div');
    const paintingImage = document.createElement('img');
    const paintingName = document.createElement('p');
    const authorName = document.createElement('p');
    const nextQuestionLink = document.createElement('a');

    if (this.questionInRoundInd === Constants.questionsInRoundCount - 1) {
      nextQuestionLink.classList.add('last-question-info-popup-button');
      nextQuestionLink.innerHTML = 'Завершить';
    }
    else {
      nextQuestionLink.innerHTML = 'Далее';
      nextQuestionLink.href = `#/round/question/${this.currentQuestionNum + 1}`;
    }

    resultInfo.classList.add('question-info-result');
    paintingImage.classList.add('question-info-img');
    paintingName.classList.add('question-info-paragraph', 'question-info-painting-name');
    authorName.classList.add('question-info-paragraph', 'question-info-author-name');
    questionInfo.classList.add('question-info-popup-container');
    nextQuestionLink.classList.add('popup-button', 'question-info-popup-button');
    questionInfoPopup.classList.add('question-info-popup', 'hidden');
    
    questionInfoPopup.append(resultInfo);
    questionInfo.append(paintingImage);
    questionInfo.append(paintingName);
    questionInfo.append(authorName);
    questionInfoPopup.append(questionInfo);
    questionInfoPopup.append(nextQuestionLink);

    return questionInfoPopup;
  }

  createDotsList() {
    const roundResultsData = JSON.parse(localStorage.getItem('round-results-data'));
    const dotsList = document.createElement('ul');

    dotsList.classList.add('round-dot-list');

    for (let dotInd = 0; dotInd < Constants.questionsInRoundCount; dotInd++) {
      const questionNumForDot = dotInd + this.roundInd * Constants.questionsInRoundCount;
      const dotItem = document.createElement('li');
      
      dotItem.setAttribute('dot-ind', dotInd);
      
      dotItem.classList.add('round-dot-item');
      if (dotInd === this.questionInRoundInd) dotItem.classList.add('round-dot-item-active');
      if (roundResultsData && roundResultsData[this.roundInd] && roundResultsData[this.roundInd][questionNumForDot]) {
        if (roundResultsData[this.roundInd][questionNumForDot].isCorrect) dotItem.classList.add('round-dot-item-correct')
        else dotItem.classList.add('round-dot-item-incorrect');
      }

      dotsList.append(dotItem);
    }

    return dotsList;
  }

  openNextQuestion() {
    const questionInfoPopupOverlay = document.querySelector('.question-info-popup-overlay');
    questionInfoPopupOverlay.classList.add('question-info-popup-overlay-hidden');
  }

  createQuestionCard() {
    const questionInfo = this.roundQuestionsArr[this.questionInRoundInd];
    
    const questionContainer = document.createElement('div');
    const questionTitle = document.createElement('h2');
    const questionImg = document.createElement('img');
    const answersList = document.createElement('ul');
    const answerArr = this.getAnswerOptions(questionInfo);

    localStorage.setItem('question-num', questionInfo.imageNum);

    questionTitle.classList.add('question-title');
    answersList.classList.add('question-answers-list');
    questionImg.classList.add('question-image');
    questionContainer.classList.add('question-container');

    this.setQuestionInfo(questionInfo, questionTitle, questionImg);

    answerArr.forEach((answer, ind, answerArr) => {
      const answersListItem = this.createAnswerOption(answer, ind, answerArr);
      answersList.append(answersListItem);
    })

    questionContainer.append(questionTitle);
    questionContainer.append(questionImg);
    questionContainer.append(answersList);

    return questionContainer;
  }

  createAnswerOption(answer, ind, answerArr) {
    const answersListItem = document.createElement('li');
    const answerName = document.createElement('span');
      
    if (this.quizType === 'artists') {
      answerName.innerHTML = `${answer}`;

      answerName.classList.add('question-answers-list-item-name');
      answersListItem.classList.add('question-answers-list-item');

      answersListItem.append(answerName);
    }
    else if (this.quizType === 'paintings') {
      const optionImg = document.createElement('img');

      optionImg.setAttribute('question-num', answerArr[ind]);
      optionImg.src = `./assets/images/paintings/${answerArr[ind]}.jpg`;

      optionImg.classList.add('question-answers-list-item-img');
      answersListItem.classList.add('question-answers-list-item', 'question-answers-list-item-paintings');

      answersListItem.append(optionImg);
    }

    return answersListItem;
  }

  setQuestionInfo(questionInfo, questionTitle, questionImg) {
    if (this.quizType === 'artists') {
      questionTitle.innerHTML = 'Кто автор этой картины?';
      questionImg.src = `./assets/images/paintings/${questionInfo.imageNum}.jpg`;
    }
    else if (this.quizType === 'paintings') {
      questionTitle.innerHTML = `Какую из этих картин нарисовал ${questionInfo.author}?`;
      questionImg.remove();
    }
  }

  getAnswerOptions(questionInfo) {
    if (this.quizType === 'artists') {
      const optionsArr = JSON.parse(localStorage.getItem('artists-data'));
      const answersArr = [questionInfo.author];
  
      while (answersArr.length < 4) {
        const randomInd = Utils.getRandomInd(0, optionsArr.length);
        if (!answersArr.includes(optionsArr[randomInd])) answersArr.push(optionsArr[randomInd]);
      }

      return answersArr.sort(Utils.randomize);
    }
    else if (this.quizType === 'paintings') {
      const optionsArr = JSON.parse(localStorage.getItem('gallery-data'));
      const answersArr = [Number(questionInfo.imageNum)];
  
      while (answersArr.length < 4) {
        const randomInd = Utils.getRandomInd(0, optionsArr.length);
        const optionImageNum = Number(optionsArr[randomInd].imageNum);
        const optionAuthor = optionsArr[randomInd].author;

        if (!answersArr.includes(optionImageNum) && questionInfo.author !== optionAuthor)
              answersArr.push(optionImageNum);
      }

      return answersArr.sort(Utils.randomize);
    }
  }

  getQuestionData() {
    const galleryData = JSON.parse(localStorage.getItem('gallery-data'));
    const roundInd = JSON.parse(localStorage.getItem('round-ind'));
    const roundQuestionsArr = [];
    const minQuestionInd = roundInd * Constants.questionsInRoundCount;
    const maxQuestionInd = (roundInd + 1) * Constants.questionsInRoundCount;
    
    for (let questionInd = minQuestionInd; questionInd < maxQuestionInd; questionInd++) {
      roundQuestionsArr.push(galleryData[questionInd]);
    }

    return roundQuestionsArr;
  }
}

export default Round;