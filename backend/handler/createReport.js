//Allows user to create report

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
const uuid = require("uuid");

//Declare table and DynamoDb Client
const REPORT_TABLE = process.env.REPORT_TABLE;
const client = new DynamoDBClient();
const dynamoDb = DynamoDBDocumentClient.from(client);

//Created function
module.exports.createReport = async (event, context, callback) => {
    //Body grabbed from JSON event
    const { empName, email, reportText, projects, submittedAt } = JSON.parse(event.body);
    if(typeof empName !== "string" || typeof reportText !== "string") {
        console.error("Validation Failed");
        return;
    }

    //Create parameters for the table
    const params = {
        TableName: REPORT_TABLE,
        Item: {
            empId: event.pathParameters.empid,
            reportId: uuid.v4(),
            empName: empName,
            email: email,
            reportText: reportText,
            projects: projects,
            submittedAt: submittedAt,
            reportStatus: true
        }
    }

    try {
        //Put parameters into DynamoDB table
        await dynamoDb.send(new PutCommand(params));

        //Response with fields
        const response = {
            isBase64Encoded: false,
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(reportText)
        }

        callback(null, response);
    } catch(err) {
        callback(null, err);
    }
};