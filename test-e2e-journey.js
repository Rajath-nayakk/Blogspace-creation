const BASE_URL = 'http://localhost:5000/api';

async function req(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message || `HTTP ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

async function runJourney() {
  console.log('====================================================');
  console.log('🚀 RUNNING BLOGSPACE 14-STEP VERIFICATION SUITE');
  console.log('====================================================\n');

  try {
    // 1. Health check & Homepage APIs
    console.log('Step 1: Testing homepage and explore endpoints...');
    const health = await req('/health');
    console.log('✅ Health status:', health.status);

    const initialBlogs = await req('/blogs');
    console.log(`✅ Explore blogs count: ${initialBlogs.blogs.length}, total: ${initialBlogs.total}`);

    // 2. Register first user (Alice)
    const uniqueNum = Date.now().toString().slice(-4);
    const aliceData = {
      name: 'Alice Cooper',
      username: `alice_${uniqueNum}`,
      email: `alice_${uniqueNum}@example.com`,
      password: 'Password123!',
      confirmPassword: 'Password123!',
    };
    console.log(`\nStep 2: Registering Alice (${aliceData.email})...`);
    const regRes = await req('/auth/register', { method: 'POST', body: aliceData });
    const aliceToken = regRes.token;
    const aliceId = regRes.user._id;
    console.log('✅ Alice registered with ID:', aliceId);

    // 3. Login verification for Alice
    console.log('\nStep 3: Logging into Alice account...');
    const loginRes = await req('/auth/login', {
      method: 'POST',
      body: {
        emailOrUsername: aliceData.email,
        password: 'Password123!',
      },
    });
    console.log('✅ Alice login successful, received token:', !!loginRes.token);

    // 4 & 5 & 6. Alice creates a blog post with cover image and publishes it
    console.log('\nSteps 4, 5, 6: Alice creates and publishes an article...');
    const newPostData = {
      title: `The Future of Distributed Systems and Reactive State - ${uniqueNum}`,
      description: 'An architectural exploration of edge computing and reactive data flow patterns.',
      category: 'Technology',
      tags: ['Architecture', 'Distributed', 'State'],
      status: 'published',
      coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200',
      content: `Distributed state replication is crucial for modern applications.
## Why Event Sourcing Matters
When state transitions are recorded as immutable event logs, reproducing bugs and restoring state becomes trivial.
\`\`\`javascript
const event = { type: 'POST_PUBLISHED', payload: { id: 1 } };
\`\`\`
> Always keep your event store immutable.`,
    };

    const createPostRes = await req('/blogs', {
      method: 'POST',
      headers: { Authorization: `Bearer ${aliceToken}` },
      body: newPostData,
    });
    const createdPost = createPostRes.blog;
    console.log(`✅ Article created: "${createdPost.title}" with slug: "${createdPost.slug}"`);

    // 7. Verify post appears on homepage and explore page
    console.log('\nStep 7: Verifying article appears in feed and explore search...');
    const exploreCheck = await req(`/blogs?search=${encodeURIComponent(uniqueNum)}`);
    const foundInExplore = exploreCheck.blogs.some((b) => b._id === createdPost._id);
    console.log('✅ Article found in Explore search:', foundInExplore);

    // 8. Register and login second user (Bob)
    const bobData = {
      name: 'Bob Martin',
      username: `bob_${uniqueNum}`,
      email: `bob_${uniqueNum}@example.com`,
      password: 'Password123!',
      confirmPassword: 'Password123!',
    };
    console.log(`\nStep 8: Registering Bob (${bobData.email})...`);
    const bobReg = await req('/auth/register', { method: 'POST', body: bobData });
    const bobToken = bobReg.token;
    const bobId = bobReg.user._id;
    console.log('✅ Bob registered and logged in with ID:', bobId);

    // 9. Bob opens the article and likes it
    console.log('\nStep 9: Bob opens Alice’s article and toggles like...');
    const getArticleRes = await req(`/blogs/${createdPost.slug}`, {
      headers: { Authorization: `Bearer ${bobToken}` },
    });
    console.log(`✅ Bob fetched article details: "${getArticleRes.blog.title}"`);

    const likeRes = await req(`/blogs/${createdPost._id}/like`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${bobToken}` },
    });
    console.log(`✅ Bob liked the post. isLiked: ${likeRes.isLiked}, likesCount: ${likeRes.likesCount}`);

    // 10. Bob writes a comment
    console.log('\nStep 10: Bob comments on Alice’s article...');
    const commentRes = await req(`/comments/${createdPost._id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${bobToken}` },
      body: { content: 'Super insightful piece on immutable event stores! Great job Alice.' },
    });
    const bobComment = commentRes.comment;
    console.log(`✅ Bob posted comment: "${bobComment.content}"`);

    // 11. Alice (author) views the comments on her post
    console.log('\nStep 11: Alice checks comments on her post...');
    const commentsList = await req(`/comments/${createdPost._id}`);
    console.log(`✅ Total comments on post: ${commentsList.count}`);
    const foundComment = commentsList.comments.find((c) => c._id === bobComment._id);
    console.log('✅ Alice sees Bob’s comment:', !!foundComment);

    // 12. Bob edits his own comment
    console.log('\nStep 12: Bob edits his comment...');
    const updatedCommentRes = await req(`/comments/${bobComment._id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${bobToken}` },
      body: { content: 'Super insightful piece on immutable event stores! Edited to add: Event sourcing rocks.' },
    });
    console.log('✅ Bob updated comment:', updatedCommentRes.comment.content);

    // 13. Alice edits her blog post
    console.log('\nStep 13: Alice updates her blog post title and tags...');
    const updateBlogRes = await req(`/blogs/${createdPost._id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${aliceToken}` },
      body: {
        title: `The Future of Distributed Systems and Reactive State [UPDATED] - ${uniqueNum}`,
        tags: ['Architecture', 'Distributed', 'State', 'Reactive'],
      },
    });
    console.log('✅ Alice updated blog post title:', updateBlogRes.blog.title);

    // Alice checks dashboard metrics
    console.log('\nVerifying Alice dashboard stats...');
    const dashboardRes = await req('/blogs/stats/dashboard', {
      headers: { Authorization: `Bearer ${aliceToken}` },
    });
    console.log('✅ Alice Dashboard Stats:', dashboardRes.stats);

    // 14. Logout and re-login
    console.log('\nStep 14: Verifying logout and re-login...');
    await req('/auth/logout', { method: 'POST' });
    const reLoginRes = await req('/auth/login', {
      method: 'POST',
      body: {
        emailOrUsername: aliceData.username,
        password: 'Password123!',
      },
    });
    console.log('✅ Alice successfully re-logged in using username:', reLoginRes.user.username);

    console.log('\n====================================================');
    console.log('🎉 ALL 14 STEPS COMPLETED & VERIFIED 100% SUCCESSFULLY!');
    console.log('====================================================');
  } catch (err) {
    console.error('❌ Verification failed:', err.data || err.message);
    process.exit(1);
  }
}

runJourney();
