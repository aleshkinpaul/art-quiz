'use strict';

import { Constants } from '../../../services/Constants.js'

export class RoundsList {
  constructor() {
    this.quizType = localStorage.getItem('chosen-quiz-type');

    this.container = document.createElement('div');
    this.menuList = document.createElement('ul');

    this.menuList.classList.add('rounds-list');
    this.container.classList.add('main-container', 'container');

    this.container.append(this.menuList);
  }

  async createList() {
    const data = JSON.parse(localStorage.getItem('gallery-data'));
    const roundsCount = data.length / Constants.questionsInRoundCount;

    for (let roundInd = 0; roundInd < roundsCount; roundInd++) {
      this.createRoundCard(roundInd);
    }

    return this.container;
  }

  createRoundCard(roundInd) {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    const resultInfo = document.createElement('a');
    const iconSpan = document.createElement('span');
    const roundNum = (roundInd + 1 < 10) ? '0' + (roundInd + 1) : (roundInd + 1);
    
    link.innerHTML = `${roundNum}`;
    link.href = `#/round/question/${roundInd * Constants.questionsInRoundCount}`;
    resultInfo.href = './#/results';
    resultInfo.title = 'Посмотреть результаты';
    listItem.setAttribute('round-ind', roundInd);

    if (this.getIsPlayedRound(roundInd)) {
      const roundResultValue = this.getRoundResultInfo(roundInd);

      resultInfo.innerHTML = roundResultValue + '%'

      if (roundResultValue >= 66) resultInfo.classList.add('rounds-list-item-icon-good-result')
      else if (roundResultValue >= 33) resultInfo.classList.add('rounds-list-item-icon-medium-result')
      else resultInfo.classList.add('rounds-list-item-icon-bad-result');

      listItem.classList.add('rounds-list-item-played');
    }
    else {
      resultInfo.innerHTML = '?';
    }
    
    if (this.quizType === 'artists') iconSpan.classList.add('artists-rounds-list-item-icon');
    else iconSpan.classList.add('paintings-rounds-list-item-icon');
    iconSpan.classList.add('rounds-list-item-icon');
    resultInfo.classList.add('rounds-list-item-result-info');
    link.classList.add('rounds-list-item-link');
    listItem.classList.add('rounds-list-item');

    listItem.append(resultInfo);
    listItem.append(iconSpan);
    listItem.append(link);
    this.menuList.append(listItem);
  }

  getRoundResultInfo(roundInd) {
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

export default RoundsList;