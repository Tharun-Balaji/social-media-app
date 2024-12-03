
import Users from '../models/userModel.js';
import Posts from './../models/postModel.js';
import Comments from './../models/commentModel.js';
export const createPost = async (req, res, next) => {

  try {
    
    // get user id
    const { userId } = req.body.user;

    // get post data
    const { description, image } = req.body;

    // check for description
    if (!description) {
      next("You must provide a description");
      return;
    };

    // create post
    const post = await Posts.create({
      userId,
      description,
      image,
    });

    // send response
    res.status(200).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });

  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }

};
 
export const getPosts = async (req, res, next) => { 
  try {
    // get user id
    const { userId } = req.body.user;

    // get search data
    const { search } = req.body;

    // find user
    const user = await Users.findById(userId);

    // get friends
    const friends = user?.friends?.toString().split(",") ?? [];
    friends.push(userId); // add user id to friends

    // get search query
    const searchPostQuery = {
      $or: [ // or condition
        {
          description: { $regex: search, $options: "i" }, // case insensitive regex
        },
      ],
    };

    // get posts
    const posts = await Posts.find(search ? searchPostQuery : {}) // search query
      .populate({ // populate user
        path: "userId",
        select: "firstName lastName location profileUrl -password",
      })
      .sort({ _id: -1 }); // sort by id
    
    // get friends posts
    const friendsPosts = posts?.filter((post) => {
      return friends.includes(post?.userId?._id.toString());
    });

    // get other posts
    const otherPosts = posts?.filter(
      (post) => !friends.includes(post?.userId?._id.toString())
    );

    // create response
    let postsRes = null;

    // load friends posts first
    if (friendsPosts?.length > 0) {
      postsRes = search ? friendsPosts : [...friendsPosts, ...otherPosts];
    } else {
      postsRes = posts;
    }

    // send response
    res.status(200).json({
      success: true,
      message: "successfully",
      data: postsRes,
    });

  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getPost = async (req, res, next) => {

  try {
    // get post id
    const { id } = req.params;

    // get post
    const post = await Posts.findById(id).populate({ // populate user
      path: "userId",
      select: "firstName lastName location profileUrl -password",
    });
      // .populate({ // populate comments
      //   path: "comments",
      //   populate: { // populate users
      //     path: "userId",
      //     select: "firstName lastName location profileUrl -password",
      //   },
      //   options: { // sort comments
      //     sort: "-_id",
      //   },
      // })
      // .populate({
      //   path: "comments",
      //   populate: { // populate replies
      //     path: "replies.userId",
      //     select: "firstName lastName location profileUrl -password",
      //   },
      // });

    res.status(200).json({
      success: true,
      message: "successfully",
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getUserPost = async (req, res, next) => { 
  
  try {

    // get user id
    const { id } = req.params;

    // get posts
    const post = await Posts.find({ userId: id }) // search by user id
      .populate({ // populate user
        path: "userId",
        select: "firstName lastName location profileUrl -password",
      })
      .sort({ _id: -1 }); // sort by id
    

    // send response
    res.status(200).json({
      success: true,
      message: "successfully",
      data: post,
    });

  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getComments = async (req, res, next) => { 

  try {

    // get post id
    const { postId } = req.params;

    // get comments
    const postComments = await Comments.find({ postId })
      .populate({ // populate user
        path: "userId",
        select: "firstName lastName location profileUrl -password",
      })
      .populate({ // populate replies
        path: "replies.userId",
        select: "firstName lastName location profileUrl -password",
      })
      .sort({ _id: -1 }); // sort by id
    

    // send response
    res.status(200).json({
      success: true,
      message: "successfully",
      data: postComments,
    });

  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const likePost = async (req, res, next) => { 
  try {

    // get user id
    const { userId } = req.body.user;

    // get post id
    const { id } = req.params;

    // get post
    const post = await Posts.findById(id);

    // get index
    const index = post.likes.findIndex((pid) => pid === String(userId));

    if (index === -1) { // if not liked
      post.likes.push(userId);
    } else { // if liked
      post.likes = post.likes.filter((pid) => pid !== String(userId));
    }

    // update post
    const newPost = await Posts.findByIdAndUpdate(id, post, {
      new: true,
    });

    // send response
    res.status(200).json({
      success: true,
      message: "successfully",
      data: newPost,
    });

  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const likePostComment = async (req, res, next) => { 

  try {

    // get user id
    const { userId } = req.body.user;

    // get comment id
    const { id, rid } = req.params;


    if (rid === undefined || rid === null || rid === `false`) { // if no reply id

      // get comment
      const comment = await Comments.findById(id);

      // get index
      const index = comment.likes.findIndex((el) => el === String(userId));

      if (index === -1) { // if not liked
        comment.likes.push(userId);
      } else { // if liked
        comment.likes = comment.likes.filter((i) => i !== String(userId));
      }

      // update comment
      const updated = await Comments.findByIdAndUpdate(id, comment, {
        new: true,
      });

      // send response
      res.status(201).json(updated);

    } else { // if reply id

      // get reply
      const replyComments = await Comments.findOne(
        { _id: id }, // search by comment id
        {
          replies: { // search by reply id
            $elemMatch: {
              _id: rid, // search by reply id
            },
          },
        }
      );

      // get index
      const index = replyComments?.replies[0]?.likes.findIndex(
        (i) => i === String(userId)
      );

      if (index === -1) { // if not liked
        replyComments.replies[0].likes.push(userId);
      } else { // if liked
        replyComments.replies[0].likes = replyComments.replies[0]?.likes.filter(
          (i) => i !== String(userId)
        );
      }

      // create query object
      const query = { _id: id, "replies._id": rid };

      // update comment
      const updated = {
        $set: { // set
          "replies.$.likes": replyComments.replies[0].likes, // likes
        },
      };

      // update comment
      const result = await Comments.updateOne(query, updated, { new: true });
    

      // send response
      res.status(201).json(result);

    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const commentPost = async (req, res, next) => { 

  try {

    // get comment and from
    const { comment, from } = req.body;

    // get user id
    const { userId } = req.body.user;

    // get post id
    const { id } = req.params;

    // check if comment is empty
    if (comment === null) {
      return res.status(404).json({ message: "Comment is required." });
    }

    // create new comment
    const newComment = new Comments({ comment, from, userId, postId: id });

    // save comment
    await newComment.save();

    // get post
    const post = await Posts.findById(id);

    // add comment id to post
    post.comments.push(newComment._id);

    // update post
    const updatedPost = await Posts.findByIdAndUpdate(id, post, {
      new: true,
    });

    // send response
    res.status(201).json(newComment);


  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const replyPostComment = async (req, res, next) => { 

  try {

    // get user id
    const { userId } = req.body.user;

    // get comment and reply at
    const { comment, replyAt, from } = req.body;

    // get comment id
    const { id } = req.params;

    // check if comment is empty
    if (comment === null) {
      return res.status(404).json({ message: "Comment is required." });
    }

    // get comment
    const commentInfo = await Comments.findById(id);

    // add reply
    commentInfo.replies.push({
      comment,
      replyAt,
      from,
      userId,
      created_At: Date.now(),
    });

    // update comment
    commentInfo.save();

    // send response
    res.status(200).json(commentInfo);
    
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const deletePost = async (req, res, next) => {
  try {

    // get post id
    const { id } = req.params;

    // delete post
    await Posts.findByIdAndDelete(id);

    // send response
    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};