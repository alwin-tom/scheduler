const cron = require("node-cron");
const express = require("express");
const https = require('https');
const { log } = require("console");

const app = express();

cron.schedule("*/1 * * * * *", function () {
    try {
        https.get('https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_1fLlM624e08NlF90uo1wKFhPquRdQP4HUbuoti4r&currencies=INR%2CCAD&base_currency=EUR', (resp) => {
            let data = '';

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                console.log(JSON.parse(data));
                let currencyDetails = JSON.parse(data).data;
                let content = "<table class='styled-table' style='width: 50%; margin-left: 25% !important;border-collapse: collapse; margin: 25px 0; font-size: 0.9em; font-family: sans-serif; min-width: 400px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.15)'> <thead> <tr style='border-bottom: 1px solid #dddddd;background-color: #009879; color: #ffffff; text-align: center;'> <th style='padding: 12px 15px;'>Currency</th> <th style='padding: 12px 15px;'>Rate</th> </tr> </thead> <tbody>";
                for (var key in currencyDetails) {
                    if (currencyDetails.hasOwnProperty(key)) {
                        content += "<tr style='border-bottom: 1px solid #dddddd;'>";
                        content += "<th style='padding: 12px 15px;'>" + key + "</th>"
                        content += "<th style='padding: 12px 15px;'>" + currencyDetails[key] + "</th>"
                        content += "</tr>";
                    }
                }
                content += "</tbody></table>";
                let ElasticEmail = require('@elasticemail/elasticemail-client');

                let defaultClient = ElasticEmail.ApiClient.instance;

                let apikey = defaultClient.authentications['apikey'];
                apikey.apiKey = "0323C77F3354ADE3686700E6700BE084D000226CC43AFA20751A783DCDC6C8796F5554315733F930774192DCA14D29A8"

                let api = new ElasticEmail.EmailsApi()

                let email = ElasticEmail.EmailMessageData.constructFromObject({
                    Recipients: [
                        new ElasticEmail.EmailRecipient("hialwin94@gmail.com")
                    ],
                    Content: {
                        Body: [
                            ElasticEmail.BodyPart.constructFromObject({
                                ContentType: "HTML",
                                Content: content
                            })
                        ],
                        Subject: "EURO Conversion rates",
                        From: "hialwin94@gmail.com"
                    }
                });

                var callback = function (error, data, response) {
                    if (error) {
                        console.error(error);
                    } else {
                        console.log('API called successfully.');
                    }
                };
                api.emailsPost(email, callback);
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    } catch (err) {
        console.log(err);
    }

});

app.listen(3000, () => {
    console.log("application listening.....");
});