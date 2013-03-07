define([
	'dojo-ts/_base/array',
	'dojo-ts/aspect',
	'../../main',
	'../Suite',
	'../Test'
], function (array, aspect, main, Suite, Test) {
	function registerSuite(descriptor, parentSuite) {
		var suite = new Suite({ parent: parentSuite }),
			tests = suite.tests,
			test,
			k;

		parentSuite.tests.push(suite);

		for (k in descriptor) {
			test = descriptor[k];

			if (k === 'before') {
				k = 'setup';
			}
			if (k === 'after') {
				k = 'teardown';
			}

			switch (k) {
			case 'name':
				suite.name = test;
				break;
			case 'setup':
			case 'beforeEach':
			case 'afterEach':
			case 'teardown':
				aspect.after(suite, k, test);
				break;
			default:
				if (typeof test !== 'function') {
					// use the property name as the test name if none exists
					test.name = test.name || k;
					tests.push(registerSuite(test, suite));
				}
				else {
					tests.push(new Test({ name: k, test: test, parent: suite }));
				}
			}
		}

		return suite;
	}

	return function createSuite(descriptor) {
		array.forEach(main.suites, function (suite) {
			registerSuite(descriptor, suite);
		});
	};
});
