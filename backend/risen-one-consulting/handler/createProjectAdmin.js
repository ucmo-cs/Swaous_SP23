//Allowing creation of projects
//Parameters needed are (projectId, name, description, submittedAt, deadline)
//Will save to 'projects-table-dev' DynamoDb table


//Import modules
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");


//Declare table and DynamoDb Client
const PROJECT_TABLE = process.env.PROJECT_TABLE;
const client = new DynamoDBClient();
const dynamoDb = DynamoDBDocumentClient.from(client);


//Create function
module.exports.createProjectAdmin = async (event, context, callback) => {
    console.log("EVENT::: Starting project push to " + PROJECT_TABLE);


    //Body grabbed from JSON event and parsed
    const { projectId, name, description, submittedAt, deadline } = JSON.parse(event.body);


    //Validation check
    if(typeof projectId !== "string" || typeof description !== "string") {
        console.error("Validation Failed");
        return;
    }
    console.log("EVENT::: Project data grabbed and parsed", event.body);


    //Declare parameters to be pushed to table
    const params = {
        TableName: PROJECT_TABLE,
        Item: {
            projectId: projectId,
            name: name,
            description: description,
            submittedAt: submittedAt,
            deadline: deadline
        }
    }

    
    try {
        //Push project into table
        await dynamoDb.send(new PutCommand(params));

        
        //Response sent to API Gateway
        const response = {
            isBase64Encoded: false,
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(description)
        }

        
        console.log("SUCCESS::: Project successfully pushed to " + PROJECT_TABLE);
        callback(null, response);
    } catch(err) {
        console.log(event.error);
        callback(null, err);
    }
};