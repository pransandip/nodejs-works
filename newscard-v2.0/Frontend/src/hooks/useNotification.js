import { useDispatch } from 'react-redux';
import { NotificationActions } from '../redux/reducers/notificationSlice';
export const useNotification = () => {
  const dispatch = useDispatch();
  const displayNotification = (notification) => {
    dispatch(NotificationActions.addNotification(notification));
  };
  const clearNotification = () => {
    dispatch(NotificationActions.clearNotification());
  };
  return { displayNotification, clearNotification };
};
