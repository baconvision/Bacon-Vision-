const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync('App.tsx', 'utf8');
const start = source.indexOf('export function allowAppNavigation');
const end = source.indexOf('export default function', start);
assert.ok(start >= 0 && end > start, 'navigation guard must exist');
const context = { exports: {} };
vm.runInNewContext(ts.transpileModule(source.slice(start,end), {
  compilerOptions: { module: ts.ModuleKind.CommonJS }
}).outputText, context);
const allow = context.exports.allowAppNavigation;
const accepted = [
  'https://bcnvzn.com', 'https://bcnvzn.com/buy-credits',
  'https://js.stripe.com/v3/', 'https://hooks.stripe.com/',
  'https://checkout.stripe.com/', 'https://api.stripe.com/',
  'about:blank', 'blob:https://bcnvzn.com/abc',
];
const rejected = [
  'https://bcnvzn.com.evil.test', 'https://bcnvzn.com@evil.test',
  'http://js.stripe.com', 'https://stripe.com.evil.test',
  'https://js.stripe.com@evil.test', 'javascript:alert(1)',
  'https://evil.test', 'https://bcnvzn.com:444/',
  'https://bcnvzn.com%2eevil.test', 'file:///etc/passwd',
];
for (const url of accepted) assert.equal(allow(url), true, url);
for (const url of rejected) assert.equal(allow(url), false, url);
const app = JSON.parse(fs.readFileSync('app.json','utf8')).expo;
assert.equal(app.ios.buildNumber, '3');
for (const path of [app.icon, app.splash.image, app.android.adaptiveIcon.foregroundImage]) {
  assert.ok(fs.statSync(path).size > 0, path);
}
assert.equal(ts.transpileModule(source, {
  compilerOptions:{jsx:ts.JsxEmit.ReactJSX},reportDiagnostics:true
}).diagnostics.length, 0, 'App.tsx must parse');
console.log('18 navigation cases, build number, assets and App syntax passed');

