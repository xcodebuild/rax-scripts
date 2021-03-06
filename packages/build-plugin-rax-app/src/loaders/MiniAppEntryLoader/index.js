const babel = require('@babel/core');
const { getBabelConfig } = require('rax-compile-config');
const { getOptions } = require('loader-utils');


const babelConfig = getBabelConfig();

module.exports = function() {
  const { routes = [] } = getOptions(this);
  const resourcePath = this.resourcePath.replace(/\\/g, '/'); // Avoid path error in Windows
  const source = `
    import { render, createElement } from 'rax';
    import Component from '${resourcePath}';
    import DriverUniversal from 'driver-universal';
    import { createMiniAppHistory } from 'miniapp-history';

    const history = createMiniAppHistory(${JSON.stringify(routes)});
    const comProps = {
      history,
      location: history.location,
      ...window.__pageProps
    };

    window.addEventListener('pageLoad', (query) => {
      history.location.__updatePageOption(query);
    });

    function Entry() {
      return createElement(Component, comProps);
    }

    export default function createApp() {
      render(createElement(Entry), null, { driver: DriverUniversal });
    }
  `;

  const { code } = babel.transformSync(source, babelConfig);

  return code;
};
