//Allowing deletion of reports
//Parameters needed are pulled from URL
//Will delete specified report from 'reports-table-dev' DynamoDb table


//Import modules
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, DeleteCommand } = require("@aws-sdk/lib-dynamodb");


//Declare table and DynamoDb Client
const REPORT_TABLE = process.env.REPORT_TABLE;
const client = new DynamoDBClient();
const dynamoDb = DynamoDBDocumentClient.from(client);


//Create function
module.exports.deleteReportAdmin = async (event, context, callback) => {
    console.log("EVENT::: Starting deletion of report from " + REPORT_TABLE);


    //Declare parameters of report to be deleted
    const params = {
        TableName: REPORT_TABLE,
        Key: {
            empId: event.pathParameters.empid,
            reportId: event.pathParameters.reportid
        }
    }
    console.log("EVENT::: Report ID grabbed", event.pathParameters.reportid);


    try {
        //Delete report from table
        await dynamoDb.send(new DeleteCommand(params));

        
        //Response sent to API Gateway
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


        console.log("SUCCESS::: Report successfully deleted from " + REPORT_TABLE);
        callback(null, response);
    } catch(err) {
        console.log(event.error);
        callback(null,err);
    }
};