'use strict';

import { HomePage } from './components/pages/HomePage.js';
import { RoundsListPage } from './components/pages/RoundsListPage.js';
import { RoundPage } from './components/pages/RoundPage.js';
import { ResultsPage } from './components/pages/ResultsPage.js';
import { SettingsPage } from './components/pages/SettingsPage.js';

import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';

import { Utils } from './services/Utils.js';

const routes = {
  '/'                     : HomePage
  , '/rounds-list'        : RoundsListPage
  , '/round'              : RoundPage
  , '/results'            : ResultsPage
  , '/settings'           : SettingsPage
};

const router = async () => {
  const headerContainer = document.querySelector('.app-header');
  const loadingContainer = document.querySelector('.app-loading');
  const pageContainer = document.querySelector('.app-main-container');
  const footerContainer = document.querySelector('.app-footer');

  const request = Utils.parseRequestURL();
  const parsedURL = (request.resource ? '/' + request.resource : '/');  
  const componentPage = routes[parsedURL] ? routes[parsedURL] : Error404;
  
  headerContainer.innerHTML = await Header.render();
  Header.postRender();  
  footerContainer.innerHTML = await Footer.render();
    
  pageContainer.innerHTML = await componentPage.render();
  componentPage.postRender();
  
  loadingContainer.classList.add('hidden');

  if (parsedURL !== '/round') Utils.deleteRoundResult();
}

console.log(`
  Оценка: 194
  
  Не выполнены пункты:
  - Плавная смена изображений; картинки сначала загружаются, потом отображаются; нет ситуации, когда пользователь видит частично загрузившиеся изображения. Плавную смену изображений не проверяем: 1) при загрузке и перезагрузке приложения 2) при открытой консоли браузера +0/10
  - Реализована анимация отдельных деталей интерфейса, также анимированы переходы и взаимодействия, чтобы работа с приложением шла плавным и непрерывным потоком +0/20

  Частично выполненные пункты:
  - Дополнительный функционал на выбор + 4/20
    Из доп. функционала реализованы:
    -- возможность открыть приложение во весь экран +2
    -- разные уведомления по окончанию раунда в зависимости от результата +2 
`);

window.addEventListener('click', () => { Utils.playTapAudio() });
window.addEventListener('hashchange', router );
window.addEventListener('load', async () => {
  await Utils.saveQuizTypes();
  await Utils.saveGalleryData();
  await Utils.saveSoundsData();
  await Utils.saveGameSettings();
  Utils.getUniqueArtists();
  Utils.saveQuizResults();
  Utils.savePlayedRounds();
  Utils.resetFullScreen();
  router();
});