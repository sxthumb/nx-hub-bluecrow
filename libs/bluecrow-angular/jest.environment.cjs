const { JSDOM } = require('jsdom');

const { JSDOM } = require('jsdom');

module.exports = class JestJSDOMEnvironment {
  constructor() {
    const dom = new JSDOM('<!doctype html><html><body></body></html>', {
      url: 'http://localhost',
      pretendToBeVisual: true,
    });

    const windowObject = dom.window;
    const globalObject = Object.create(null);

    globalObject.window = windowObject;
    globalObject.document = windowObject.document;
    globalObject.navigator = windowObject.navigator;
    globalObject.Node = windowObject.Node;
    globalObject.HTMLElement = windowObject.HTMLElement;
    globalObject.HTMLButtonElement = windowObject.HTMLButtonElement;
    globalObject.MouseEvent = windowObject.MouseEvent;
    globalObject.KeyboardEvent = windowObject.KeyboardEvent;
    globalObject.PointerEvent = windowObject.PointerEvent;
    globalObject.getComputedStyle = windowObject.getComputedStyle.bind(windowObject);
    globalObject.requestAnimationFrame = (callback) => setTimeout(callback, 0);
    globalObject.cancelAnimationFrame = (id) => clearTimeout(id);
    globalObject.crypto = require('crypto').webcrypto;

    this.global = globalObject;
  }

  getVmContext() {
    return this.global;
  }
};
