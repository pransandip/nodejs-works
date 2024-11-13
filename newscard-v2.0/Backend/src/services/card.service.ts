import { randomBytes } from 'crypto';
import { prisma } from '../prisma/prisma.client';
import { CreateCardDto } from '../types/dtos/CreateCard.dto';
import config from '../config/default';
import { ICardQuery, IPCardQuery } from '../types/models.types';

const createCard = async (cardDetails: CreateCardDto) => {
  try {
    let {
      id: userId,
      email,
      username,
      title,
      image,
      typeOfCard,
      tagLine,
      cardRegAs,
      association,
      cardAccess,
    } = cardDetails;

    const cardPATH = title.toLowerCase().split(' ').join('');
    const handle = `${config.BASE_URL}/cards/${cardPATH}`;
    const imgURL = `${config.BASE_URL}/upload/${image}`;

    // check card
    const exists = await prisma.card.findFirst({
      where: { email, title },
    });

    // card present
    if (exists) {
      throw new Error('Card already present! create card with another title');
    }
    // save card on db
    const card = await prisma.card.create({
      data: {
        email,
        username,
        title,
        handle,
        typeOfCard,
        cardRegAs,
        image: imgURL,
        tagLine,
        association,
        cardAccess,
        User: { connect: { id: userId } },
      },
    });
    // if card not saved
    if (!card) throw new Error('Some issue occurred while creating card');
    return card;
  } catch (err) {
    throw err;
  }
};

const fetchCard = async (cardFilterData: ICardQuery) => {
  try {
    let { filter, limit, page, sort, id } = cardFilterData;
    let PAGE_SIZE = Math.max(10, limit!);
    page = Math.max(1, page!);

    let cards: any;
    let cards_count: number;
    let num_of_pages: number;

    if (filter === 'ALL' && limit && page) {
      cards = await prisma.card.findMany({
        select: {
          id: true,
          title: true,
          email: true,
          username: true,
          handle: true,
          typeOfCard: true,
          cardRegAs: true,
          image: true,
          tagLine: true,
          association: true,
          cardAccess: true,
          flaged: true,
          suspended: true,
          article: true,
          followers: true,
          complications: true,
        },
        orderBy: {
          id: sort || 'asc',
        },
      });

      if (cards.length === 0) {
        throw new Error('No records found of cards');
      }
      cards_count = cards.length;
      num_of_pages = Math.ceil(cards_count / PAGE_SIZE);

      cards = cards.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
      return {
        cards,
        cards_count,
        num_of_pages,
      };
    }

    // get all cards if card id is not provided
    cards = await prisma.card.findMany({
      select: {
        id: true,
        title: true,
        email: true,
        username: true,
        handle: true,
        typeOfCard: true,
        cardRegAs: true,
        image: true,
        tagLine: true,
        association: true,
        cardAccess: true,
        flaged: true,
        suspended: true,
        article: true,
        followers: true,
        complications: true,
      },
      where: { id },
    });

    if (cards.length === 0) {
      throw new Error('No records found of cards');
    }
    return { cards };
  } catch (err) {
    throw err;
  }
};

const getPersonalCard = async (cardFilterData: IPCardQuery, email: string) => {
  try {
    const { filter } = cardFilterData;
    const user = await prisma.user.findUnique({ where: { email } });
    const pCard = await prisma.card.findFirst({
      where: { email, cardRegAs: 'Personal' },
    });

    let ownedCards: any;
    if (filter === 'owned') {
      ownedCards = await prisma.card.findMany({
        where: { userId: user?.id, cardRegAs: 'Regular' },
        select: {
          id: true,
          title: true,
          handle: true,
          image: true,
          tagLine: true,
          typeOfCard: true,
        },
      });
    }
    return { ...pCard, ownedCards };
  } catch (err) {
    throw err;
  }
};

const deletePersonalCard = async (cardId: string, email: string) => {
  try {
    const exists = await prisma.card.findFirst({
      where: { id: cardId },
    });

    if (!exists) {
      throw new Error(`Card with id: (${cardId}) does not exists`);
    }

    if (exists.email !== email) {
      throw new Error(
        `You can't delete this card! this card isn't owned by you`,
      );
    }
    const result = await prisma.card.delete({ where: { id: cardId } });
    if (!result) throw new Error('Some error occurred while deleting card');

    return result;
  } catch (err) {
    throw err;
  }
};

const deleteCard = async (cardId: string, email: string) => {
  try {
    const exists = await prisma.card.findFirst({
      where: { id: cardId },
    });

    if (!exists) {
      throw new Error(`Card with id: (${cardId}) does not exists`);
    }

    // check user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user?.userType !== 'Mode') {
      throw new Error(`You can't delete this card! you are not a moderator`);
    }
    const result = await prisma.card.delete({ where: { id: cardId } });
    if (!result) throw new Error('Some error occurred while deleting card');

    return result;
  } catch (err) {
    throw err;
  }
};

const followCard = async (cardId: string, email: string) => {
  try {
    const exists = await prisma.card.findFirst({
      where: { id: cardId },
    });

    if (!exists) {
      throw new Error(`Card with id: (${cardId}) does not exists`);
    }

    if (exists.followers.includes(email)) {
      throw new Error(`You are already following this card`);
    }

    // follow card
    const followed = await prisma.card.update({
      where: {
        id: cardId,
      },
      data: { followers: { push: email } },
    });

    // If not followed
    if (!followed) {
      throw new Error('some issue occurred, while following card');
    }

    // update user about followed card
    const updateUser = await prisma.user.update({
      where: { email },
      data: { followingCards: { push: cardId } },
    });

    // If not saved
    if (!updateUser) {
      throw new Error('some issue occurred, while saving cardId to user');
    }

    return followed;
  } catch (err) {
    throw err;
  }
};

const unFollowCard = async (cardId: string, email: string) => {
  try {
    const exists = await prisma.card.findFirst({
      where: { id: cardId },
    });

    if (!exists) {
      throw new Error(`Card with id: (${cardId}) does not exists`);
    }

    if (!exists.followers.includes(email)) {
      throw new Error(`You have to follow this card first`);
    }

    // follow card
    const followed = await prisma.card.update({
      where: {
        id: cardId,
      },
      data: {
        followers: { set: exists.followers.filter(items => items !== email) },
      },
    });

    // If not followed
    if (!followed) {
      throw new Error('some issue occurred, while un-following card');
    }

    // check user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // update user about followed card
    const updateUser = await prisma.user.update({
      where: { email },
      data: {
        followingCards: {
          set: user?.followingCards.filter(items => items !== cardId),
        },
      },
    });

    // If not saved
    if (!updateUser) {
      throw new Error('some issue occurred, while removing cardId from user');
    }

    return followed;
  } catch (err) {
    throw err;
  }
};

const fetchArticle = async (cardId: string) => {
  try {
    const exists = await prisma.card.findFirst({
      where: { id: cardId },
    });

    if (!exists) {
      throw new Error(`Card with id: (${cardId}) does not exists`);
    }

    // fetch article
    const article = await prisma.card.findFirst({
      select: { email: true, article: true },
      where: { id: cardId },
    });

    // If not saved
    if (!article) {
      throw new Error('some issue occurred, while fetching article from db');
    }

    return article;
  } catch (err) {
    throw err;
  }
};

const createArticle = async (cardId: string, email: string, body: string) => {
  try {
    const exists = await prisma.card.findFirst({
      where: { id: cardId },
    });

    if (!exists) {
      throw new Error(`Card with id: (${cardId}) does not exists`);
    }

    if (exists.email !== email) {
      throw new Error(
        `You can't create an article on this card! this card isn't owned by you`,
      );
    }

    // create article on card
    const article = await prisma.card.update({
      where: { id: cardId },
      data: { article: body },
    });

    // If not saved
    if (!article) {
      throw new Error('some issue occurred, while creating article on card');
    }

    return article;
  } catch (err) {
    throw err;
  }
};

const updateCard = async (cardDetails: any) => {
  try {
    let { id, title, typeOfCard, image, tagLine, association, cardAccess } =
      cardDetails;

    const cardPATH = title.toLowerCase().split(' ').join('');
    const handle = `${config.BASE_URL}/cards/${cardPATH}`;
    const imgURL = `${config.BASE_URL}/upload/${image}`;

    const exists = await prisma.card.findFirst({
      where: { id },
    });

    if (!exists) {
      throw new Error(`Card with id: (${id}) does not exists`);
    }

    // update card
    const updateCard = await prisma.card.update({
      where: { id },
      data: {
        title,
        handle,
        typeOfCard,
        image: imgURL,
        tagLine,
        association,
        cardAccess,
      },
    });

    // if card not saved
    if (!updateCard) throw new Error('Some issue occurred while updating card');

    return updateCard;
  } catch (err) {
    throw err;
  }
};

const flagCard = async (cardId: string, email: string) => {
  try {
    const exists = await prisma.card.findFirst({
      where: { id: cardId },
    });

    if (!exists) {
      throw new Error(`Card with id: (${cardId}) does not exists`);
    }

    // check user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user?.userType !== 'Mode') {
      throw new Error(`You can't flaged this card! you are not a moderator`);
    }

    const result = await prisma.card.update({
      where: { id: cardId },
      data: { flaged: true },
    });

    if (!result) throw new Error('Some error occurred while flag card');

    return result;
  } catch (err) {
    throw err;
  }
};

const unFlagCard = async (cardId: string, email: string) => {
  try {
    const exists = await prisma.card.findFirst({
      where: { id: cardId },
    });

    if (!exists) {
      throw new Error(`Card with id: (${cardId}) does not exists`);
    }

    // check user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user?.userType !== 'Mode') {
      throw new Error(`You can't unFlaged this card! you are not a moderator`);
    }

    const result = await prisma.card.update({
      where: { id: cardId },
      data: { flaged: false },
    });

    if (!result) throw new Error('Some error occurred while unFlag card');

    return result;
  } catch (err) {
    throw err;
  }
};

const suspendCard = async (cardId: string, email: string) => {
  try {
    const exists = await prisma.card.findFirst({
      where: { id: cardId },
    });

    if (!exists) {
      throw new Error(`Card with id: (${cardId}) does not exists`);
    }

    // check user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user?.userType !== 'Mode') {
      throw new Error(`You can't suspend this card! you are not a moderator`);
    }

    const result = await prisma.card.update({
      where: { id: cardId },
      data: { suspended: true },
    });

    if (!result) throw new Error('Some error occurred while suspend card');

    return result;
  } catch (err) {
    throw err;
  }
};

const unSuspendCard = async (cardId: string, email: string) => {
  try {
    const exists = await prisma.card.findFirst({
      where: { id: cardId },
    });

    if (!exists) {
      throw new Error(`Card with id: (${cardId}) does not exists`);
    }

    // check user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user?.userType !== 'Mode') {
      throw new Error(
        `You can't remove suspension form this card! you are not a moderator`,
      );
    }

    const result = await prisma.card.update({
      where: { id: cardId },
      data: { suspended: false },
    });

    if (!result) throw new Error('Some error occurred while UnSuspend card');

    return result;
  } catch (err) {
    throw err;
  }
};

const sendDirectMsg = async (cardId: string, email: string, msg: string) => {
  try {
    // gen a random Id
    const randomId = randomBytes(12).toString('hex');

    const exists = await prisma.card.findFirst({
      where: { id: cardId },
    });

    if (!exists) {
      throw new Error(`Card with id: (${cardId}) does not exists`);
    }

    // check user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user?.userType !== 'Mode') {
      throw new Error(`You can't send msg to card! you are not a moderator`);
    }

    // save msg to database
    const message = await prisma.card.update({
      where: { id: cardId },
      data: {
        directMsgs: {
          push: [{ id: randomId, msg, sender: email }],
        },
      },
    });

    if (!message) throw new Error('Some error occurred while sending message');

    return message.directMsgs;
  } catch (err) {
    throw err;
  }
};

const fetchDirectMsgs = async (cardId: string) => {
  try {
    const exists = await prisma.card.findFirst({
      where: { id: cardId },
    });

    if (!exists) {
      throw new Error(`Card with id: (${cardId}) does not exists`);
    }

    // get all the msgs from db
    const message = await prisma.card.findFirst({
      select: { directMsgs: true },
      where: { id: cardId },
    });

    if (!message)
      throw new Error('Some error occurred while getting all the messages');

    return message;
  } catch (err) {
    throw err;
  }
};

export default {
  createCard,
  fetchCard,
  getPersonalCard,
  deletePersonalCard,
  followCard,
  createArticle,
  updateCard,
  deleteCard,
  flagCard,
  suspendCard,
  fetchArticle,
  sendDirectMsg,
  fetchDirectMsgs,
  unFollowCard,
  unFlagCard,
  unSuspendCard,
};
