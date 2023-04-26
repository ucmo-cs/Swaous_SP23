//Allowing retrieval of specific user reports
//Parameters needed are pulled from the URL
//Will grab specific user reports from 'reports-table-dev' DynamoDb table


//Import modules
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb");


//Declare table and DynamoDb Client
const REPORT_TABLE = process.env.REPORT_TABLE;
const client = new DynamoDBClient();
const dynamoDb = DynamoDBDocumentClient.from(client);


//Create function
module.exports.listReports = async (event, context, callback) => {
    console.log("EVENT::: Starting specified scan of " + REPORT_TABLE);


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


        //Validation check
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


        console.log("SUCCESS::: Specified reports retrieved from " + REPORT_TABLE);
        callback(null, response);
    } catch(err) {
        console.log(event.error);
        callback(null, err);
    }  
};