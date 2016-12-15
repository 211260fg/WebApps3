var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
    title: String,
    link: String,
    author: String,
    datetime: String,
    upvotes: {type: Number, default: 0},
    usersWhoUpvoted: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    usersWhoDownvoted: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

PostSchema.methods.upvote = function(user, cb) {
    if (this.usersWhoUpvoted.indexOf(user._id) == -1) {
        this.usersWhoUpvoted.push(user._id);
        this.upvotes++;

        // If this user has downvoted, revert the downvote:
        if (this.usersWhoDownvoted.indexOf(user._id) != -1) {
            this.usersWhoDownvoted.splice(this.usersWhoDownvoted.indexOf(user._id), 1);
            this.upvotes++;
        }

        this.save(cb);
    }
};

PostSchema.methods.downvote = function(user, cb) {
    if (this.usersWhoDownvoted.indexOf(user._id) == -1) {
        this.usersWhoDownvoted.push(user._id);
        this.upvotes--;

        // If this user has upvoted, revert the upvote:
        if (this.usersWhoUpvoted.indexOf(user._id) != -1) {
            this.usersWhoUpvoted.splice(this.usersWhoUpvoted.indexOf(user._id), 1);
            this.upvotes--;
        }

        this.save(cb);
    }
};

mongoose.model('Post', PostSchema);

