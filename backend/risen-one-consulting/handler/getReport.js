//Allowing retrieval of singular report
//Parameters needed are given in the URL (empid, reportid)
//Will grab every item from 'projects-table-dev' DynamoDb table


//Import modules
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");


//Declare table and DynamoDb Client
const REPORT_TABLE = process.env.REPORT_TABLE;
const client = new DynamoDBClient();
const dynamoDb = DynamoDBDocumentClient.from(client);


//Create function
module.exports.getReport = async (event, context, callback) => {
    console.log("EVENT::: Starting to retrieve report from " + REPORT_TABLE);

    //Declare parameters of report to be grabbed
    const params = {
        TableName: REPORT_TABLE,
        Key: {
            empId: event.pathParameters.empid,
            reportId: event.pathParameters.reportid
        }
    }
    console.log("EVENT::: Report parameters grabbed", params);


    try {
        //Get report from table
        const data = await dynamoDb.send(new GetCommand(params));


        //Validation check
        if(!data) {
            console.error(Error);
            return;
        }


        //Response sent to API Gateway
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

        console.log("SUCCESS::: Report retrieved from " + REPORT_TABLE);
        callback(null,response);
    } catch(err) {
        console.log(event.error);
        callback(null, err);
    }
};