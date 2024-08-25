const { LambdaClient, ListFunctionsCommand } = require('@aws-sdk/client-lambda');

// Configure the AWS SDK to use the LocalStack endpoint and credentials
const lambda = new LambdaClient({
  endpoint: 'http://localhost:4566',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
});

// Call a Lambda API using the LocalStack endpoint
lambda.send(new ListFunctionsCommand({}))
  .then((data) => console.log('>>>data', data))
  .catch((error) => console.error('>>>error', error));
