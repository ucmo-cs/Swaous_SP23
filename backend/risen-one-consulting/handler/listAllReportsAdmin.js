//Allowing scan of ALL reports
//Parameters needed are name of table
//Will grab every item from 'reports-table-dev' DynamoDb table


//Import modules
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");


//Declare table and DynamoDb Client
const REPORT_TABLE = process.env.REPORT_TABLE;
const client = new DynamoDBClient();
const dynamoDb = DynamoDBDocumentClient.from(client);


//Create function
module.exports.listAllReportsAdmin = async (event, context, callback) => {
    console.log("EVENT::: Starting scan of all items in " + REPORT_TABLE);


    try {
        //Declare parameters of table to be scanned
        const params = {
            TableName: REPORT_TABLE
        }
        console.log("EVENT::: Table parameters grabbed", REPORT_TABLE);


        //Scan entire table
        const data = await dynamoDb.send(new ScanCommand(params));
        if(!data) {
            console.error("Error: Table does not exist");
            callback(new Error(error));
            return;
        }
        console.log("EVENT::: Table scanned", REPORT_TABLE);
        
        
        //Response sent to API Gateway
        const response = {
            isBase64Encoded: false,
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data)
        }


        console.log("SUCCESS::: All reports read in " + REPORT_TABLE);
        callback(null, response);
    } catch(err) {
        console.log(event.error);
        callback(null, err);
    }  
};