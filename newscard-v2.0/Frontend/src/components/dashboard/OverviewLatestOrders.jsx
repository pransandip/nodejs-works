import React, { useState } from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/solid/EllipsisVerticalIcon';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  IconButton,
  MenuItem,
  Popover,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { Scrollbar } from '../ScrollBar';
import { SeverityPill } from '../SeverityPill';
import axios from '../../utils/axios';
import { useNotification } from '../../hooks/useNotification';

const statusMap = {
  pending: 'warning',
  delivered: 'success',
  refunded: 'error',
};

export const OverviewLatestOrders = (props) => {
  const { userList = [], sx, setUpdateUi, updateUi } = props;
  const { displayNotification } = useNotification();

  const [open, setOpen] = useState(null);
  const [userData, setUserData] = useState({ userId: '', role: '' });
  const [loading, setLoading] = useState(false);

  const handleOpenMenu = (event, userData) => {
    setUserData(userData);
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setUserData({ userId: '', role: '' });
  };

  // const handleMarkComplete = () => {
  //   handleCloseMenu();
  //   console.info('MARK COMPLETE');
  // };
  const assignModeratororAdmin = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/user/assign-user-role', userData);
      if (res) {
        if (res.status === 200 && res.data.success === '0') {
          console.log(res.data.message);
          // alert(res.data.message);
          displayNotification({
            message: res?.data?.message,
            type: 'error',
          });
          setLoading(false);
        } else if (res.status === 201 && res.data.success === '1') {
          console.log(res.data.message);
          displayNotification({
            message: res?.data?.message,
            type: 'success',
          });
          handleCloseMenu();
          setUserData({ userId: '', role: '' });
          setLoading(false);
          setUpdateUi(!updateUi);
        } else {
          displayNotification({
            message: res?.data?.message,
            type: 'error',
          });
          setLoading(false);
        }
      } else {
        console.log('error');
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      displayNotification({
        message: err,
        type: 'error',
      });
      setLoading(false);
    }
  };

  const deleteUser = async () => {
    setLoading(true);
    try {
      const res = await axios.delete(`/user/delete-user/${userData?.userId}`);
      if (res.data) {
        if (res.status === 200 && res.data.success === '0') {
          console.log(res.data.message);
          displayNotification({
            message: res?.data?.message,
            type: 'error',
          });
          setLoading(false);
        } else if (res.status === 201 && res.data.success === '1') {
          console.log(res.data.message);
          displayNotification({
            message: res?.data?.message,
            type: 'success',
          });
          handleCloseMenu();
          setUserData({ userId: '', role: '' });
          setUpdateUi(!updateUi);
          setLoading(false);
        } else {
          displayNotification({
            message: res?.data?.message,
            type: 'error',
          });
          setLoading(false);
        }
      } else {
        console.log('Unexpected response:', res);
        displayNotification({
          message: 'Unexpected response from the server',
          type: 'error',
        });
        setLoading(false);
      }
    } catch (err) {
      console.error('Error:', err.message || err.response?.data || err);
      displayNotification({
        message: err.message || 'An error occurred',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    handleCloseMenu();
    console.info('EDIT');
  };

  return (
    <>
      <Card sx={sx}>
        <CardHeader title="Users List" />
        <Scrollbar sx={{ flexGrow: 1 }}>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell sortDirection="desc">Date</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userList?.length > 0 &&
                  userList.map((user) => {
                    const dateInMilliseconds = new Date(
                      user?.createdAt
                    ).getTime();
                    const createdAt = format(dateInMilliseconds, 'dd/MM/yyyy');

                    return (
                      <TableRow hover key={user.id}>
                        <TableCell>{user?.username}</TableCell>
                        <TableCell>
                          {user?.firstname + ' ' + user?.lastname}
                        </TableCell>
                        <TableCell>{createdAt}</TableCell>
                        <TableCell>
                          <SeverityPill color={statusMap['delivered']}>
                            {user?.userType}
                          </SeverityPill>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            edge="end"
                            onClick={(e) =>
                              handleOpenMenu(e, {
                                userId: user?.id,
                                role: 'Mode',
                              })
                            }
                          >
                            <SvgIcon>
                              <EllipsisVerticalIcon />
                            </SvgIcon>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button
            color="inherit"
            endIcon={
              <SvgIcon fontSize="small">
                <ArrowRightIcon />
              </SvgIcon>
            }
            size="small"
            variant="text"
          >
            View all
          </Button>
        </CardActions>
      </Card>
      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => assignModeratororAdmin(userData)}>
          {/* <Iconify icon="eva:checkmark-circle-2-fill" sx={{ mr: 2 }} /> */}
          Assign as Moderator
        </MenuItem>

        <MenuItem onClick={handleEdit}>
          {/* <Iconify icon="solar:pen-bold" sx={{ mr: 2 }} /> */}
          Edit
        </MenuItem>

        <MenuItem onClick={() => deleteUser()} sx={{ color: 'error.main' }}>
          {/* <Iconify icon="solar:trash-bin-trash-bold" sx={{ mr: 2 }} /> */}
          Delete
        </MenuItem>
      </Popover>
    </>
  );
};

OverviewLatestOrders.PropTypes = {
  orders: PropTypes.array,
  sx: PropTypes.object,
};
