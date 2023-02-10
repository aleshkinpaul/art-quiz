'use strict';

import { Utils } from '../services/Utils.js'

export const Header = {
  render: async () => {
    const view =  `
      <div class="container header-container">
        <a class="go-back-button hidden"></a>
        <a class="change-screen-mode-button"></a>
        <a href="./#/" class="app-title-link">
          <h1 class="app-title">Art Quiz</h1>
        </a>
      </div>
    `
    return view
  },
  postRender: () => {
    const request = Utils.parseRequestURL();
    const parsedURL = (request.resource ? '/' + request.resource : '/');
    
    const backButton = document.querySelector('.go-back-button');
    const changeScreenButton = document.querySelector('.change-screen-mode-button');

    setChangeScreenButtonIcon();
    setGoBackButtonInfo();

    changeScreenButton.addEventListener('click', changeScreenMode);

    function changeScreenMode() {
      const isFullScreen = !!document.fullscreenElement;

      if (!isFullScreen) {
        localStorage.setItem('is-full-screen', 1 - isFullScreen);
        setChangeScreenButtonIcon();
        document.documentElement.requestFullscreen();
      }
      else {
        localStorage.setItem('is-full-screen', 1 - isFullScreen);
        setChangeScreenButtonIcon();
        document.webkitExitFullscreen();
      }
    }

    function setChangeScreenButtonIcon() {
      const isFullScreen = Number(localStorage.getItem('is-full-screen'));
      if (!isFullScreen) {
        changeScreenButton.classList.add('full-screen-button');
        changeScreenButton.classList.remove('regular-screen-button');
        changeScreenButton.title = 'Включить полноэкранный режим';
      }
      else {
        changeScreenButton.classList.remove('full-screen-button');
        changeScreenButton.classList.add('regular-screen-button');
        changeScreenButton.title = 'Отключить полноэкранный режим';
      }
    }

    function setGoBackButtonInfo() {    
      if (parsedURL === '/round' || parsedURL === '/results') {
        backButton.href = './#/rounds-list';
        backButton.title = 'Вернуться в список раундов';
        backButton.classList.remove('hidden');
      }
      else if (parsedURL === '/rounds-list' || parsedURL === '/settings') {
        backButton.href = './#/';
        backButton.title = 'Вернуться на главную страницу';
        backButton.classList.remove('hidden');
      }
    }
  }
}

export default Header;