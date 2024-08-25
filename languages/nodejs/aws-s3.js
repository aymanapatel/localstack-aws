const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');

// By default, @aws-sdk/client-s3 will using virtual host addressing:
// -> http://<bucket-name>.s3.localhost.localstack.cloud:4566/<key-name>
// To allow those requests to be directed to LocalStack, you need to set a specific endpoint.
// If this is not possible, you can set the special S3 configuration flag to use path
// addressing instead:
// -> http://s3.localhost.localstack.cloud:4566/<bucket-name>/<key-name>
// You can read the S3 documentation to learn more about the different endpoints.

const s3 = new S3Client({
  region: 'us-east-1',
  forcePathStyle: true, // If you want to use virtual host addressing of buckets, you can remove `forcePathStyle: true`.
  endpoint: 'http://s3.localhost.localstack.cloud:4566',
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
});

// Call an S3 API using the LocalStack endpoint
s3.send(new ListBucketsCommand({}))
  .then((data) => console.log(data))
  .catch((error) => console.error(error));