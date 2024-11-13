import * as React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import { AppBar, Tabs, Tab, Typography, Box, Tooltip } from '@mui/material';
import {
  Delete,
  Message,
  NoSim,
  SignalCellular1Bar,
  TurnedIn,
  TurnedInNot,
} from '@mui/icons-material';
import CustomTextArea from './CustomTextArea';
import { LoadingButton } from '@mui/lab';
import { useNotification } from '../hooks/useNotification';
import axios from '../utils/axios';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const CustomTab = ({ cardId, cardDetails, postID }) => {
  const { displayNotification } = useNotification();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [isFlagged, setIsFlagged] = React.useState(false);
  const [isSuspended, setIsSuspended] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [reasons, setReasons] = React.useState({
    flag: '',
    suspend: '',
    delete: '',
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const unFlagCard = async (cardId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/card/un-flaged-card/${cardId}`);
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
          setIsFlagged(false);
          setLoading(false);
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

  const unSuspendCard = async (cardId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/card/un-suspend-card/${cardId}`);
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
          setIsSuspended(false);
          setLoading(false);
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

  const handleChangeIndex = (index) => {
    setValue(index);
  };
  console.log('reason', reasons);

  React.useEffect(() => {
    if (cardDetails?.flaged) {
      setIsFlagged(true);
      setReasons((prev) => ({ ...prev, flag: 'This card is flagged' }));
    }
    if (cardDetails?.suspended) {
      setIsSuspended(true);
      setReasons((prev) => ({ ...prev, suspend: 'This card is suspended' }));
    }
  }, []);

  return (
    <Box sx={{ bgcolor: 'background.paper' }}>
      <AppBar position="static" style={{ backgroundColor: '#ccc' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="secondary"
          aria-label="full width tabs example"
        >
          <Tab
            {...a11yProps(0)}
            label={
              <Tooltip title="Flag Card" placement="top">
                <TurnedIn />
              </Tooltip>
            }
          />

          <Tab
            label={
              <Tooltip title="Suspend Card" placement="top">
                <NoSim />
              </Tooltip>
            }
            {...a11yProps(1)}
          />
          <Tab
            label={
              <Tooltip title="Delete card" placement="top">
                <Delete />
              </Tooltip>
            }
            {...a11yProps(2)}
          />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          {!isFlagged ? (
            <CustomTextArea
              setReasons={setReasons}
              value={value}
              cardId={cardId}
              setIsFlagged={setIsFlagged}
            />
          ) : (
            <Box display="flex" justifyContent="space-between">
              <Typography variant="subtitle1">{reasons?.flag}</Typography>
              <LoadingButton
                sx={{ ml: 'auto' }}
                loading={loading}
                variant="contained"
                size="small"
                color="secondary"
                style={{
                  borderRadius: '20px',
                  textTransform: 'none',
                  ml: 'auto',
                }}
                onClick={() => unFlagCard(cardId)}
              >
                <Typography variant="caption">Unflag</Typography>
              </LoadingButton>
            </Box>
          )}
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          {!isSuspended ? (
            <CustomTextArea
              setReasons={setReasons}
              value={value}
              cardId={cardId}
              setIsSuspended={setIsSuspended}
            />
          ) : (
            <Box display="flex" justifyContent="space-between">
              <Typography variant="subtitle1">{reasons?.suspend}</Typography>
              <LoadingButton
                sx={{ ml: 'auto' }}
                loading={loading}
                variant="contained"
                size="small"
                color="secondary"
                style={{
                  borderRadius: '20px',
                  textTransform: 'none',
                  ml: 'auto',
                }}
                onClick={() => unSuspendCard(cardId)}
              >
                <Typography variant="caption">Unsuspend</Typography>
              </LoadingButton>
            </Box>
          )}
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <CustomTextArea
            setReasons={setReasons}
            value={value}
            cardId={cardId}
          />
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
};
export default CustomTab;
