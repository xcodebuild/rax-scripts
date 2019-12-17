const babel = require('@babel/core');
const { getBabelConfig } = require('rax-compile-config');

const babelConfig = getBabelConfig();

module.exports = function() {

  const source = `
    import { render, createElement } from 'rax';
    import Component from '${this.resourcePath}';
    import DriverUniversal from 'driver-universal';

    const comProps = {};

    function Entry() {
      return createElement(Component, comProps);
    }

    export default async function createApp() {
      // process App.getInitialProps
      if (Component.getInitialProps) {
        Object.assign(comProps, await Component.getInitialProps());
      }
      render(createElement(Entry), null, { driver: DriverUniversal });
    }
  `;

  const { code } = babel.transformSync(source, babelConfig);

  return code;
};