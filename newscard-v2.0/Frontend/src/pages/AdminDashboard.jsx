import React, { useEffect, useState } from 'react';
import { subDays, subHours } from 'date-fns';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import image1 from '../images/avatars/image-juliusomo.png';
import image2 from '../images/avatars/image-amyrobson.png';

import {
  OverviewBudget,
  OverviewLatestOrders,
  OverviewLatestProducts,
  OverviewSales,
  OverviewTasksProgress,
  OverviewTotalCustomers,
  OverviewTotalProfit,
  OverviewTraffic,
} from '../components/dashboard';
import { fetchDataApi } from '../api/services/fetchdata.service';

const now = new Date();

const AdminDashboard = () => {
  const [totalData, setTotalData] = useState({
    totalUsersCount: 0,
    totalCardsCount: 0,
  });

  const [userList, setUserList] = useState([]);
  const [updateUi, setUpdateUi] = useState(false);

  const getDashboardDetails = async () => {
    const res = await fetchDataApi('/dashboard/fetch-details');
    res && res?.data && setTotalData(res?.data);
  };

  const getUserList = async () => {
    const res = await fetchDataApi('/user/fetch-users-list');
    res && res?.data && setUserList(res?.data);
  };
  useEffect(() => {
    getDashboardDetails();
    getUserList();
  }, []);

  useEffect(() => {
    getUserList();
  }, [updateUi]);

  console.log('userList', userList);
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
        marginTop: 3,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid xs={12} sm={6} lg={3}>
            <OverviewBudget
              difference={12}
              positive
              sx={{ height: '100%' }}
              value={totalData?.totalCardsCount}
            />
          </Grid>
          <Grid xs={12} sm={6} lg={3}>
            <OverviewTotalCustomers
              difference={16}
              positive={false}
              sx={{ height: '100%' }}
              value={totalData?.totalUsersCount}
            />
          </Grid>
          <Grid xs={12} sm={6} lg={3}>
            <OverviewTasksProgress sx={{ height: '100%' }} value={75.5} />
          </Grid>
          <Grid xs={12} sm={6} lg={3}>
            <OverviewTotalProfit sx={{ height: '100%' }} value="$15k" />
          </Grid>
          <Grid xs={12} lg={8}>
            <OverviewSales
              chartSeries={[
                {
                  name: 'This year',
                  data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20],
                },
                {
                  name: 'Last year',
                  data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13],
                },
              ]}
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid xs={12} md={6} lg={4}>
            <OverviewTraffic
              chartSeries={[48, 30, 15, 7]}
              labels={['America', 'Asia', 'Europe', 'Africa']}
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid xs={12} md={6} lg={4}>
            <OverviewLatestProducts
              products={[
                {
                  id: '5ece2c077e39da27658aa8a9',
                  image: image1,
                  name: 'Ekaterina Tankova',
                  updatedAt: subHours(now, 6).getTime(),
                },
                {
                  id: '5ece2c0d16f70bff2cf86cd8',
                  image: image2,
                  name: 'Alexa Richardson',
                  updatedAt: subDays(subHours(now, 8), 2).getTime(),
                },
                {
                  id: 'b393ce1b09c1254c3a92c827',
                  image: image1,
                  name: 'Clarke Gillebert',
                  updatedAt: subDays(subHours(now, 1), 1).getTime(),
                },
                {
                  id: 'a6ede15670da63f49f752c89',
                  image: image2,
                  name: 'Ekaterina Tankova',
                  updatedAt: subDays(subHours(now, 3), 3).getTime(),
                },
                {
                  id: 'bcad5524fe3a2f8f8620ceda',
                  image: image1,
                  name: 'Alexa Richardson',
                  updatedAt: subDays(subHours(now, 5), 6).getTime(),
                },
              ]}
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid xs={12} md={12} lg={8}>
            <OverviewLatestOrders
              userList={userList}
              sx={{ height: '100%' }}
              setUpdateUi={setUpdateUi}
              updateUi={updateUi}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
