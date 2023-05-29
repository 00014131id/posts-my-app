const fs = require('fs');

class PostsRepository {
	constructor() {
		this.postsDb = [];

		fs.readFile('./data/posts.json', (err, data) => {
			// Read data from file and initialize postsDb
			if (!err) {
				this.postsDb = JSON.parse(data);
			}
		});
	}

	/**
	 * Adds a post to the repository.
	 * @param {Object} post - The post object to be added.
	 * @param {function} callback - The callback function to be called after adding the post.
	 */
	add(post, callback) {
		if (!post.title || !post.author || !post.body) {
			return callback(new Error('All fields are required.'));
		}

		post.id = this.generateRandomId(); // Generate the post id
		this.postsDb.push(post);
		this.updateFile(callback); // Update the data array file
	}

	/**
	 * Retrieves all non-archived posts from the repository.
	 * @returns {Array} - The array of non-archived posts.
	 */
	getAllData() {
		return this.postsDb.filter(post => !post.archived);
	}

	/**
	 * Retrieves a post by its id.
	 * @param {number} id - The id of the post to retrieve.
	 * @returns {Object|null} - The post object if found, null otherwise.
	 */
	getById(id) {
		return this.postsDb.find(post => post.id === id) || null;
	}

	/**
	 * Deletes a post from the repository by its id.
	 * @param {number} id - The id of the post to delete.
	 * @param {function} callback - The callback function to be called after deleting the post.
	 */
	delete(id, callback) {
		const index = this.postsDb.findIndex(post => post.id === id);

		if (index !== -1) {
			// Delete from postsDb array
			this.postsDb.splice(index, 1);
			// Update posts.json file
			this.updateFile(callback);
		} else {
			callback(new Error('Post not found.'));
		}
	}

	/**
	 * Generates a random id for a post.
	 * @returns {number} - The randomly generated id.
	 */
	generateRandomId() {
		return Math.floor(Math.random() * 999999) + 1;
	}

	/**
	 * Updates the posts.json file with the current postsDb data.
	 * @param {function} callback - The callback function to be called after updating the file.
	 */
	updateFile(callback) {
		fs.writeFile('./data/posts.json', JSON.stringify(this.postsDb), callback);
	}
}

module.exports.PostsRepository = PostsRepository;