var LkqdVideoJS = require('../src/lkqd-videojs');

describe('LkqdVideoJS', function() {
  before(function() {
    var fakePlayer = {
      play: function() {},
      pause: function() {}
    };

    var options = {
      adTagUrl: 'url?pid=1&sid=2&env=3&format=4',
      otherProperty: 'test',
      publisherId: '5'
    };

    this.lkqdVideoJS = new LkqdVideoJS(fakePlayer, options);
  });

  it("creates an iframe", function() {
    expect($('iframe')).to.exist
  });

  it("merges in values from the options array", function () {
    var expectedOptions = {
      adTagUrl: 'url?pid=1&sid=2&env=3&format=4',
      videoEl: { dispatchEvent: function() {} },
      containerEl: '',
      isDebug: false,
      playerWidth: '',
      playerHeight: '',
      viewMode: 'normal',
      creativeData: '',
      otherProperty: 'test',
      pid: '1',
      sid: '2',
      env: '3',
      format: '4',
      publisherId: '5'
    };

    expect(this.lkqdVideoJS.options).to.deep.equal(expectedOptions);
  });

  xit("onload of the iframe, creates a vpaid loader script", function() {});

  xit("onload of the vpaid loader script, creates a vpaidClient", function() {});

  xit("calls vpaidClient.initAd ", function() {});

  xit("binds listeners to AdLoaded", function () {});

  xit("binds listeners to AdStopped", function () {});

});
