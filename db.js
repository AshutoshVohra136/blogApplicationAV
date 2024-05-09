const mongoose = require("mongoose");

async function connectrDb(url) {
  await mongoose
    .connect(url)
    .then(() => console.log(`MongoDb Connected`))
    .catch((err) => {
      console.log(`Error`, err);
    });
}
module.exports = connectrDb;
