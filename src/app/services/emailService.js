const aws = require("aws-sdk");
const awsConfig = require("../config/aws");

aws.config.update({
  region: awsConfig.awsRegion,
  accessKeyId: awsConfig.awsAccessKey,
  secretAccessKey: awsConfig.awsSecretKey,
});

function cb(email_err, email_data) {
  if (email_err) {
    console.log("Failed to send to email:" + email_err);
  } else {
    console.log(`Email Sent Success: ${JSON.stringify(email_data)}`);
  }
}

exports.emailSender = async () => {
  const ses = new aws.SES();

  // const template = {
  //   Template: {
  //     TemplateName: "MyTemplate",
  //     SubjectPart: "Test email",
  //     HtmlPart: "<h1>Test email</h1><p>Hello!</p>",
  //     TextPart: "Test email: Hello!",
  //   },
  // };
  //
  // ses.createTemplate(template, function (err, data) {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.log("Template created successfully:", data);
  //   }
  // });

  const destination = { ToAddresses: ["xccxccxccb57@gmail.com"] };
  let params = {
    Destination: destination,
    Template: "MyTemplate",
    TemplateData: JSON.stringify({
      name: "John",
      orderId: "1234",
    }),
    // Source: "noreply@amahanechat.com",
    Source: "coffeetsang70@gmail.com",
  };

  ses.sendTemplatedEmail(params, function (email_err, email_data) {
    if (email_err) {
      cb(email_err, email_data);
    } else {
      cb(null, email_data);
    }
  });
};
