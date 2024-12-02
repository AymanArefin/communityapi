import express from 'express';
import mongoose from 'mongoose';
const app = express();
const port = 8080;
import { User } from './schema/User.js';
import { Community } from './schema/Community.js';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

await mongoose.connect('mongodb://127.0.0.1/aymandb');

// username, password
app.post('/signup', async (req, res) => {
    try
    {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });

        await user.save();

        return res.send("Account created");
    }
    catch (error)
    {
        return res.send("There was an error");
    }
})

// admin, password, name
app.post('/createcommunity', async (req, res) => {
    try
    {

        const admin = await User.findOne({username: req.body.admin})
        if (admin.password != req.body.password)
        {
            return res.send("Put a valid acount");
        }
        const community = new Community({
            name: req.body.name,
            admin: admin._id
        });
        admin.community = req.body.name;
        await admin.save()
        await community.save();

        return res.send("Community created");
    }
    catch (error)
    {
        return res.send("There was an error");
    }
})

// community, username, password, text
app.post('/post', async (req, res) => {
    try
    {
        const community = await Community.findOne({name: req.body.community});
        const user = await User.findOne({username: req.body.username, password: req.body.password});

        if (!user._id.equals(community.admin))
            {
                return res.send("The acount doesn't math the admin")
            }      
        community.posts.push(req.body.text);
        await community.save()
        res.send("Post sent")

    }
    catch (error)
    {
        return res.send("There was an error");
    }
})
// username, password, communityname
app.post('/join', async (req, res) => {
    try
    {
        const user = await User.findOne({username: req.body.username, password: req.body.password});
        if ((await Community.find({name: req.body.communityname})).length > 0)
        {
            user.community = req.body.communityname;
            await user.save();
            return res.send("Community joined");
        }
        return res.send("There was an error in joining");
    }
    catch (error)
    {
        return res.send("There was an error");
    }
})

//username, password
app.get('/view', async (req, res) => {
    try
    {
        const user = await User.findOne({username: req.body.username, password: req.body.password})
        if (user == undefined)
        {
            return res.send("There was an error")
        }
        const community = await Community.findOne({name: user.community})
        res.send(community.posts)

    }
    catch
    {
        return res.send("There was an error")
    }    
})

app.listen(port, () => {
    console.log(`App running in port ${port}`)
  });