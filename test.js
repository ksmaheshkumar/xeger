var rekt = require('./rekt');
var assert = require('assert');

describe('rekt', function () {
  it('parses hello literal', function () {
    var regex = rekt(function (r) {
      r.literal('hello');
    });
    assert.equal(regex.toString(), '/hello/');
    assert.equal(regex.exec('hello')[0], 'hello');
  });

  describe('more complex', function () {
    var regex = rekt(function (r) {
      r.literal('he');
      r.literal('l', { multiple: true });
      r.literal('o?');
      r.literal('!', { optional: true });
      r.notSet('$%');
    });

    it('does not care about number of lllll', function () {
      assert.equal(regex.toString(), '/hel+o\\?\\!?/');
      assert.equal(regex.exec('hellllo?')[0], 'hellllo?');
      assert.equal(regex.exec('heo'), null);
    });

    it('handles options', function () {
      assert.equal(regex.exec('helo?')[0], 'helo?');
      assert.equal(regex.exec('helo?!')[0], 'helo?!');
      assert.equal(regex.exec('helo?!!')[0], 'helo?!');
    });

    it('supports notSets', function () {

    });
  });

  it.skip('parses a url', function () {
    var regex = rekt(function (r) {
      r.group(function (r) {
        r.literal('http');
        r.literal('s', { optional: true });
      });
      r.literal('://');
      r.group(function (r) {
        r.notSet('/', { multiple: true });
      });
      r.group(function (r) {
        r.any({ multiple: true });
      });
      r.literal('?');
      r.group(function (r) {
        r.any({ multiple: true, optional: true });
      });
    });

    assert(regex.toString() === '/(https?):\\/\\/([^\\/]+)(.+)\\?(.*)/');

    var parsed = regex.exec('https://www.google.com/search?q=my_search');
    assert(parsed[0] === 'https://www.google.com/search?q=my_search');
    assert(parsed[1] === 'https');
    assert(parsed[2] === 'www.google.com');
    assert(parsed[3] === '/search');
    assert(parsed[4] === 'q=my_search');
  });
});
