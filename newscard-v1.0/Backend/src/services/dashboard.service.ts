import { prisma } from '../prisma/prisma.client';

const fetchDashboardDetails = async () => {
  try {
    // Total user and card count
    const users = await prisma.user.findMany({});
    const cards = await prisma.card.findMany({});

    return { totalUsersCount: users.length, totalCardsCount: cards.length };
  } catch (err) {
    throw err;
  }
};

export default { fetchDashboardDetails };
