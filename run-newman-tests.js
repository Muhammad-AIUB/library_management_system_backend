const newman = require('newman');
const path = require('path');

/**
 * Run API tests using Newman CLI
 * This script will execute the Postman collection with the environment
 * and generate a detailed HTML report
 */
function runTests() {
  console.log('🚀 Running API tests with Newman...');
  
  // Define collection and environment paths
  const collectionPath = path.join(__dirname, 'postman', 'Library_Management_System.postman_collection.json');
  const environmentPath = path.join(__dirname, 'postman', 'environment.json');
  const reportDir = path.join(__dirname, 'newman-reports');

  // Run Newman with the collection and environment
  newman.run({
    collection: require(collectionPath),
    environment: require(environmentPath),
    reporters: ['cli', 'htmlextra'],
    reporter: {
      htmlextra: {
        export: path.join(reportDir, `report-${new Date().toISOString().split('T')[0]}.html`),
        title: 'Library Management System API Test Report',
        browserTitle: 'LMS API Tests',
        titleSize: 4,
        omitHeaders: true,
        skipSensitiveData: true,
        showEnvironmentData: true,
        skipFolders: [],
        skipRequests: [],
        showGlobalData: true,
        skipGlobalVars: [],
        omitRequestBodies: false,
        omitResponseBodies: false,
        hideRequestBody: ['login', 'register'],
        hideResponseBody: [],
        showMarkdownLinks: true,
        showFolderDescription: true,
        timezone: 'UTC'
      }
    }
  }, function (err, summary) {
    if (err) { 
      console.error('❌ Newman run failed: ' + err);
      process.exit(1);
    }
    
    // Log test run summary
    console.log('✅ Newman run completed!');
    console.log(`📊 Total Requests: ${summary.run.stats.requests.total}`);
    console.log(`✅ Passed Tests: ${summary.run.stats.assertions.total - summary.run.stats.assertions.failed}`);
    console.log(`❌ Failed Tests: ${summary.run.stats.assertions.failed}`);
    
    if (summary.run.failures.length > 0) {
      console.log('\n❌ Test Failures:');
      summary.run.failures.forEach((failure, index) => {
        console.log(`  ${index + 1}. ${failure.error.message}`);
        console.log(`     Request: ${failure.source.name}`);
      });
      process.exit(1);
    } else {
      console.log('\n🎉 All tests passed!');
    }
  });
}

// Run the tests
runTests(); 