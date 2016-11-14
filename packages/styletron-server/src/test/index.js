const test = require('tape');
const fixtures = require('test-fixtures');

const cacheToCss = require('../cache-to-css');
const Styletron = require('../styletron-server');

class StyletronTest extends Styletron {
  constructor(...args) {
    super(...args);
  }
  setCache(cache) {
    this.cache = cache;
  }
}

test('test toCss', t => {
  t.equal(cacheToCss(fixtures.basic.cache), fixtures.basic.css);
  t.end();
});

test('test getCss method', t => {
  const instance = new StyletronTest();
  instance.setCache(fixtures.basic.cache);
  t.equal(instance.getCss(), fixtures.basic.css);
  t.end();
});

test('test getStylesheets method', t => {
  const instance = new StyletronTest();
  instance.setCache(fixtures.basic.cache);
  t.deepEqual(instance.getStylesheets(), [
    {
      css: '.s4:hover{display:none}.s0{color:red}.s1{color:green}'
    },
    {
      media: '(max-width: 800px)',
      css: '.s3:hover{color:green}.s2{color:green}'
    }
  ]);
  t.end();
});

test('test getStylesheetsHtml method', t => {
  const instance = new StyletronTest();
  instance.setCache(fixtures.basic.cache);
  t.equal(instance.getStylesheetsHtml(), '<style class="_styletron_hydrate_">.s4:hover{display:none}.s0{color:red}.s1{color:green}</style><style class="_styletron_hydrate_" media="(max-width: 800px)">.s3:hover{color:green}.s2{color:green}</style>');
  t.end();
});

test('test getStylesheetsOldIE method', t => {
  const instance = new StyletronTest();
  for (let i = 0; i <= 4095; i++) {
    instance.injectDeclaration({prop: 'font-size', val: `${i}px`});
  }
  t.equal(instance.getStylesheetsOldIE().length, 1, 'only one sheet');
  instance.injectDeclaration({prop: 'color', val: 'red'});
  t.equal(instance.getStylesheetsOldIE().length, 2, 'rollover into another sheet');
  for (let i = 0; i <= 4095; i++) {
    instance.injectDeclaration({prop: 'font-size', val: `${i}px`, media: '(max-width: 400px)'});
  }
  t.equal(instance.getStylesheetsOldIE().length, 3, 'media sheet');
  instance.injectDeclaration({prop: 'color', val: 'red', media: '(max-width: 400px)'});
  t.equal(instance.getStylesheetsOldIE().length, 4, 'media sheet rollover');
  t.end();
});
