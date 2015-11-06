var dsTestCases = require('mesh-ds-bus-test-cases');

console.log(dsTestCases);

dsTestCases.forEach(function(tc) {
    it(tc.description, tc.run);
});
