/* setup.js */

var jsdom = require('jsdom').jsdom;
const noop = () => {};

require.extensions['.css'] = noop;
require.extensions['.ico'] = noop;
require.extensions['.png'] = noop;
require.extensions['.svg'] = noop;

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
    if (typeof global[property] === 'undefined') {
          global[property] = document.defaultView[property];
        }
});

global.navigator = {
    userAgent: 'node.js'
};
