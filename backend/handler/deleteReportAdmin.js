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

module.exports.deleteReportAdmin = async (event, context, callback) => {
    const params = {
        TableName: REPORT_TABLE,
        Key: {
            empId: event.pathParameters.empid,
            reportId: event.pathParameters.reportid
        }
    }

    try {
        await dynamoDb.send(new DeleteCommand(params));

        const response = {
            isBase64Encoded: false,
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                message: "Report Deletion Complete."
            })
        }

        callback(null, response);
    } catch(err) {
        callback(null,err);
    }
};