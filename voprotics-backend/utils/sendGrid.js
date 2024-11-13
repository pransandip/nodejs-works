const client = require('@sendgrid/mail');

client.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = client
