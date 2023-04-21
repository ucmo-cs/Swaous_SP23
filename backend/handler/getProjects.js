//Gets ALL reports for admins

//Import modules
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
  QueryCommand,
  DeleteCommand
} = require("@aws-sdk/lib-dynamodb");

//Declare table and DynamoDb Client
const PROJECT_TABLE = process.env.PROJECT_TABLE;
const client = new DynamoDBClient();
const dynamoDb = DynamoDBDocumentClient.from(client);

module.exports.getProjects = async (event, context, callback) => {
    try {
        const params = {
            TableName: PROJECT_TABLE
        }

        //Scan entire table
        const data = await dynamoDb.send(new ScanCommand(params));
        if(!data) {
            console.error("Error: Table does not exist");
            callback(new Error(error));
            return;
        }
        
        //Response with fields
        const response = {
            isBase64Encoded: false,
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data)
        }

        callback(null, response);
    } catch(err) {
        callback(null, err);
    }  
};