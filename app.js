//Starting content files
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const express = require("express");
const app = express();
const _ = require("lodash");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/blogDB");

const blogSchema = mongoose.Schema({
    postTitle: String,
    postContent: String,
})

const blog = mongoose.model("blogs", blogSchema);

app.get("/", (req, res) => {
    blog.find()
        .then((foundBlogs) => {
            const data = {
                blogs: foundBlogs,
            }
            res.render("home", data);
        })
        .catch((error) => {
            console.log("Error finding the blogs on homepage", error);
        })
})

app.post("/", (req, res) => {
    const inputPostTitle = (req.body.postTitle);
    const inputPostContent = (req.body.postContent);
    console.log("Input post title:", inputPostTitle);
    console.log("Input post content:", inputPostContent);
    const newBlog = blog({
        postTitle: inputPostTitle,
        postContent: inputPostContent,
    })
    newBlog.save()
        .then(() => {
            console.log("Blog saved successfully!")
            res.redirect("/");
        })
        .catch((error) => {
            console.log("Error saving the blog", error);
        })
})

app.get("/posts/:postId", (req, res) => {
    const id = req.params.postId;
    blog.findOne({ _id: id })
        .then((foundBlog) => {
            if (foundBlog) {
                const data = {
                    postTitle: foundBlog.postTitle,
                    postContent: foundBlog.postContent,
                }
                res.render("post", data);
            } else {
                const data = {
                    postTitle: "Uh Oh :(",
                    postContent: "The requested blog couldn't be found!",
                }
                res.render("post", data);
            }
        })
        .catch((error) => {
            console.log("Error finding the blog", error);
        })

})


app.get("/compose", (req, res) => {
    res.render("compose")
})

app.get("/about", (req, res) => {
    res.render("about", { aboutContent: aboutContent })
})

app.get("/contact", (req, res) => {
    res.render("contact", { contactContent: contactContent })
})


app.listen(3000, () => {
    console.log("Server is up and running!");
})