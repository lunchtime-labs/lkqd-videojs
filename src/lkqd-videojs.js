var _merge = require("lodash/merge");
var iframeId = new Date().getTime().toString() + Math.round(Math.random() * 1000000000).toString();

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

    var event = new CustomEvent('lkqd-detected', {
      bubbles: true,
      detail: iframeId
    });

    this.options.videoEl.dispatchEvent(event);

    this._create();
  }

  LkqdVideoJS.prototype._create = function() {
    this.iframe = document.createElement('iframe');
    this.iframe.id = iframeId;
    this.iframe.name = iframeId;
    this.iframe.style.display = 'none';

    this.iframe.onload = this._onIframeLoaded.bind(this);

    document.body.appendChild(this.iframe);
  };

  LkqdVideoJS.prototype._onIframeLoaded = function() {
    var vpaidLoaderScript = this.iframe.contentWindow.document.createElement('script');
    vpaidLoaderScript.src = 'https://ad.lkqd.net/vpaid/formats.js?pid=21&sid=71907'

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
    this.vpaidClient.subscribe(this._onAdError.bind(this), 'AdError');

    this.vpaidClient.initAd(
      this.options.playerWidth,
      this.options.playerHeight,
      this.options.viewMode,
      600,  // @TODO: what is this?
      this.options.creativeData,
      {
        slot: document.getElementById(this.options.containerEl.id),
        videoSlot: this.options.videoEl,
        videoSlotCanAutoPlay: false,
        lkqdSettings: {
          pid: 21,
          sid: 71907,
          playerContainerId: this.options.containerEl.id,
          playerId: this.options.videoEl.id,
          playerWidth: this.options.playerWidth,
          playerHeight: this.options.playerHeight,
          execution: 'inbanner',
          placement: '',
          playInitiation: 'auto',
          controls: false,
          volume: 100,
          pageUrl: 'http://demo.lkqd.com',
          trackImp: '',
          trackClick: '',
          custom1: '',
          custom2: '',
          custom3: '',
          pubMacros: '',
          dfp: false,
          lkqdId: iframeId,
          supplyContentVideo: {
            url: '', clickUrl: '', play: 'post', volume: 100, loop: false
          }
        }
    });
  };

  LkqdVideoJS.prototype._onAdLoaded = function () {
    var _this = this;

    _this.options.videoEl.style.display = "none"

    _this.vpaidClient.startAd();

    var event = new CustomEvent('lkqd-ad-loaded', {
      bubbles: true,
      detail: {
        iframeId
      }
    });

    this.options.videoEl.dispatchEvent(event);
  };

  LkqdVideoJS.prototype._onAdError = function() {
    debugger
  }

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
