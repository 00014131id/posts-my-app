const express = require('express');
const app = express();
const { PostsRepository } = require('./routes/posts_repo');
const parser = require('body-parser');

app.use(parser.urlencoded({ extended: false }));
app.use('/assets', express.static('./public'));
app.set('view engine', 'pug');

const postsRepo = new PostsRepository();

// Routes
const postsRouter = require('./routes/posts');
app.use('/posts1', postsRouter);

// Home page
app.get('/', (req, res) => {
	res.render('index');
});

// Create post page
app.get('/posts.app/create', (req, res) => {
	res.render('create', { show: req.query.success });
});

app.post('/posts.app/create', (req, res) => {
	const post = {
		title: req.body.title,
		author: req.body.author,
		body: req.body.details
	};

	postsRepo.add(post, (err) => {
		if (err) {
			res.redirect('/posts.app/create?success=0');
		} else {
			res.redirect('/posts.app/create?success=1');
		}
	});
});

// All posts page
app.get('/posts', (req, res) => {
	const posts = postsRepo.getAllData();
	res.render('posts', { posts: posts.length === 0 ? false : posts });
});

// Individual post page
app.get('/posts1/:id', (req, res) => {
	const id = parseInt(req.params.id);
	const post = postsRepo.getById(id);
	res.render('post', { post });
});

// Delete post by id
app.get('/posts1/:id/delete', (req, res) => {
	const id = parseInt(req.params.id);
	postsRepo.delete(id, (err) => {
		if (err) {
			res.redirect('/posts1?success=0');
		} else {
			res.redirect('/posts1?success=1');
		}
	});
});

// API endpoint to get all posts
app.get('/api/v1/posts', (req, res) => {
	const posts = postsRepo.getAllData();
	res.json(posts);
});

// Start the server
app.listen(8000, () => console.log('App is running on server http://localhost:8000/'));