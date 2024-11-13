import bcrypt from 'bcrypt';
import config from '../config/default';
import { prisma } from '../prisma/prisma.client';
import { checkPassword } from '../utils/utility.function';

const followUser = async (userEmail: string, email: string) => {
  try {
    // check user
    const exists = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    // user not present
    if (!exists) throw new Error('User not found');

    // following
    if (exists.followers.includes(email)) {
      throw new Error(`You are already following this user`);
    }

    // follow user
    const followed = await prisma.user.update({
      where: {
        email: userEmail,
      },
      data: { followers: { push: email } },
    });

    // If not followed
    if (!followed) {
      throw new Error('some issue occurred, while following user');
    }

    // update user about followed user
    const updateUser = await prisma.user.update({
      where: { email },
      data: { following: { push: userEmail } },
    });

    // If not saved
    if (!updateUser) {
      throw new Error('some issue occurred, while saving user info to db');
    }

    return followed;
  } catch (err) {
    throw err;
  }
};

const unFollowUser = async (userEmail: string, email: string) => {
  try {
    // check user
    const exists = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    // user not present
    if (!exists) throw new Error('User not found');

    // following
    if (!exists.followers.includes(email)) {
      throw new Error(`you have to follow this user first`);
    }

    // follow user
    const followed = await prisma.user.update({
      where: {
        email: userEmail,
      },
      data: {
        followers: { set: exists.followers.filter(items => items !== email) },
      },
    });

    // If not followed
    if (!followed) {
      throw new Error('some issue occurred, while un-following user');
    }

    // check user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // update user about followed user
    const updateUser = await prisma.user.update({
      where: { email },
      data: {
        following: {
          set: user?.following.filter(items => items !== userEmail),
        },
      },
    });

    // If not saved
    if (!updateUser) {
      throw new Error('some issue occurred, while removing user info to db');
    }

    return followed;
  } catch (err) {
    throw err;
  }
};

const updateUser = async (userDetails: any) => {
  try {
    let {
      email,
      image,
      phone,
      newEmail,
      currentPassword,
      newPassword,
      userType,
    } = userDetails;
    const imgURL =
      `${image}` === 'undefined'
        ? undefined
        : `${config.BASE_URL}/upload/${image}`;

    const exists = await prisma.user.findFirst({
      where: { email },
    });

    if (!exists) {
      throw new Error(`User does not exists`);
    }

    if (currentPassword && newPassword) {
      // check password
      const same = await checkPassword(currentPassword, exists.password);

      if (!same) {
        throw new Error('Please provide correct current password');
      }

      // Password hashed
      const hash = await bcrypt.hash(newPassword, config.saltworkFactor);

      // update user
      const updateUser = await prisma.user.update({
        where: { email },
        data: {
          email: newEmail,
          phone,
          userType,
          image: imgURL,
          password: hash,
        },
      });

      // if user not updated
      if (!updateUser) {
        throw new Error('Some issue occurred while updating user');
      }

      return updateUser;
    }

    // update user
    const updateUser = await prisma.user.update({
      where: { email },
      data: {
        email: newEmail,
        phone,
        userType,
        image: imgURL,
      },
    });

    // if user not updated
    if (!updateUser) {
      throw new Error('Some issue occurred while updating user');
    }

    return updateUser;
  } catch (err) {
    throw err;
  }
};

const fetchUsers = async () => {
  try {
    //  fetch All user
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        phone: true,
        image: true,
        bio: true,
        link: true,
        city: true,
        firstname: true,
        lastname: true,
        updatedAt: true,
        followers: true,
        following: true,
        followingCards: true,
        userType: true,
        createdAt: true,
      },
    });

    // users not present
    if (!users) throw new Error('Users not found');

    return users;
  } catch (err) {
    throw err;
  }
};

const fetchUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        phone: true,
        image: true,
        bio: true,
        link: true,
        city: true,
        firstname: true,
        lastname: true,
        updatedAt: true,
        followers: true,
        following: true,
        followingCards: true,
        userType: true,
        createdAt: true,
      },
      where: { email },
    });

    // users not present
    if (!user) throw new Error('Users not found');

    return user;
  } catch (err) {
    throw err;
  }
};
 
const fetchConnectedUsersByEmail = async (emails: string[]) => {
  try {
    const user = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        phone: true,
        image: true,
        bio: true,
        link: true,
        city: true,
        firstname: true,
        lastname: true,
        updatedAt: true,
        followers: true,
        following: true,
        followingCards: true,
        userType: true,
        createdAt: true,
        chatNotifications:true,
      },
      where: {
        email: {
          in: emails,
        },
      },
    });
 
    // users not present
    if (!user) throw new Error('Users not found');
 
    return user;
  } catch (err) {
    throw err;
  }
};
 
const fetchFollowers = async (email: string) => {
  try {
    const user = await prisma.user.findMany({
      select: {
        followers: true,
      },
      where: { email },
    });
 
    // users not present
    if (!user) throw new Error('Users not found');
 
    return user;
  } catch (err) {
    throw err;
  }
};
 
const fetchFollowings = async (email: string) => {
  try {
    const user = await prisma.user.findMany({
      select: {
        following: true,
      },
      where: { email },
    });
 
    // users not present
    if (!user) throw new Error('Users not found');
 
    return user;
  } catch (err) {
    throw err;
  }
};

const deleteUser = async (userId: string, email: string) => {
  try {
    const exists = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!exists) {
      throw new Error(`User with id: (${userId}) does not exists`);
    }

    // check user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user?.userType !== 'Admin') {
      throw new Error(`You can't delete this User! you are not an Admin`);
    }

    // deleting user
    const result = await prisma.user.delete({ where: { id: userId } });
    if (!result) throw new Error('Some error occurred while deleting user');

    return result;
  } catch (err) {
    throw err;
  }
};

const assignUserRole = async (
  userId: string,
  email: string,
  role: 'Mode' | 'Admin',
) => {
  try {
    const exists = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!exists) {
      throw new Error(`User with id: (${userId}) does not exists`);
    }

    // check user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user?.userType === 'Admin') {
      if (role !== 'Mode') {
        throw new Error(`Admin can't assign role other than Mode`);
      }

      // update role of user
      const user = await prisma.user.update({
        where: { id: userId },
        data: { userType: 'Mode' },
      });

      return user;
    } else if (user?.userType === 'SuperAdmin') {
      if (role !== 'Admin') {
        throw new Error(`SuperAdmin can't assign role other than Admin`);
      }

      // update role of user
      const user = await prisma.user.update({
        where: { id: userId },
        data: { userType: 'Admin' },
      });

      return user;
    } else {
      throw new Error(
        `You can't assign any role you are not an Admin or SuperAdmin`,
      );
    }
  } catch (err) {
    throw err;
  }
};

export default {
  followUser,
  updateUser,
  fetchUsers,
  deleteUser,
  assignUserRole,
  unFollowUser,
  fetchUserByEmail,
  fetchConnectedUsersByEmail,
  fetchFollowers,
  fetchFollowings
};
