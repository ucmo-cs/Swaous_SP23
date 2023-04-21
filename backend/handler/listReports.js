//Gets reports for user from user ID in web address

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

module.exports.listReports = async (event, context, callback) => {
    try {
        //Scan entire table and pull only user's information
        const data = await dynamoDb.send(new QueryCommand({
            TableName: REPORT_TABLE,
            KeyConditionExpression: "#empId = :empId",
            ExpressionAttributeNames: {
                "#empId": "empId"
            },
            ExpressionAttributeValues: {
                ":empId": event.pathParameters.empid
            }
        }));
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