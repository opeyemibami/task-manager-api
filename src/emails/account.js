const sgMail = require('@sendgrid/mail')
const dotenv = require('dotenv')
dotenv.config()
const sendGridApi = process.env.SENDGRID_API_KEY


sgMail.setApiKey(sendGridApi)



const sendWelcomeMail = (email, name) => {

  sgMail.send({
    to: email,
    from: 'bamigbadeopeyemi@gmail.com',
    subject: 'Thanks for joinning in',
    text: `Welcome to the app, ${name} . Let me know how you get along with the app`
  })
}


const sendGoodbyeMail = (email, name) => {
  sgMail.send({
    from: email,
    personalizations: [
      {
        to: [
          {
            email: email,
          },
        ],
        cc: [
          {
            email: 'bamigbade_o@outlook.com',
          },
        ],
        subject: 'We regret to see you go',
      },
    ],
    text: 'We regreat to see you, is there anything we can do better to have you back on board',
  })
}

module.exports = {sendWelcomeMail, sendGoodbyeMail}