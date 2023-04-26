//Allowing retrieval of ALL projects
//Parameters needed are the name of the table
//Will grab every item from 'projects-table-dev' DynamoDb table


//Import modules
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {  DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");


//Declare table and DynamoDb Client
const PROJECT_TABLE = process.env.PROJECT_TABLE;
const client = new DynamoDBClient();
const dynamoDb = DynamoDBDocumentClient.from(client);


//Create function
module.exports.getProjects = async (event, context, callback) => {
    console.log("EVENT::: Starting scan of all items in " + PROJECT_TABLE);


    try {
        //Declare parameters of table to be scanned
        const params = {
            TableName: PROJECT_TABLE
        }
        console.log("EVENT::: Table parameters grabbed", PROJECT_TABLE);


        //Scan entire table
        const data = await dynamoDb.send(new ScanCommand(params));
        if(!data) {
            console.error("Error: Table does not exist");
            callback(new Error(error));
            return;
        }
        console.log("EVENT::: Table scanned", PROJECT_TABLE);
        
        
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


        console.log("SUCCESS::: All projects read in " + PROJECT_TABLE);
        callback(null, response);
    } catch(err) {
        console.log(event.error);
        callback(null, err);
    }  
};