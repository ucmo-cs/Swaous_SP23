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
const REPORT_TABLE = process.env.REPORT_TABLE;
const client = new DynamoDBClient();
const dynamoDb = DynamoDBDocumentClient.from(client);

module.exports.listAllReportsAdmin = async (event, context, callback) => {
    try {
        const params = {
            TableName: REPORT_TABLE
        }

        //Scan entire table
        const data = await dynamoDb.send(new ScanCommand(params));
        
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