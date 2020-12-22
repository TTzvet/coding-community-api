exports.getPosts = (req, res) => {
    res.json({
        posts: [
            {title: 'My First Post'},
            {title: 'My Second Post'}
        ]
    });
};

