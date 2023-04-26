//Allowing deletion of projects
//Parameters needed are pulled from URL (projectid)
//Will delete specified project from 'projects-table-dev' DynamoDb table


//Import modules
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, DeleteCommand } = require("@aws-sdk/lib-dynamodb");


//Declare table and DynamoDb Client
const PROJECT_TABLE = process.env.PROJECT_TABLE;
const client = new DynamoDBClient();
const dynamoDb = DynamoDBDocumentClient.from(client);


//Create function
module.exports.deleteProjectAdmin = async (event, context, callback) => {
    console.log("EVENT::: Starting deletion of project from " + PROJECT_TABLE);


    //Declare parameters of project to be deleted
    const params = {
        TableName: PROJECT_TABLE,
        Key: {
            projectId: event.pathParameters.projectid
        }
    }
    console.log("EVENT::: Project ID grabbed", event.pathParameters.projectid);


    try {
        //Delete project from table
        await dynamoDb.send(new DeleteCommand(params));


        const response = {
            isBase64Encoded: false,
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                message: "Project Deletion Complete."
            })
        }


        console.log("SUCCESS::: Project successfully deleted from " + PROJECT_TABLE);
        callback(null, response);
    } catch(err) {
        console.log(event.error);
        callback(null,err);
    }
};