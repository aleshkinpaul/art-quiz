'use strict';

export class Home {
  constructor() {
    this.container = document.createElement('div');
    this.menuList = document.createElement('ul');

    this.menuList.classList.add('main-menu-list');
    this.container.classList.add('main-container', 'container');

    this.container.append(this.menuList);
  }

  async createMenu() {
    const data = JSON.parse(localStorage.getItem('quiz-types'));
    const settingsLink = this.createMenuLink('Настройки');

    data.forEach(obj => this.createMenuItem(obj));

    settingsLink.href = './#/settings';

    this.container.append(settingsLink);

    return this.container;
  }

  async createMenuItem(itemObj) {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const caption = document.createElement('figcaption');

    img.src = itemObj.src;
    caption.innerHTML = itemObj.name;
    listItem.id = itemObj.id;
    link.href = './#/rounds-list';

    img.classList.add('main-menu-item-cover');
    caption.classList.add('main-menu-item-caption');
    figure.classList.add('main-menu-item-figure');
    listItem.classList.add('main-menu-item');

    figure.append(img);
    figure.append(caption);
    link.append(figure);
    listItem.append(link);

    this.menuList.append(listItem);
  }

  createMenuLink(buttonName) {
    const settingsButton = document.createElement('a');

    settingsButton.innerHTML = buttonName;
    settingsButton.classList.add('main-menu-link');

    return settingsButton;
  }
}

export default Home;