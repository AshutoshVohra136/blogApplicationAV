const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("node:crypto");
const { createToken, validateToken } = require("../services/authentication");
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },

    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

    profileImageURL: {
      type: String,
      default: "/images/default.webp",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();

  const hashedPassword = createHmac("sha256", salt)
    .update(this.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Error User Not Found");

    const salt = user.salt;

    const hashedPassword = user.password;
    // virtual function so we can use it in our controllers...

    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (hashedPassword !== userProvidedHash)
      throw new Error("Incorrect Password");

    const token = createToken(user);
    return token;
  }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
