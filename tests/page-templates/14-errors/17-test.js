/* eslint-env mocha */
/* global BOOMR_test,assert */

// globals from this test
Array.prototype.push.apply(BOOMR_test.addedGlobals, ["JSON3", "errorFunction", "goodFunction", "errorFunctionThrown", "foo", "result", "testResult1", "testResult2", "testResult3", "result4", "testResult4"]);

describe("e2e/14-errors/17-test", function() {
  var tf = BOOMR.plugins.TestFramework;
  var t = BOOMR_test;
  var C = BOOMR.utils.Compression;

  it("Should have sent a single beacon validation", function(done) {
    t.validateBeaconWasSent(done);
  });

  it("Should have put the err on the beacon", function() {
    var b = tf.lastBeacon();

    assert.isDefined(b.err);
  });

  it("Should have had a single error", function() {
    var b = tf.lastBeacon();

    assert.equal(C.jsUrlDecompress(b.err).length, 1);
  });

  it("Should have count = 1", function() {
    var b = tf.lastBeacon();
    var err = BOOMR.plugins.Errors.decompressErrors(C.jsUrlDecompress(b.err))[0];

    assert.equal(err.count, 1);
  });

  it("Should have fileName of the page (if set)", function() {
    var b = tf.lastBeacon();
    var err = BOOMR.plugins.Errors.decompressErrors(C.jsUrlDecompress(b.err))[0];

    if (err.fileName) {
      assert.include(err.fileName, window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1));
    }
    else {
      return this.skip();
    }
  });

  it("Should have functionName of 'errorFunction'", function() {
    var b = tf.lastBeacon();
    var err = BOOMR.plugins.Errors.decompressErrors(C.jsUrlDecompress(b.err))[0];

    if (err.functionName) {
      assert.include(err.functionName, "errorFunction");
    }
    else {
      return this.skip();
    }
  });

  it("Should have message = 'a is not defined' or 'Can't find variable: a' or ''a' is undefined'", function() {
    var b = tf.lastBeacon();
    var err = BOOMR.plugins.Errors.decompressErrors(C.jsUrlDecompress(b.err))[0];

    // Skip for IE6
    if (err.message === "[object Error]") {
      return this.skip();
    }

    // Chrome, Firefox == a is not defined, Safari = Can't find variable, Edge = 'a' is not defined
    assert.isTrue(
      err.message.indexOf("a is not defined") !== -1 ||
      err.message.indexOf("Can't find variable: a") !== -1 ||
      err.message.indexOf("'a' is undefined") !== -1 ||
      err.message.indexOf("'a' is not defined") !== -1);
  });

  it("Should have source = APP", function() {
    var b = tf.lastBeacon();
    var err = BOOMR.plugins.Errors.decompressErrors(C.jsUrlDecompress(b.err))[0];

    assert.equal(err.source, BOOMR.plugins.Errors.SOURCE_APP);
  });

  it("Should have stack with the stack", function() {
    var b = tf.lastBeacon();
    var err = BOOMR.plugins.Errors.decompressErrors(C.jsUrlDecompress(b.err))[0];

    assert.isDefined(err.stack);
  });

  it("Should have not have BOOMR_plugins_errors_wrap on the stack", function() {
    var b = tf.lastBeacon();
    var err = BOOMR.plugins.Errors.decompressErrors(C.jsUrlDecompress(b.err))[0];

    assert.notInclude(err.stack, "BOOMR_plugins_errors_wrap");
  });

  it("Should have type = 'ReferenceError' or 'Error'", function() {
    var b = tf.lastBeacon();
    var err = BOOMR.plugins.Errors.decompressErrors(C.jsUrlDecompress(b.err))[0];

    assert.isTrue(err.type === "ReferenceError" || err.type === "Error");
  });

  it("Should have via = APP", function() {
    var b = tf.lastBeacon();
    var err = BOOMR.plugins.Errors.decompressErrors(C.jsUrlDecompress(b.err))[0];

    assert.equal(err.via, BOOMR.plugins.Errors.VIA_APP);
  });

  it("Should have columNumber to be a number if specified", function() {
    var b = tf.lastBeacon();
    var err = BOOMR.plugins.Errors.decompressErrors(C.jsUrlDecompress(b.err))[0];

    if (typeof err.columnNumber !== "undefined") {
      assert.isTrue(err.columnNumber >= 0);
    }
    else {
      return this.skip();
    }
  });

  it("Should have lineNumber ~ " + (HEADER_LINES + 4), function() {
    var b = tf.lastBeacon();
    var err = BOOMR.plugins.Errors.decompressErrors(C.jsUrlDecompress(b.err))[0];

    if (err.lineNumber) {
      assert.closeTo(err.lineNumber, HEADER_LINES + 4, 5);
    }
    else {
      return this.skip();
    }
  });

  it("Should have thrown an exception for errorFunction", function() {
    assert.isDefined(window.errorFunctionThrown);
    assert.isTrue(window.errorFunctionThrown.reported);
  });

  it("Should have saved the result of the good function in testResult1", function() {
    assert.equal(window.testResult1, 2);
    assert.equal(window.result, 2);
  });

  it("Should have saved the result of the good function in testResult2", function() {
    assert.equal(window.testResult2, 2);
    assert.equal(window.foo.result, 2);
  });

  it("Should have saved the result of the good function in testResult3", function() {
    assert.equal(window.testResult3, 3);
    assert.equal(window.foo.result3, 3);
  });

  it("Should have saved the result of the good function in testResult4", function() {
    assert.equal(window.testResult4, 4);
    assert.equal(window.result4, 4);
  });
});
