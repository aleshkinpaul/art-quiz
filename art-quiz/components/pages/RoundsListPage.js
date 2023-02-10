'use strict';

import { RoundsList } from './classes/RoundsList.js'

export const RoundsListPage = {
  render: async () => {
    const mainMenu = new RoundsList();
    const view = await mainMenu.createList();
    return view.outerHTML;
  },
  postRender: () => {
    const roundsListItems = Array.from(document.querySelectorAll('.rounds-list-item'));

    roundsListItems.forEach(item => {
     const roundInd = item.getAttribute('round-ind');
     item.addEventListener('click', () => { localStorage.setItem('round-ind', roundInd) })
    })    
  }
}

export default RoundsListPage;