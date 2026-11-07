require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const { users, blogs, sampleComments } = require('./seedData');

const importData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blogspace';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing database collections...');
    await Comment.deleteMany();
    await Blog.deleteMany();
    await User.deleteMany();

    console.log('Seeding users...');
    const createdUsers = [];
    for (const u of users) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    console.log(`Created ${createdUsers.length} users successfully.`);

    console.log('Seeding blogs...');
    const createdBlogs = [];
    for (let i = 0; i < blogs.length; i++) {
      const b = blogs[i];
      const author = createdUsers[b.authorIndex % createdUsers.length];

      // Give some random likes from other users
      const otherUsers = createdUsers.filter((u) => u._id.toString() !== author._id.toString());
      const likes = otherUsers.slice(0, (i % otherUsers.length) + 1).map((u) => u._id);

      const blog = await Blog.create({
        title: b.title,
        category: b.category,
        tags: b.tags,
        description: b.description,
        content: b.content,
        coverImage: b.coverImage,
        author: author._id,
        status: b.status,
        views: b.views,
        likes,
      });

      createdBlogs.push(blog);
    }
    console.log(`Created ${createdBlogs.length} blogs successfully.`);

    console.log('Seeding sample comments...');
    let commentCount = 0;
    for (let i = 0; i < createdBlogs.length; i++) {
      const blog = createdBlogs[i];
      // Add 1-3 comments per blog
      const commenters = createdUsers.slice(0, 3);
      for (let j = 0; j < commenters.length; j++) {
        const commenter = commenters[j];
        const commentText = sampleComments[(i + j) % sampleComments.length];
        await Comment.create({
          content: commentText,
          author: commenter._id,
          blog: blog._id,
        });
        commentCount++;
      }
    }
    console.log(`Created ${commentCount} comments successfully.`);

    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    process.exit(0);
  } catch (error) {
    console.error(`Error during data seeding: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blogspace';
    await mongoose.connect(mongoUri);

    await Comment.deleteMany();
    await Blog.deleteMany();
    await User.deleteMany();

    console.log('Database collections destroyed.');
    process.exit(0);
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d' || process.argv[2] === '--destroy') {
  destroyData();
} else {
  importData();
}

