
const mailTransport = require('@sendgrid/mail');

module.exports.sendMail = function (email,accessToken) {
  return new Promise((resolve, reject) => {
    mailTransport.setApiKey(process.env.KEY);

    const mailContent = {
      from: '',
      to: email,
      dynamic_template_data: {
        "name":"Testing"
      
      },
      template_id: process.env.TEMPLATEID
    };

    mailTransport.send(mailContent)
      .then(() => {
        resolve(true);
      })
      .catch((error) => {
        console.error(error);
        reject(false);
      });
  });
};
