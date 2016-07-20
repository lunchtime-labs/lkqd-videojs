# LKQD VideoJS

This JS module allows you to load an LKQD 'mobile autoplay' ad into a VideoJS
player.

## Usage

```
var Lkqd = require('lkqd-videojs');

var containerEl = document.getElementById('myContainer');
var videoEl = container.getElementsByTagName('video')[0];
var player = videojs(videoEl);

var options = {
  adTagUrl: 'http://ssp.lkqd.net/...',
  otherProperty: 'test',
  videoEl: videoEl,
  containerEl: containerEl,
  publisherId: '5'
}

new Lkqd(player, options);
```

## Testing and Development

`gulp` or `gulp test` for TDD with Karma.

Uses Karma test runner with Mocha and the Jquery-Chai expectations library,
with Sinon for mocking. Karma-Fixture for HTML fixtures.
