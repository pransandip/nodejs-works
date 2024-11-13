import { Request, Response } from 'express';
import { IPost } from '../types/models.types';
import postService from '../services/post.service';

export const fetchPosts = async (req: Request, res: Response) => {
  try {
    const { cardId, postId }: { cardId: string; postId: string } = req.body;

    const posts = await postService.fetchPosts(cardId, postId);

    return res.status(201).json({
      success: '1',
      message: 'Successfully Fetched All the posts',
      data: posts,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const image = req.file?.filename;
    let { body, link }: IPost = req.body;
    const { cardId }: { cardId: string } = req.body;
    const { email }: { email: string } = req.body.user;

    body = body?.trim();
    link = link?.trim();

    // validate parameters
    if (!body || !cardId || !email) {
      throw new Error('Please provide all field');
    }

    // create post with  post service
    const post = await postService.createPost({
      cardId,
      body,
      email,
      image,
      link,
    });

    return res.status(201).json({
      success: '1',
      message: 'Post successfully created',
      data: post,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const likePost = async (req: Request, res: Response) => {
  try {
    const { postId }: { postId: string } = req.body;
    const { email }: { email: string } = req.body.user;

    if (!postId) throw new Error('please provide postId first');
    if (postId.length !== 24) throw new Error('please provide a valid postId');

    await postService.likePost(postId, email);

    return res.status(201).json({
      success: '1',
      message: 'Post liked Successfully',
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const unlikePost = async (req: Request, res: Response) => {
  try {
    const { postId }: { postId: string } = req.body;
    const { email }: { email: string } = req.body.user;

    if (!postId) throw new Error('please provide postId first');
    if (postId.length !== 24) throw new Error('please provide a valid postId');

    await postService.unlikePost(postId, email);

    return res.status(201).json({
      success: '1',
      message: 'Post unLiked Successfully',
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const flagPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email }: { email: string } = req.body.user;

    if (!id) throw new Error('please provide id first');
    if (id.length !== 24) throw new Error('please provide a valid Id');

    const post = await postService.flagPost(id, email);

    return res.status(201).json({
      success: '1',
      message: 'Successfully flaged post',
      data: post,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const unFlagPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email }: { email: string } = req.body.user;

    if (!id) throw new Error('please provide id first');
    if (id.length !== 24) throw new Error('please provide a valid Id');

    const post = await postService.unFlagPost(id, email);

    return res.status(201).json({
      success: '1',
      message: 'Successfully UnFlaged post',
      data: post,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email }: { email: string } = req.body.user;

    if (!id) throw new Error('please provide id first');
    if (id.length !== 24) throw new Error('please provide a valid Id');

    await postService.deletePost(id, email);

    return res.status(201).json({
      success: '1',
      message: 'Successfully deleted Post',
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const { postId, body }: { postId: string; body: string } = req.body;
    const { email }: { email: string } = req.body.user;

    if (!postId || !body) throw new Error('please provide all field');
    if (postId.length !== 24) throw new Error('please provide a valid postId');

    // create comment with  post service
    const comment = await postService.createComment(postId, email, body);

    return res.status(201).json({
      success: '1',
      message: 'Comment successfully created',
      data: comment,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const likeComment = async (req: Request, res: Response) => {
  try {
    const { commentId }: { commentId: string } = req.body;
    const { email }: { email: string } = req.body.user;

    if (!commentId) throw new Error('please provide commentId first');
    if (commentId.length !== 24) {
      throw new Error('please provide a valid commentId');
    }

    await postService.likeComment(commentId, email);

    return res.status(201).json({
      success: '1',
      message: 'Comment liked Successfully',
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const unLikeComment = async (req: Request, res: Response) => {
  try {
    const { commentId }: { commentId: string } = req.body;
    const { email }: { email: string } = req.body.user;

    if (!commentId) throw new Error('please provide commentId first');
    if (commentId.length !== 24) {
      throw new Error('please provide a valid commentId');
    }

    await postService.unLikeComment(commentId, email);

    return res.status(201).json({
      success: '1',
      message: 'Comment UnLiked Successfully',
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email }: { email: string } = req.body.user;

    if (!id) throw new Error('please provide id first');
    if (id.length !== 24) throw new Error('please provide a valid Id');

    await postService.deleteComment(id, email);

    return res.status(201).json({
      success: '1',
      message: 'Successfully deleted Comment',
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const replyComment = async (req: Request, res: Response) => {
  try {
    const { commentId, body }: { commentId: string; body: string } = req.body;
    const { email }: { email: string } = req.body.user;

    if (!commentId) throw new Error('please provide commentId first');
    if (commentId.length !== 24) {
      throw new Error('please provide a valid commentId');
    }

    await postService.replyComment(commentId, email, body);

    return res.status(201).json({
      success: '1',
      message: 'Reply added on comment Successfully',
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};
