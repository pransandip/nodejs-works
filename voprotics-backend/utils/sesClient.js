const ses = require("aws-sdk/clients/ses");
const AWS_ACCESS_KEY_ID = "AKIATK5NAQ66C3OMFD72";
const AWS_SECRET_KEY = "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";

const sesClient = new ses({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_KEY,
    region: "us-east-1", // here your region will come see on your aws console default keep == 'us-east-1'
    apiVersion: "2012-12-01"
});

module.exports = {
    sesClient
}
