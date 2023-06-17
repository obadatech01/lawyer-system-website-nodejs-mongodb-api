const mongoose = require("mongoose");

// mongoose.set("strictQuery", false);
const dbConnection = () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // ssl: true,
      // sslValidate: false,
    })
    .then((conn) => {
      console.log(`Databases connected: ${conn.connection.host}`);
    })
    .catch((err) => {
      console.error(`Database Error: ${err}`);
      process.exit(1);
    });
};

module.exports = dbConnection;
