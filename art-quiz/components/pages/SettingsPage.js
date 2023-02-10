'use strict';

import Utils from '../../services/Utils.js';
import { Settings } from './classes/Settings.js'

export const SettingsPage = {
  render: async () => {
    const settings = new Settings();
    const view = await settings.createPage();
    return view.outerHTML;
  },
  postRender: () => {
    const isTimerOn = Number(localStorage.getItem('is-timer-on'));

    const volumeInput = document.querySelector('.volume-range');
    const volumeButton = document.querySelector('.volume-icon');
    const timerModeCheckboxLabel = document.querySelector('.timer-label');
    const timerModeCheckbox = document.querySelector('.timer-checkbox');
    const timerValueLabel = document.querySelector('.timer-value-label');
    const timerValueInput = document.querySelector('.timer-value-range');

    timerModeCheckbox.checked = !!isTimerOn;

    volumeInput.addEventListener('input', changeVolume);
    volumeButton.addEventListener('click', switchMute);
    timerModeCheckbox.addEventListener('change', switchTimer);
    timerValueInput.addEventListener('input', changeTimerValue);

    function changeTimerValue() {
      const rangeProgressValue = (Number(timerValueInput.value) - 5) / 25 * 100;
      timerValueLabel.textContent = `${timerValueInput.value} сек`;
      timerValueInput.style.background = `linear-gradient(to right, #30698c 0%, #30698c ${rangeProgressValue}%, #83A5BA ${rangeProgressValue}%, #83A5BA 100%)`;
      localStorage.setItem('timer-value', timerValueInput.value);
    }

    function switchTimer() {
      timerModeCheckboxLabel.classList = 'timer-label';
      if (timerModeCheckbox.checked) timerModeCheckboxLabel.classList.add('timer-label-checked');
      localStorage.setItem('is-timer-on', timerModeCheckbox.checked ? 1 : 0);
    }

    function switchMute() {
      const volumeValue = Number(volumeInput.value);
      const isMute = 1 - Number(localStorage.getItem('is-mute'));
      let lastVolumeValue = Number(localStorage.getItem('last-volume-value'));

      volumeButton.classList = 'volume-icon';
      if (isMute) {
        volumeInput.value = 0;
        localStorage.setItem('volume', 0);
        localStorage.setItem('last-volume-value', volumeValue);
      }
      else {
        lastVolumeValue = Number(localStorage.getItem('last-volume-value'));
        volumeInput.value = lastVolumeValue;
        localStorage.setItem('volume', lastVolumeValue);
      }

      localStorage.setItem('is-mute', isMute);
      changeVolume();
    }

    function changeVolume() {
      const volumeValue = Number(volumeInput.value);
      if (volumeValue > 0) localStorage.setItem('is-mute', 0);

      volumeButton.classList = 'volume-icon';
      if (volumeValue >= 66) volumeButton.classList.add('volume-loud-icon')
      else if (volumeValue >= 33) volumeButton.classList.add('volume-medium-icon')
      else if (volumeValue > 0) volumeButton.classList.add('volume-quiet-icon')
      else volumeButton.classList.add('volume-mute-icon');

      volumeInput.style.background = `linear-gradient(to right, #30698c 0%, #30698c ${volumeInput.value}%, #83A5BA ${volumeInput.value}%, #83A5BA 100%)`;

      localStorage.setItem('volume', volumeValue);
      Utils.changeVolume();
    }
  }
}

export default SettingsPage;