/* eslint-env mocha */
/* global BOOMR_test,assert */

// globals from this test
Array.prototype.push.apply(BOOMR_test.addedGlobals, ["ResourceTimingDecompression", "t", "xhr1", "xhr2", "f1", "f2", "consume"]);

describe("e2e/11-restiming/04-resource-sizes", function() {
  var t = BOOMR_test;
  var tf = BOOMR.plugins.TestFramework;

  it("Should pass basic beacon validation", function(done){
    t.validateBeaconWasSent(done);
  });

  it("Should have sizes for the IMGs on the page (if ResourceTiming2 is supported)", function() {
    if (t.isResourceTimingSupported()) {
      var b = tf.beacons[0];

      var resources = ResourceTimingDecompression.decompressResources(JSON.parse(b.restiming));

      // find our 3 (w/o fetch) or 5 (w/ fetch) img entries
      var cnt = 0;

      for (var i = resources.length - 1; i >= 0; i--) {
        var img = resources[i];

        if (img.name.indexOf("assets/img.jpg") !== -1) {
          cnt += 1;

          if (img.encodedBodySize) {
            assert.equal(296341, img.encodedBodySize);
          }
        }
      }

      assert.equal(t.isFetchApiSupported() ? 5 : 3, cnt);
    }
    else {
      this.skip();
    }
  });
});
