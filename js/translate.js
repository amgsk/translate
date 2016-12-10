'use strict';

/* global $ */

$(() => {
  const MAX_HISTORY_LENGTH = 5; // 履歴保存数

  const $text      = $('#text');
  const $casing    = $('[name=casing]');
  const $translate = $('#translate');
  const $error     = $('#error');

  // 再翻訳ボタン
  const reTransButton = `
    <button type="button" class="retrans-button btn btn-xs btn-default">
      <i class="glyphicon glyphicon-repeat"></i>
    </button>
  `;

  const mergeHistory = (data) => {
    const history = [];

    const oldHistory = getHistory();
    if (oldHistory) {
      oldHistory.forEach((h) => {
        history.push(h);
      });
    }
    history.push(data);

    saveHistory(JSON.stringify(history.splice(-MAX_HISTORY_LENGTH)));
  };

  const saveHistory = (data) => {
    localStorage.setItem('translateResult', data);
  };

  const getHistory = () => {
    const translateResult = localStorage.getItem('translateResult');
    return translateResult ? JSON.parse(translateResult) : null;
  };

  /**
   * 初期化
   * */
  const initView = () => {

    // 以前に実行した記法(またはデフォルト値であるcamel)を選択状態にする
    const saved_casing = localStorage.getItem('casing') || 'camel';
    $casing.each((index, element) => {
      if ($(element).val() === saved_casing)
        $(element).prop('checked', true);
    });
    displayResult();
  };

  /**
   * 結果表示
   * */
  const displayResult = () => {
    $("#history-row").children().remove();

    const histories = getHistory();
    if (histories) {
      histories.reverse().forEach((history) => {

        const createTooltips = (h) => {
          let tooltiop = h.text;
          h.words.forEach((w) => {
            if (w.translated_text) {
              const regExp = new RegExp(w.text, 'g');
              tooltiop = tooltiop.replace(regExp, `<span data-toggle="tooltip" title="${w.translated_text}"><u>${w.text}</u></span>`);
            }
          });
          return tooltiop;
        };

        const tableRow = `<tr>
                           <td class="original">${createTooltips(history)}</td>
                           <td class="translated_text"><pre>${history.translated_text}</pre></td>
                           <td>${reTransButton}</td>
                         </tr>`;

        $('#history-row').append(tableRow);
      });

      // init tooltip
      $('[data-toggle="tooltip"]').tooltip();

      $text.focus();
    }
  };

  /**
   * API
   * */
  const translate = (text, casing, token) => {
    return new Promise((resolve, reject) => {
      const translateText = encodeURI(text);
      $.ajax({
        url     : `https://api.codic.jp/v1/engine/translate.json?text=${translateText}&casing=${casing}`,
        dataType: 'json',
        headers : {
          'Authorization': `Bearer ${token}`,
        },
      }).done((result) => {
        if (result && result[0].successful) {
          resolve(result[0]);
        } else {
          reject('何らかのエラーが発生しました。');
        }

      }).fail((data) => {
        reject(data);
      });
    });
  };

  const showError = (message) => {
    $error.empty().text(message).fadeIn(800);
  };

  const clearError = () => {
    $error.fadeOut(800);
  };

  $error.click(clearError);

  /**
   * 再翻訳ボタンクリックイベント
   * 原文を入力部にコピーする
   * */
  $(document).on('click', '.retrans-button', (evt) => {
    $text.val($(evt.target).closest('tr').find('.original').text());
    $text.focus();
  });

  /**
   * 翻訳ボタンクリックイベント
   * */
  $translate.click(() => {

    const selected_casing = $casing.filter(':checked').val();
    const token = localStorage.getItem('token');

    if (!token) {
      showError('設定ページでTokenを設定してください。');
      return;
    }

    translate($text.val(), selected_casing, token)
      .then((data) => {

        clearError();

        localStorage.setItem('casing', selected_casing);

        mergeHistory(data);

        displayResult();
      })
      .catch(() => {
        showError('翻訳出来ませんでした。');
      });

    $text.val('');
  });

  initView();

});
