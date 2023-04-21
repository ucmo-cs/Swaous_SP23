//Function will get singular report for user from user ID and report ID in web address

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

module.exports.getReport = async (event, context, callback) => {
    const params = {
        TableName: REPORT_TABLE,
        Key: {
            empId: event.pathParameters.empid,
            reportId: event.pathParameters.reportid
        }
    }

    try {
        const data = await dynamoDb.send(new GetCommand(params));
        if(!data) {
            console.error(Error);
            return;
        }

        const response = data.Item
        ? {
            isBase64Encoded: false,
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data.Item)
        } : {
            isBase64Encoded: false,
            statusCode: 404,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                message: "Report Not Found"
            })
        }

        callback(null,response);
    } catch(err) {
        callback(null, err);
    }
};