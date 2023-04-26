//Allowing creation of reports
//Parameters needed are (empName, email, reportText, projects, submittedAt)
//Will save to 'reports-table-dev' DynamoDb table


//Import modules
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const uuid = require("uuid");


//Declare table and DynamoDb Client
const REPORT_TABLE = process.env.REPORT_TABLE;
const client = new DynamoDBClient();
const dynamoDb = DynamoDBDocumentClient.from(client);


//Create function
module.exports.createReport = async (event, context, callback) => {
    console.log("EVENT::: Starting report push to " + REPORT_TABLE);


    //Body grabbed from JSON event and parsed
    const { empName, email, reportText, projects, submittedAt } = JSON.parse(event.body);
    console.log("EVENT::: Report data grabbed and parsed", event.body);


    //Validation check
    if(typeof empName !== "string" || typeof reportText !== "string") {
        console.error("Validation Failed");
        return;
    }


    //Declare parameters to be pushed to table
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
        //Push parameters into table
        await dynamoDb.send(new PutCommand(params));

        
        //Response sent to API Gateway
        const response = {
            isBase64Encoded: false,
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(reportText)
        }

        
        console.log("SUCCESS::: Report successfully pushed to " + REPORT_TABLE);
        callback(null, response);
    } catch(err) {
        console.log(event.error);
        callback(null, err);
    }
};