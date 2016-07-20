var _merge = require("lodash/merge");

var LkqdVideoJS = (function() {
  function LkqdVideoJS(player, options) {
    this.player = player;

    var defaults = {
      adTagUrl: '',
      videoEl: '',
      containerEl: '',
      isDebug: false,
      playerWidth: '',
      playerHeight: '',
      viewMode: 'normal',
      creativeData: '',
      publisherId: ''
    };

    this.options = _merge(defaults, options);
    this.options = _merge(this.options, this._adTagParams());

    this._create();
  }

  LkqdVideoJS.prototype._create = function() {
    var iframeId = new Date().getTime().toString() +
      Math.round(Math.random() * 1000000000).toString();

    this.iframe = document.createElement('iframe');
    this.iframe.id = iframeId;
    this.iframe.name = iframeId;
    this.iframe.style.display = 'none';

    this.iframe.onload = this._onIframeLoaded.bind(this);

    document.body.appendChild(this.iframe);
  };

  LkqdVideoJS.prototype._onIframeLoaded = function() {
    var vpaidLoaderScript = this.iframe.contentWindow.document.createElement('script');
    vpaidLoaderScript.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') +
      '//ad.lkqd.net/serve/pure.js' +
      '?format=' + this.options.format +
      '&vpaid=true' +
      '&apt=auto' +
      '&ear=100' +
      '&pid=' + this.options.pid +
      '&sid=' + this.options.sid +
      '&env=' + this.options.env +
      '&tagqa=' + this.options.isDebug.toString() +
      '&elementid=' + encodeURIComponent(this.options.videoEl.id) +
      '&containerid=' + encodeURIComponent(this.options.containerEl.id) +
      '&width=' + this.options.playerWidth +
      '&height=' + this.options.playerHeight +
      '&mode=' + this.options.viewMode +
      '&c1=' + this.options.publisherId +
      '&rnd=' + Math.floor(Math.random() * 100000000);

    vpaidLoaderScript.onload = this._onVpaidLoaded.bind(this);

    this.iframe.contentWindow.document.body.appendChild(vpaidLoaderScript);
  };

  LkqdVideoJS.prototype._onVpaidLoaded = function() {
    var _this = this;

    var event = new CustomEvent('lkqd-vpaid-loaded', {
      bubbles: true,
      detail: _this
    });

    this.options.videoEl.dispatchEvent(event);

    this.vpaidClient = this.iframe.contentWindow.getVPAIDAd();
    this.vpaidClient.handshakeVersion('2.0');

    // VPAID event handlers
    this.vpaidClient.subscribe(this._onAdLoaded.bind(this), 'AdLoaded');
    this.vpaidClient.subscribe(this._onAdStopped.bind(this), 'AdStopped');

    this.vpaidClient.initAd(
      this.options.playerWidth,
      this.options.playerHeight,
      this.options.viewMode,
      600,  // @TODO: what is this?
      this.options.creativeData,
      {
        slot: document.getElementById(this.options.containerEl.id),
        videoSlot: document.getElementById(this.options.videoEl.id),
        videoSlotCanAutoPlay: true
    });
  };

  LkqdVideoJS.prototype._onAdLoaded = function () {
    var _this = this;

    var event = new CustomEvent('lkqd-ad-loaded', {
      bubbles: true,
      detail: _this
    });

    this.options.videoEl.dispatchEvent(event);
  };

  LkqdVideoJS.prototype._onAdStopped = function() {
    var _this = this;

    var event = new CustomEvent('lkqd-ad-stopped', {
      bubbles: true,
      detail: _this
    });

    this.options.videoEl.dispatchEvent(event);
  };

  LkqdVideoJS.prototype._adTagParams = function() {
    var result = {};

    var queryString = this.options.adTagUrl.split('?');
    if (queryString.length <= 1) {
      return
    }

    queryString[1].split('&').forEach(function(param) {
      var pair = param.split('=');
      var name = pair[0];
      var value = decodeURIComponent(pair[1]);

      result[name] = value;
    });

    return result;
  };

  return LkqdVideoJS;
})();

module.exports = LkqdVideoJS;
