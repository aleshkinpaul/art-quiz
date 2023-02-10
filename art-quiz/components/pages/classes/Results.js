'use strict';

import { Constants } from '../../../services/Constants.js'

export class Results {
  constructor() {
    this.quizType = localStorage.getItem('chosen-quiz-type');
    this.roundInd = Number(localStorage.getItem('round-ind'));

    this.container = document.createElement('div');
    
    this.container.classList.add('main-container', 'container');
  }

  async createPage() {
    const roundCard = this.createRoundCard();
    const roundGalleryContainer = this.createRoundGallery();

    this.container.append(roundCard);
    this.container.append(roundGalleryContainer);

    return this.container;
  }

  createRoundCard() {
    const roundItem = document.createElement('div');
    const roundNumInfo = document.createElement('span');
    const resultInfo = document.createElement('span');
    const iconSpan = document.createElement('span');
    const roundNum = this.addZeroToDigit(this.roundInd + 1);
    
    roundNumInfo.innerHTML = `${roundNum}`;
    
    if (this.getIsPlayedRound(this.roundInd)) {
      const roundResultValue = this.getCorrectAnswersCount(this.roundInd);

      resultInfo.innerHTML = roundResultValue + '%'

      if (roundResultValue >= 66) resultInfo.classList.add('round-card-icon-good-result')
      else if (roundResultValue >= 33) resultInfo.classList.add('round-card-icon-medium-result')
      else resultInfo.classList.add('round-card-icon-bad-result');

      roundItem.classList.add('round-card-played');
    }
    else {
      resultInfo.innerHTML = '?';
    }

    roundItem.setAttribute('round-ind', this.roundInd);
    
    if (this.quizType === 'artists') iconSpan.classList.add('artists-round-icon');
    else iconSpan.classList.add('paintings-round-icon');
    iconSpan.classList.add('round-icon');
    resultInfo.classList.add('round-result-info');
    roundNumInfo.classList.add('round-num-info');
    roundItem.classList.add('round-card');

    roundItem.append(resultInfo);
    roundItem.append(iconSpan);
    roundItem.append(roundNumInfo);

    return roundItem;
  }

  createRoundGallery() {
    const roundGalleryContainer = document.createElement('div');
    const roundGalleryTitle = document.createElement('h2');
    const roundGalleryList = document.createElement('ul');

    roundGalleryTitle.innerHTML = `Галерея раунда ${this.addZeroToDigit(this.roundInd + 1)}`;

    roundGalleryList.classList.add('round-gallery-list');
    roundGalleryTitle.classList.add('round-gallery-title');
    roundGalleryContainer.classList.add('round-gallery-container');

    for (let listItemInd = 0; listItemInd < Constants.questionsInRoundCount; listItemInd++ ) {
      const roundGalleryListItem = this.createRoundGalleryItem(listItemInd);
      roundGalleryList.append(roundGalleryListItem);
    }

    roundGalleryContainer.append(roundGalleryTitle);
    roundGalleryContainer.append(roundGalleryList);

    return roundGalleryContainer;
  }

  createRoundGalleryItem(itemInd) {
    const paintingNum = this.roundInd * Constants.questionsInRoundCount + itemInd

    const galleryItem = document.createElement('li');
    const paintingImg = document.createElement('img');
    const paintingInfo = this.setPaintingInfo(paintingNum);

    paintingImg.src = `./assets/images/paintings/${paintingNum}.jpg`;

    if (this.getAnswerIsCorrectValue(paintingNum)) paintingImg.classList.add('round-gallery-list-item-img-correct')
    else paintingImg.classList.add('round-gallery-list-item-img-incorrect');
    paintingImg.classList.add('round-gallery-list-item-img');
    galleryItem.classList.add('round-gallery-list-item');

    galleryItem.append(paintingImg);
    galleryItem.append(paintingInfo);

    return galleryItem;
  }

  setPaintingInfo(paintingNum) {
    const galleryData = JSON.parse(localStorage.getItem('gallery-data'));

    const paintingInfoPopup = document.createElement('div');
    const paintingName = document.createElement('p');
    const paintingAuthor = document.createElement('p');

    paintingName.innerHTML = `${galleryData[paintingNum].name} (${galleryData[paintingNum].year})`;
    paintingAuthor.innerHTML = `${galleryData[paintingNum].author}`;

    paintingName.classList.add('painting-info-name');
    paintingInfoPopup.classList.add('painting-info-popup');

    paintingInfoPopup.append(paintingName);
    paintingInfoPopup.append(paintingAuthor);

    return paintingInfoPopup;
  }

  addZeroToDigit(digit) {
    return (digit < 10) ? '0' + digit : digit;
  }

  getAnswerIsCorrectValue(paintingNum) {
    const resultsData = JSON.parse(localStorage.getItem('results-data'));
    if (!resultsData || !resultsData[this.quizType] || !resultsData[this.quizType][this.roundInd]) return 0;

    return resultsData[this.quizType][this.roundInd][paintingNum].isCorrect;
  }

  getCorrectAnswersCount(roundInd) {
    const resultsData = JSON.parse(localStorage.getItem('results-data'));
    if (!resultsData || !resultsData[this.quizType] || !resultsData[this.quizType][roundInd]) return 0;

    const roundResultsData = resultsData[this.quizType][roundInd];
    const firstQuestionInd = roundInd * Constants.questionsInRoundCount;
    const lastQuestionInd = (roundInd + 1) * Constants.questionsInRoundCount - 1;
    let correctAnswerCount = 0;

    for (let questionInd = firstQuestionInd; questionInd < lastQuestionInd; questionInd++) {
      if (roundResultsData[questionInd].isCorrect) correctAnswerCount++;
    }

    return Math.floor(correctAnswerCount / Constants.questionsInRoundCount * 100);
  }

  getIsPlayedRound(roundInd) {
    const playedRounds = JSON.parse(localStorage.getItem('played-rounds'));
    if (!playedRounds || !playedRounds[this.quizType] || !playedRounds[this.quizType][roundInd])
      return 0;

    return playedRounds[this.quizType][roundInd].isPlayed;
  }
}

export default Results;