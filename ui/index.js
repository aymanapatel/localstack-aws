const express = require('express');
const bodyParser = require('body-parser');
const pug = require('pug');
const { v4 } = require('uuid');
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');

const compression = require('compression');
const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');


const s3 = new S3Client({
  region: 'us-east-1',
  forcePathStyle: true, // If you want to use virtual host addressing of buckets, you can remove `forcePathStyle: true`.
  endpoint: 'http://s3.localhost.localstack.cloud:4566',
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
});

// Call a Lambda API using the LocalStack endpoint


const app = express();
const expressWs = require('express-ws')(app);
const PORT = process.env.PORT || 3000;

const s3Channel  = expressWs.getWss('/s3Ws');

const awsResources = [];


dayjs.extend(relativeTime);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','pug');

app.use(express.static(__dirname + '/assets'));
app.use(compression());

app.get('/', (req, res) => {
  res.render('index');
});

app.ws('/s3Ws', function(ws, req) {
  ws.on('message', async function(msg) {
    let { message, username } = JSON.parse(msg);

    const { Buckets } = await s3.send(new ListBucketsCommand({}));
    const temp = await s3.send(new ListBucketsCommand({}));
    console.log('>>>', temp)  
    message = "somethnig to do with localstack"
    username = Buckets[0].Name; 
    const resource = {
        id: v4(),
        message,
        username,
        likes: 1,
        time: Buckets[0].CreationDate,


      avatar : 'https://ui-avatars.com/api/?background=random&rounded=true&name=' + username
    };

    awsResources.push(resource);


    

    const resources  = pug.compileFile('views/components/resources.pug', { globals: ['global'] });

    // Format time 
     resource.time = dayjs().to(dayjs(resource.time));
    const markup = resources({ t: resource, s3: Buckets[0].Name });

    s3Channel.clients.forEach(function (client) {
      client.send(markup);

    });
  });
});


app.listen(PORT);
console.log('root app listening on port: 3000');
