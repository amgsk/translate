'use strict';

/* global $ */

$(() => {

  const $token   = $('#token');
  const $save    = $('#save');
  const $error   = $('#error');
  const $message = $('#message');

  $save.click(() => {
    // get inputted token
    const token = $token.val();
    if (!token) {
      $error.text('tokenが入力されていません。').show().fadeOut(2000);
      return;
    }

    // get selected theme
    const theme = $('[name=theme-select]:checked').val();

    localStorage.setItem('token', token);
    localStorage.setItem('theme', theme);

    $message.text('保存しました。').show().fadeOut(2000);

    initializeOptionView();
  });

  const initializeOptionView = () => {
    // set Token
    const token = localStorage.getItem('token');
    if (token) {
      $token.val(token);
    }

    // set Theme (default: light)
    const theme = localStorage.getItem('theme') || $($('[name=theme-select]')[0]).val();
    if (theme) {
      $(`#${theme}`).prop('checked', true);
    }
    // inject CSS
    common.loadThemeCss(theme);

    $token.focus();
  };

  initializeOptionView();

});
