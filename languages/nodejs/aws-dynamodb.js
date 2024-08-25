const { DynamoDBClient, CreateTableCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");

// Create a DynamoDB client
const client = new DynamoDBClient({ 
  endpoint: 'http://localhost:4566',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
}
);

// Create a DynamoDBDocumentClient
const docClient = DynamoDBDocumentClient.from(client);

async function createDynamoDBTable(tableName, partitionKey, sortKey = null) {
  const params = {
    TableName: tableName,
    KeySchema: [
      { AttributeName: partitionKey, KeyType: "HASH" },
    ],
    AttributeDefinitions: [
      { AttributeName: partitionKey, AttributeType: "S" },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };

  // Add sort key if provided
  if (sortKey) {
    params.KeySchema.push({ AttributeName: sortKey, KeyType: "RANGE" });
    params.AttributeDefinitions.push({ AttributeName: sortKey, AttributeType: "S" });
  }

  try {
    const command = new CreateTableCommand(params);
    const response = await client.send(command);
    console.log("Table created successfully:", response);
    return response;
  } catch (error) {
    console.error("Error creating table:", error);
    // throw error;
  }
}
async function getItemFromDynamoDB(tableName, key) {
  const params = {
    TableName: tableName,
    Key: {
      "value2": "test",
      "value1": "test"
    },
  };

  try {
    const command = new GetCommand(params);
    const response = await docClient.send(command);
    return response.Item;
  } catch (error) {
    console.error("Error fetching item from DynamoDB:", error);
    throw error;
  }
}

// Example usage
async function example() {
  const tableName = "YourTableName";
  const key = {
    partitionKey: "value1",
    sortKey: "value2"  // If your table has a sort key
  };


  try {
    await createDynamoDBTable(tableName, key.partitionKey, key.sortKey);
    const item = await getItemFromDynamoDB(tableName, key);
    console.log("Retrieved item:", item);
  } catch (error) {
    console.error("Failed to retrieve item:", error);
  }
}

example();