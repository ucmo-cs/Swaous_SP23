//Allows user to send email of report

//Import modules
const { 
    SESClient,
    SendEmailCommand
 } = require("@aws-sdk/client-ses");

//Declare AWS SES Client
const client = new SESClient();

//Created function
module.exports.sendEmail = async (event, context, callback) => {
    //Body grabbed from JSON event
    const { emailAddress, empName, reportText, projects, submittedAt } = JSON.parse(event.body);
    if(typeof empName !== "string" || typeof reportText !== "string") {
        console.error("Validation Failed");
        return;
    }

    //Create parameters for the email
    const emailText = {
        Source: "jackjosh211@gmail.com",

        Destination: {
            ToAddresses: [
                "jackjosh211@gmail.com"
            ]
        },

        Message: {
            Subject: {
                Data: `${empName}'s (${submittedAt}) Report`
            },

            Body: {
                Text: {
                    Data: `Submitter: ${empName} (${submittedAt})\n\n\nProjects: ${projects}\nReport Text: ${reportText}\n\n\n\n\nEmployee Email: ${emailAddress}\nEmployee ID: ${event.pathParameters.empid}\nReport ID: ${event.pathParameters.reportid}`
                }
            }
        }
    };

    try {
        //Send parameters in email
        await client.send(new SendEmailCommand(emailText));

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