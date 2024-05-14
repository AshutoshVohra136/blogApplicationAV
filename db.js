const mongoose = require("mongoose");

async function connectrDb(url) {
  try {
    await mongoose
      .connect(url)
      .then(() => console.log(`MongoDb Connected`))
      .catch((err) => {
        console.log(`Error`, err);
      });
  } catch (error) {
    console.log(`mongo db Error`, error);
  }
}
module.exports = connectrDb;
