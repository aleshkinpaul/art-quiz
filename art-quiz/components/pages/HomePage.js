'use strict';

import { Home } from './classes/Home.js';

export const HomePage = {
  render: async () => {
    const mainMenu = new Home();
    const view = await mainMenu.createMenu();
    return view.outerHTML;
  },
  postRender: () => {
    const menuItems = Array.from(document.querySelectorAll('.main-menu-item'));

    menuItems.forEach(item => item.addEventListener('click', () => { localStorage.setItem('chosen-quiz-type', item.id); }));
  }
}

export default Home;