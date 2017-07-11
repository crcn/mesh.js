const { writeFileSync } = require('fs');
const { join } = require('path');
const docdown = require('docdown');
const version = require('../package').version;
const repoVersion = require('../../../package').version;

const BASE_PATH = join(__dirname, '..');

function postprocess(md) {
  return md.replace(/\[&#x24C8;\]\((.*?) \"View in source"\) \[&#x24C9;\]\[1\]/g, "\n[View in source]($1)");
}

const md = postprocess(docdown({
  'path': join(BASE_PATH, 'lib', 'bundle.js'),
  'title': `<a href="https://mesh.js.com/">Mesh</a> <span>v${ version }</span>`,
  'toc': 'categories',
  'url': `https://github.com/crcn/mesh.js/blob/${ repoVersion }/packages/mesh/lib/bundle.js`
}));

writeFileSync(join(BASE_PATH, 'docs', 'api.md'), md);


