import config from '../config/default';
import { prisma } from '../prisma/prisma.client';
import { CreatePostDto } from '../types/dtos/CreatePost.dto';
// import config from '../config/default';

const fetchPosts = async (cardId: string, postId: string) => {
  try {
    let posts: any;

    if (cardId) {
      if (cardId.length !== 24) {
        throw new Error('please provide a valid cardId');
      }
      posts = await prisma.post.findMany({
        where: { cardId },
      });

      if (posts.length === 0) {
        throw new Error('No records found of posts');
      }
      return posts;
    }

    if (postId) {
      if (postId.length !== 24) {
        throw new Error('please provide a valid postId');
      }

      posts = await prisma.post.findFirst({
        select: {
          id: true,
          email: true,
          body: true,
          image: true,
          link: true,
          flaged: true,
          likes: true,
          disLikes: true,
          createdAt: true,
          updatedAt: true,
          cardId: true,
          comments: {
            select: {
              id: true,
              email: true,
              userImage: true,
              body: true,
              likes: true,
              disLikes: true,
              reply: true,
              createdAt: true,
              updatedAt: true,
              postId: true,
            },
          },
        },
        where: { id: postId },
      });

      if (posts.length === 0) {
        throw new Error('No records found of post');
      }
      return posts;
    }
    throw new Error('Please provide cardId or postId first');
  } catch (err) {
    throw err;
  }
};

const createPost = async (postDetails: CreatePostDto) => {
  try {
    let { cardId, body, email, image, link } = postDetails;
    // const imgURL = `${config.BASE_URL}/upload/${image}`;

    const imgURL =
      `${image}` === 'undefined'
        ? undefined
        : `${config.BASE_URL}/upload/${image}`;

    const exists = await prisma.card.findFirst({
      where: { id: cardId },
    });

    if (!exists) {
      throw new Error(`Card with id: (${cardId}) does not exists`);
    }

    // create post
    const post = await prisma.post.create({
      data: {
        email,
        body,
        image: imgURL,
        link,
        Card: { connect: { id: cardId } },
      },
    });

    // if post not saved
    if (!post) throw new Error('Some issue occurred while creating post');

    return post;
  } catch (err) {
    throw err;
  }
};

const likePost = async (postId: string, email: string) => {
  try {
    const exists = await prisma.post.findFirst({
      where: { id: postId },
    });

    if (!exists) {
      throw new Error(`Post with id: (${postId}) does not exists`);
    }

    if (exists.likes.includes(email)) {
      throw new Error(`You already liked this post`);
    }

    // like post
    const liked = await prisma.post.update({
      where: {
        id: postId,
      },
      data: { likes: { push: email } },
    });

    // If not followed
    if (!liked) {
      throw new Error('some issue occurred, while like the post');
    }

    return liked;
  } catch (err) {
    throw err;
  }
};

const unlikePost = async (postId: string, email: string) => {
  try {
    const exists = await prisma.post.findFirst({
      where: { id: postId },
    });

    if (!exists) {
      throw new Error(`Post with id: (${postId}) does not exists`);
    }

    if (!exists.likes.includes(email)) {
      throw new Error(`You have to liked this post first`);
    }

    // like post
    const liked = await prisma.post.update({
      where: {
        id: postId,
      },
      data: { likes: { set: exists.likes.filter(items => items !== email) } },
    });

    // If not followed
    if (!liked) {
      throw new Error('some issue occurred, while unlike the post');
    }

    return liked;
  } catch (err) {
    throw err;
  }
};

const flagPost = async (postId: string, email: string) => {
  try {
    const exists = await prisma.post.findFirst({
      where: { id: postId },
    });

    if (!exists) {
      throw new Error(`Post with id: (${postId}) does not exists`);
    }

    // check user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user?.userType !== 'Mode') {
      throw new Error(`You can't flaged this post! you are not a moderator`);
    }

    const result = await prisma.post.update({
      where: { id: postId },
      data: { flaged: true },
    });

    if (!result) throw new Error('Some error occurred while flag post');

    return result;
  } catch (err) {
    throw err;
  }
};

const unFlagPost = async (postId: string, email: string) => {
  try {
    const exists = await prisma.post.findFirst({
      where: { id: postId },
    });

    if (!exists) {
      throw new Error(`Post with id: (${postId}) does not exists`);
    }

    // check user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user?.userType !== 'Mode') {
      throw new Error(`You can't unFlaged this post! you are not a moderator`);
    }

    const result = await prisma.post.update({
      where: { id: postId },
      data: { flaged: false },
    });

    if (!result) throw new Error('Some error occurred while unFlag post');

    return result;
  } catch (err) {
    throw err;
  }
};

const deletePost = async (postId: string, email: string) => {
  try {
    const exists = await prisma.post.findFirst({
      where: { id: postId },
    });

    if (!exists) {
      throw new Error(`Post with id: (${postId}) does not exists`);
    }

    // check user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user?.userType !== 'Mode') {
      throw new Error(`You can't delete this post! you are not a moderator`);
    }
    const result = await prisma.post.delete({ where: { id: postId } });
    if (!result) throw new Error('Some error occurred while deleting card');

    return result;
  } catch (err) {
    throw err;
  }
};

const createComment = async (postId: string, email: string, body: string) => {
  try {
    const exists = await prisma.post.findFirst({
      where: { id: postId },
    });

    if (!exists) {
      throw new Error(`Post with id: (${postId}) does not exists`);
    }

    // check user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // create comment
    const comment = await prisma.comments.create({
      data: {
        email,
        userImage: user?.image,
        body,
        Post: { connect: { id: postId } },
      },
    });

    // if comment not saved
    if (!comment) throw new Error('Some issue occurred while creating comment');

    return comment;
  } catch (err) {
    throw err;
  }
};

const likeComment = async (commentId: string, email: string) => {
  try {
    const exists = await prisma.comments.findFirst({
      where: { id: commentId },
    });

    if (!exists) {
      throw new Error(`Comment with id: (${commentId}) does not exists`);
    }

    if (exists.likes.includes(email)) {
      throw new Error(`You already liked this comment`);
    }

    // like comment
    const liked = await prisma.comments.update({
      where: {
        id: commentId,
      },
      data: { likes: { push: email } },
    });

    // If not followed
    if (!liked) {
      throw new Error('some issue occurred, while like the comment');
    }

    return liked;
  } catch (err) {
    throw err;
  }
};

const unLikeComment = async (commentId: string, email: string) => {
  try {
    const exists = await prisma.comments.findFirst({
      where: { id: commentId },
    });

    if (!exists) {
      throw new Error(`Comment with id: (${commentId}) does not exists`);
    }

    if (!exists.likes.includes(email)) {
      throw new Error(`You have to liked fist the comment`);
    }

    // like comment
    const liked = await prisma.comments.update({
      where: {
        id: commentId,
      },
      data: { likes: { set: exists.likes.filter(items => items !== email) } },
    });

    // If not followed
    if (!liked) {
      throw new Error('some issue occurred, while unLike the comment');
    }

    return liked;
  } catch (err) {
    throw err;
  }
};

const deleteComment = async (commentId: string, email: string) => {
  try {
    const exists = await prisma.comments.findFirst({
      where: { id: commentId },
    });

    if (!exists) {
      throw new Error(`Comment with id: (${commentId}) does not exists`);
    }

    if (exists.email !== email) {
      throw new Error(
        `You can't delete this Comment! this comment isn't owned by you`,
      );
    }
    const result = await prisma.comments.delete({ where: { id: commentId } });
    if (!result) throw new Error('Some error occurred while deleting card');

    return result;
  } catch (err) {
    throw err;
  }
};

const replyComment = async (
  commentId: string,
  _email: string,
  body: string,
) => {
  try {
    const exists = await prisma.comments.findFirst({
      where: { id: commentId },
    });

    if (!exists) {
      throw new Error(`Comment with id: (${commentId}) does not exists`);
    }

    // add reply
    const reply = await prisma.comments.update({
      where: {
        id: commentId,
      },
      data: { reply: body },
    });

    // If not followed
    if (!reply) {
      throw new Error('some issue occurred, while adding reply on comment');
    }

    return reply;
  } catch (err) {
    throw err;
  }
};

export default {
  createPost,
  fetchPosts,
  likePost,
  flagPost,
  deletePost,
  createComment,
  likeComment,
  deleteComment,
  unlikePost,
  unFlagPost,
  unLikeComment,
  replyComment,
};
