'use strict';

var common = common || {};
common.loadThemeCss = (theme) => {
  $("#theme").remove();
  const theme_tag = `
    <link id="theme"
          rel="stylesheet"
          type="text/css"
          href="css/bootstrap-solarized-${theme}.css"
          media="all"/>
  `;
  $('head').append(theme_tag);
};


