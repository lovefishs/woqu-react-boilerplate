const jsdom = require('jsdom')
const { JSDOM } = jsdom

if (typeof document === 'undefined') {
  const dom = new JSDOM('<!doctype html><html><body></body></html>')

  global.document = dom.window.document
  // Object.assign(global, dom)
  // global.window = document.defaultView
  // global.navigator = global.window.navigator
  // global.sessionStorage = {}
  // console.log(global.document)
}
