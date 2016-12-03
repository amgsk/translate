'use strict';

/* global $ */

$(() => {

  const $token   = $('#token');
  const $save    = $('#save');
  const $error   = $('#error');
  const $message = $('#message');

  $save.click(() => {
    const token = $token.val();
    if (!token) {
      $error.text('tokenが入力されていません。').show().fadeOut(2000);
      return;
    }
    localStorage.setItem('token', token);
    $message.text('保存しました。').show().fadeOut(2000);
  });

  const initializeOptionView = () => {
    const token = localStorage.getItem('token');
    if (token) {
      $token.val(token);
    }
    $token.focus();
  };

  initializeOptionView();

});
