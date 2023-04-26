//Allowing emails to be sent to admin email
//Parameters needed are (emailAddress, empName, reportText, projects, submittedAt)
//Will send an email with the parameters to specified email


//Import modules
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");


//Declare email and AWS SES Client
const EMAIL = "jackjosh211@gmail.com";
const client = new SESClient();


//Created function
module.exports.sendEmail = async (event, context, callback) => {
    console.log("EVENT::: Sending mail");


    //Body grabbed from JSON event and parsed
    const { emailAddress, empName, reportText, projects, submittedAt } = JSON.parse(event.body);


    //Validation check
    if(typeof empName !== "string" || typeof reportText !== "string") {
        console.error("Validation Failed");
        return;
    }
    console.log("Email data grabbed and parsed", event.body);


    //Declare parameters to be sent to email
    const emailText = {
        Source: EMAIL,

        Destination: {
            ToAddresses: [
                EMAIL
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
        //Send parameters to email
        await client.send(new SendEmailCommand(emailText));

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

        console.log("SUCCESS::: Email sent to " + EMAIL)
        callback(null, response);
    } catch(err) {
        callback(null, err);
    }
};