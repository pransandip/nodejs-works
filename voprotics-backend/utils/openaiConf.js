const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_APIKEY,
});
const openai = new OpenAIApi(configuration);

module.exports = { openai };