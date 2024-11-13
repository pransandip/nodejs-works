import { useSelector } from 'react-redux';
import {
  CardPage,
  CreateCard,
  AdminDashboard,
  MainPage,
  CardList,
  ChatSection,
  Posts,
  PostDetails,
  Quiz,
} from '../pages';

export const route = [
  {
    name: 'CardPage',
    path: '/cards/:id',
    components: CardPage,
  },
  {
    name: 'CreateCard',
    path: '/createcard',
    components: CreateCard,
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    components: AdminDashboard,
  },
  {
    name: 'MainPage',
    path: '/mainpage',
    components: MainPage,
  },
  {
    name: 'CardList',
    path: '/cardlist',
    components: CardList,
  },
  {
    name: 'ChatSection',
    path: '/chatsection',
    components: ChatSection,
  },
  {
    name: 'Posts',
    path: '/posts',
    components: Posts,
  },
  {
    name: 'PostDetails',
    path: '/post/:index',
    components: PostDetails,
  },
  {
    name: 'Quiz',
    path: '/quiz',
    components: Quiz,
  },
];
