define([ 'dojo-ts/topic' ], function (topic) {
	var hasGrouping = 'group' in console && 'groupEnd' in console;

	hasGrouping && topic.subscribe('/suite/start', function (suite) {
		console.group(suite.name);
	});

	topic.subscribe('/suite/end', function (suite) {
		var numTests = suite.get('numTests'),
			numFailedTests = suite.get('numFailedTests');

		console[numFailedTests ? 'warn' : 'info'](numTests - numFailedTests + '/' + numTests + ' tests passed');
		hasGrouping && console.groupEnd(suite.name);
	});

	topic.subscribe('/test/pass', function (test) {
		console.log('PASS: ' + (hasGrouping ? test.name : test.get('id')) + ' (' + test.timeElapsed + 'ms)');
	});

	topic.subscribe('/test/fail', function (test) {
		console.error('FAIL: ' + (hasGrouping ? test.name : test.get('id')) + ' (' + test.timeElapsed + 'ms)');
		console.error(test.error.message);
		console.error(test.error.stack);
	});
});
