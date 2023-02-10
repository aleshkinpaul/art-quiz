'use strict';

export const audioTapPlayer = new Audio();
export const audioResultPlayer = new Audio();

const volume = Number(localStorage.getItem('volume')) / 100 || 0.5;

audioTapPlayer.currentTime = 0;
audioResultPlayer.currentTime = 0;
audioTapPlayer.volume = volume;
audioResultPlayer.volume = volume;

export default { audioTapPlayer, audioResultPlayer };