/* eslint-env mocha */
/* global BOOMR_test,assert */

/*
* This app uses a ng-app directive instead of angular.bootstrap()
*/
// globals from this test
Array.prototype.push.apply(BOOMR_test.addedGlobals, ["angular", "ng339", "modules", "app", "angular_imgs", "custom_metric_1", "custom_metric_2", "custom_timer_1", "custom_timer_2"]);

describe("e2e/05-angular/03-ng-app", function() {
  var tf = BOOMR.plugins.TestFramework;
  var t = BOOMR_test;

  it("Should pass basic beacon validation", function(done) {
    t.validateBeaconWasSent(done);
  });

  it("Should have only sent one beacon", function() {
    // only one beacon should've been sent
    assert.equal(tf.beacons.length, 1);
  });

  it("Should take as long as the longest img load (if MutationObserver and NavigationTiming are supported)", function() {
    if (t.isMutationObserverSupported() && typeof BOOMR.plugins.RT.navigationStart() !== "undefined") {
      t.validateBeaconWasSentAfter(0, "img.jpg", 200, 3000, 30000, true);
    }
  });

  it("Should not have a load time (if MutationObserver is supported but NavigationTiming is not)", function() {
    if (t.isMutationObserverSupported() && typeof BOOMR.plugins.RT.navigationStart() === "undefined") {
      var b = tf.lastBeacon();

      assert.equal(b.t_done, undefined);
    }
  });

  it("Should take as long as the XHRs (if MutationObserver is not supported but NavigationTiming is)", function() {
    if (!t.isMutationObserverSupported() && typeof BOOMR.plugins.RT.navigationStart() !== "undefined") {
      t.validateBeaconWasSentAfter(0, "widgets.json", 200, 0, 30000, true);
    }
  });

  it("Shouldn't have a load time (if MutationObserver and NavigationTiming are not supported)", function() {
    if (!t.isMutationObserverSupported() && typeof BOOMR.plugins.RT.navigationStart() === "undefined") {
      var b = tf.lastBeacon();

      assert.equal(b.t_done, undefined);
      assert.equal(b["rt.start"], "none");
    }
  });

  it("Should have sent the http.initiator as 'spa_hard'", function() {
    var b = tf.lastBeacon();

    assert.equal(b["http.initiator"], "spa_hard");
  });
});
