require("dotenv").config({ path: "./configs/process/.env" });

const configurations = {
  ConnectionStrings: {
    MongoDB: process.env.CONNECTION_STRING_MONGODB,
  },
  Authentication: {
    Google: {
      ClientId: process.env.GOOGLE_CLIENT_ID,
      ClientSecret: process.env.GOOGLE_CLIENT_SECRET,
      CallbackUrl: process.env.GOOGLE_CALLBACK_URL,
    },
  },
};

module.exports = configurations;
