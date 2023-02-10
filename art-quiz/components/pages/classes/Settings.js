'use strict';

import { Constants } from '../../../services/Constants.js'

export class Settings {
  constructor() {  }

  createPage() {
    const settingsContainer = document.createElement('div');
    const volumeSetting = this.createVolumeSetting();
    const timerSetting = this.createTimerSetting();

    settingsContainer.append(volumeSetting);
    settingsContainer.append(timerSetting);

    settingsContainer.classList.add('container', 'settings-container');

    return settingsContainer;
  }

  createVolumeSetting() {
    const volumeValue = localStorage.getItem('volume');

    const volumeContainer = document.createElement('div');
    const volumeTitle = document.createElement('h2');
    const volumeControls = document.createElement('div');
    const volumeInput = document.createElement('input');
    const volumeButton = document.createElement('button');

    volumeTitle.innerHTML = 'Настройки аудио:'
    volumeInput.type = 'range';
    volumeInput.min = '0';
    volumeInput.max = '100';
    volumeInput.step = '1';
    volumeInput.setAttribute('value', volumeValue);

    volumeInput.style.background = `linear-gradient(to right, #30698c 0%, #30698c ${volumeInput.value}%, #83A5BA ${volumeInput.value}%, #83A5BA 100%)`;

    this.changeVolumeIcon(volumeInput, volumeButton);
    volumeInput.classList.add('volume-range');
    volumeButton.classList.add('volume-icon');
    volumeTitle.classList.add('volume-title');
    volumeControls.classList.add('volume-controls');
    volumeContainer.classList.add('volume-container');

    volumeControls.append(volumeButton);
    volumeControls.append(volumeInput);
    volumeContainer.append(volumeTitle);
    volumeContainer.append(volumeControls);

    return volumeContainer;
  }

  changeVolumeIcon(volumeInput, volumeButton) {
    const volumeValue = Number(volumeInput.getAttribute('value'));

    if (volumeValue >= 66) volumeButton.classList.add('volume-loud-icon')
    else if (volumeValue >= 33) volumeButton.classList.add('volume-medium-icon')
    else if (volumeValue > 0) volumeButton.classList.add('volume-quiet-icon')
    else volumeButton.classList.add('volume-mute-icon');
  }

  createTimerSetting() {
    const timerValue = Number(localStorage.getItem('timer-value'));
    const isTimerOn = Number(localStorage.getItem('is-timer-on'));
    const rangeProgressValue = (timerValue - 5) / 25 * 100;

    const timerContainer = document.createElement('div');
    const timerSettingsContainer = document.createElement('div');
    const timerTitle = document.createElement('h2');
    const timerModeCheckboxLabel = document.createElement('label');
    const timerModeCheckbox = document.createElement('input');
    const tumerValueContainer = document.createElement('div');
    const timerValueLabel = document.createElement('label');
    const timerValueInput = document.createElement('input');

    timerTitle.innerHTML = 'Настройки таймера:';
    timerModeCheckboxLabel.innerHTML = 'Таймер на вопрос';
    timerModeCheckbox.type = 'checkbox';
    timerValueInput.type = 'range';
    timerValueInput.min = '5';
    timerValueInput.max = '30';
    timerValueInput.step = '5';
    timerValueInput.id = 'timer-value-input';
    timerValueLabel.for = 'timer-value-input';
    timerValueLabel.innerHTML = `${timerValue} сек`;
    timerValueInput.setAttribute('value', timerValue);

    timerValueInput.style.background = `linear-gradient(to right, #30698c 0%, #30698c ${rangeProgressValue}%, #83A5BA ${rangeProgressValue}%, #83A5BA 100%)`;

    if (isTimerOn) timerModeCheckboxLabel.classList.add('timer-label-checked');
    timerTitle.classList.add('timer-title');
    timerModeCheckbox.classList.add('timer-checkbox');
    timerModeCheckboxLabel.classList.add('timer-label');
    timerValueInput.classList.add('timer-value-range');
    timerValueLabel.classList.add('timer-value-label');
    tumerValueContainer.classList.add('timer-value-container');
    timerSettingsContainer.classList.add('timer-settings-container')
    timerContainer.classList.add('timer-container');

    timerModeCheckboxLabel.append(timerModeCheckbox);
    tumerValueContainer.append(timerValueInput);
    tumerValueContainer.append(timerValueLabel);
    timerSettingsContainer.append(timerModeCheckboxLabel);
    timerSettingsContainer.append(tumerValueContainer);
    timerContainer.append(timerTitle);
    timerContainer.append(timerSettingsContainer);

    return timerContainer;
  }
}

export default Settings;