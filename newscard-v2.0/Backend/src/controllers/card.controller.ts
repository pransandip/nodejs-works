import { Request, Response } from 'express';
import cardService from '../services/card.service';
import { ICard, ICardQuery, IPCardQuery, IUser } from '../types/models.types';

export const createCard = async (req: Request, res: Response) => {
  try {
    const image = req.file?.filename;
    const { id, email, username }: IUser = req.body.user;
    let {
      title,
      typeOfCard,
      tagLine,
      cardRegAs,
      association,
      cardAccess,
    }: ICard = req.body;
    title = title.trim();

    // validate parameters
    if (!title || !typeOfCard || !image || !tagLine) {
      throw new Error('Please provide all field');
    }
    // create card with card service
    const card = await cardService.createCard({
      id,
      email,
      username,
      title,
      typeOfCard,
      cardRegAs,
      image,
      tagLine,
      association,
      cardAccess,
    });

    return res.status(201).json({
      success: '1',
      message: 'Card successfully created',
      data: card,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const fetchCard = async (req: Request, res: Response) => {
  try {
    const cardQueryDetails: ICardQuery = req.query;
    const { cards, cards_count, num_of_pages } = await cardService.fetchCard(
      cardQueryDetails,
    );

    return res.status(201).json({
      success: '1',
      message: 'Successfully fetched all the cards',
      totalCardsCount: cards_count,
      numberOfPages: num_of_pages,
      data: cards,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const personalCard = async (req: Request, res: Response) => {
  try {
    const cardQueryDetails: IPCardQuery = req.query;
    const { email }: { email: string } = req.body.user;
    const cardDetails = await cardService.getPersonalCard(
      cardQueryDetails,
      email,
    );
    return res.status(201).json({
      success: '1',
      message: 'Successfully fetched personal card details',
      data: cardDetails,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const deletePersonalCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email }: { email: string } = req.body.user;

    if (!id) throw new Error('please provide id first');
    if (id.length !== 24) throw new Error('please provide a valid Id');

    await cardService.deletePersonalCard(id, email);

    return res.status(201).json({
      success: '1',
      message: 'Successfully deleted card',
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email }: { email: string } = req.body.user;

    if (!id) throw new Error('please provide id first');
    if (id.length !== 24) throw new Error('please provide a valid Id');

    await cardService.deleteCard(id, email);

    return res.status(201).json({
      success: '1',
      message: 'Successfully deleted card',
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const followCard = async (req: Request, res: Response) => {
  try {
    const { cardId }: { cardId: string } = req.body;
    const { email }: { email: string } = req.body.user;

    const card = await cardService.followCard(cardId, email);

    return res.status(201).json({
      success: '1',
      message: 'Card followed Successfully',
      data: card,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const unFollowCard = async (req: Request, res: Response) => {
  try {
    const { cardId }: { cardId: string } = req.body;
    const { email }: { email: string } = req.body.user;

    const card = await cardService.unFollowCard(cardId, email);

    return res.status(201).json({
      success: '1',
      message: 'Card UnFollowed Successfully',
      data: card,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const fetchArticle = async (req: Request, res: Response) => {
  try {
    const { cardId }: { cardId: string } = req.body;

    if (!cardId) throw new Error('please provide cardId first');
    if (cardId.length !== 24) throw new Error('please provide a valid cardId');

    const article = await cardService.fetchArticle(cardId);

    return res.status(201).json({
      success: '1',
      message: 'Successfully Fetched Article',
      data: article,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const createArticle = async (req: Request, res: Response) => {
  try {
    const { cardId, body }: { cardId: string; body: string } = req.body;
    const { email }: { email: string } = req.body.user;

    if (!cardId || !body) throw new Error('please provide all field');
    if (cardId.length !== 24) throw new Error('please provide a valid cardId');

    const article = await cardService.createArticle(cardId, email, body);

    return res.status(201).json({
      success: '1',
      message: 'Successfully Article Created',
      data: article,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const updateCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const image = req.file?.filename;
    let { title, typeOfCard, tagLine, association, cardAccess }: ICard =
      req.body;
    title = title.trim();

    console.log({ title });

    // validate parameters
    if (!id) {
      throw new Error('Please provide cardId first');
    }

    // update card with card service
    const card = await cardService.updateCard({
      id,
      title,
      typeOfCard,
      image,
      tagLine,
      association,
      cardAccess,
    });

    return res.status(201).json({
      success: '1',
      message: 'Card successfully updated',
      data: card,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const flagCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email }: { email: string } = req.body.user;

    if (!id) throw new Error('please provide id first');
    if (id.length !== 24) throw new Error('please provide a valid Id');

    await cardService.flagCard(id, email);

    return res.status(201).json({
      success: '1',
      message: 'Successfully flaged card',
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const unFlagCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email }: { email: string } = req.body.user;

    if (!id) throw new Error('please provide id first');
    if (id.length !== 24) throw new Error('please provide a valid Id');

    await cardService.unFlagCard(id, email);

    return res.status(201).json({
      success: '1',
      message: 'Successfully UnFlaged card',
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const suspendCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email }: { email: string } = req.body.user;

    if (!id) throw new Error('please provide id first');
    if (id.length !== 24) throw new Error('please provide a valid Id');

    await cardService.suspendCard(id, email);

    return res.status(201).json({
      success: '1',
      message: 'Successfully Suspend card',
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const unSuspendCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email }: { email: string } = req.body.user;

    if (!id) throw new Error('please provide id first');
    if (id.length !== 24) throw new Error('please provide a valid Id');

    await cardService.unSuspendCard(id, email);

    return res.status(201).json({
      success: '1',
      message: 'Successfully removed suspension from card',
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const sendDirectMsg = async (req: Request, res: Response) => {
  try {
    const { cardId, msg }: { cardId: string; msg: string } = req.body;
    const { email }: { email: string } = req.body.user;

    const message = await cardService.sendDirectMsg(cardId, email, msg);

    return res.status(201).json({
      success: '1',
      message: 'Message send Successfully',
      data: message,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

export const fetchDirectMsgs = async (req: Request, res: Response) => {
  try {
    const { cardId }: { cardId: string } = req.body;

    const message = await cardService.fetchDirectMsgs(cardId);

    return res.status(201).json({
      success: '1',
      message: 'All Messages Fetched Successfully',
      data: message,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};
