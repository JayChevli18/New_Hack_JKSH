const environment = require("../utils/environment");
const { ListSubscribers } = require("node-mailwizz")

const config = {
    publicKey: environment.mailwizz.publicKey,
    secret: environment.mailwizz.secret,
    baseUrl: environment.mailwizz.apiUrl
};

const subscribers = new ListSubscribers(config);

const mailwizzApi = {
    createSubscriber(userInfo) {
        try {
            return subscribers.create({
                listUid: environment.mailwizz.listId,
                data: userInfo,
            });
        } catch (error) {
            console.log(error.message, "createsubscriber");
            return error.message
        }
    },
};

module.exports = mailwizzApi;