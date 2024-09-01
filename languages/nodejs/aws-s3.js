const { S3Client, ListBucketsCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl  } = require("@aws-sdk/s3-request-presigner");
// By default, @aws-sdk/client-s3 will using virtual host addressing:
// -> http://<bucket-name>.s3.localhost.localstack.cloud:4566/<key-name>
// To allow those requests to be directed to LocalStack, you need to set a specific endpoint.
// If this is not possible, you can set the special S3 configuration flag to use path
// addressing instead:
// -> http://s3.localhost.localstack.cloud:4566/<bucket-name>/<key-name>
// You can read the S3 documentation to learn more about the different endpoints.

const s3Client = new S3Client({
  region: 'us-east-1',
  forcePathStyle: true, // If you want to use virtual host addressing of buckets, you can remove `forcePathStyle: true`.
  endpoint: 'http://s3.localhost.localstack.cloud:4566',
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
});

const bucketName = 'ayman-bucket'
const fileName = 'output.txt'


// This is not working with S3 Byte Range Query.
// TODO: Check if Bug with JS SDK or with S3 Limitation
const responseDataFromSignedUrl = async (command) => {

  console.log('--- S3 Byte Range with Presigned')
  // Approach 1
  const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
  });

  console.log('---- Approach 1: Naive')
  const response = await fetch(signedUrl);
  response.text().then(ans => {
  console.log(ans)
  })

  // Appraoch 2: Presign S3 Byte Range in `fetch` (FROM GITHUB)
    const url = await getSignedUrl(s3Client, new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Range: "0-1"
  }));
  
  
  
  const responseGithub = await fetch(url, {
      method: 'GET',
      headers: {
          "range": "0-1"
      }
  });
  console.log('---- Approach 2: Fetch also having Range')
  console.log(responseGithub.status)
  console.log(await responseGithub.text())

}


(async () => {
  console.log('----')
  let bucketCommandResponse
  await s3Client.send(new ListBucketsCommand({}))
  .then((data) => bucketCommandResponse = data)
  .catch((error) => console.error(error));
  const bucketName = bucketCommandResponse.Buckets[0].Name
  console.log('Bucket Response:', bucketName)


  const params = {
    Bucket: bucketName,
    Key: fileName,
    Range: 'bytes=0-1'
  }
  const command = new GetObjectCommand(params);


  // responseDataFromSignedUrl(command)



  console.log('--- S3 Byte Range without Presigned')
  try {
    const response = await s3Client.send(command);
    // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
    const str = await response.Body.transformToString();
    console.log(str);
  } catch (err) {
    console.error(err);
  }





})();

