const express = require("express");
require("dotenv").config();

const path = require("path");
const app = express();
const Comment = require("./models/comment.model");
const Blog = require("./models/blog.model");
//START code for blog router

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
//END code for blog router

const {
  middlewareForCheckingTokens,
} = require("./middlewares/authentication.middleware");
const connectrDb = require("./db");
const PORT = process.env.PORT || 8080;
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
connectrDb(process.env.MONGO_URL);
// connectrDb("mongodb://localhost:27017/blogapp"); //for local
const userRoutes = require("./routes/user.routes");
const blogRoutes = require("./routes/blog.routes");
app.use("/user", userRoutes);
// app.use("/blog", blogRoutes);
app.set("view engine", "ejs");
app.use(middlewareForCheckingTokens("token"));
app.set("views", path.resolve("./views"));

// note express does not render images automatically
//  it thinks our image is a route so
//  we need to tell it to serve
//   image statically so for that
//   we use this middleware .
app.use(express.static(path.resolve("./public")));

// note end
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

//START code for blog router
// this code will go to blog controller/router

// prob in this code part *****

app.get("/blog/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );

  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  });
});

app.get("/blog/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

app.post("/blog", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });

  return res.redirect(`/blog/${blog._id}`);
});

app.post("/blog/comment/:blogId", async (req, res) => {
  const { content } = req.body;
  await Comment.create({
    content,
    createdBy: req.user._id,
    blogId: req.params.blogId,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

//END code for blog router

app.listen(PORT, () => console.log(`Server running on Port: ${PORT}`));
