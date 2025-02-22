import { useState, useEffect } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import {
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Container,
  Grid,
  Paper,
  Link,
  Badge,
  Box,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { mainListItems, secondaryListItems } from './listItems';
import { lightBlue, deepOrange } from '@material-ui/core/colors';
import Chart from './Chart';
import Orders from './Orders';
import Deliveries from './Deliveries';
import RankChart from './RankChart';

import {
  unstable_createMuiStrictModeTheme as createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mariusdev.tech/">
        Marius Zienius
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;
const dateFormat = 'DD/MM/YYYY';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 270,
  },
}));

export default function Dashboard() {
  const [open, setOpen] = useState(true);
  const palletType = 'dark';
  const mainPrimaryColor = lightBlue[300];
  const mainSecondaryColor = deepOrange[900];
  const darkTheme = createMuiTheme({
    palette: {
      type: palletType,
      primary: {
        main: mainPrimaryColor,
      },
      secondary: {
        main: mainSecondaryColor,
      },
    },
  });
  const classes = useStyles();

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const [topProductByQuantityData, setTopProductByQuantity] = useState([]);
  const [topProductByIncomeData, setTopProductByIncome] = useState([]);
  const [topChartDataType, setChartDataType] = useState('byIncome');
  const [orderVolumeByDayData, setOrderVolumeByDay] = useState([]);
  const [filterValues, setFilterValues] = useState([]);
  const [filterType, setFilterOptions] = useState({});
  const [rankSuppliersData, setSuppliersRank] = useState([]);
  const [deliveriesData, setDeliveries] = useState([]);

  function handleTopChartChange(newValue) {
    setChartDataType(newValue);
  }

  function handleFilterChange(newValue) {
    setFilterOptions(newValue);
  }

  useEffect(() => {
    fetch('/api/orders.json')
      .then((response) => response.json())
      .then((data) => {
        setTopProductByQuantity(calculateProductQuantity(data));
        setTopProductByIncome(calculateProductIncome(data));
        setOrderVolumeByDay(calculateOrderVolumeByDay(data));
        setFilterValues(calculateFilterValues(data));
        setSuppliersRank(calculateSuppliersRank(data));
        setDeliveries(calculateDeliveries(data));
      })
      .catch((error) => console.log(error));
  }, [
    filterType.productCategory1,
    filterType.productCategory2,
    filterType.supplier,
  ]);

  const calculateProductQuantity = (data) => {
    const productObj = {};
    const productSumQuantityArray = [];

    data.map((item) => {
      if (productObj[item.productId]) {
        productObj[item.productId].quantity += parseInt(item.quantity);
        productObj[item.productId].productName = item.productName;
      } else {
        productObj[item.productId] = {
          quantity: parseInt(item.quantity),
          productName: item.productName,
        };
      }
      return 0;
    });

    Object.keys(productObj).map((item) => {
      productSumQuantityArray.push({
        productId: item,
        quantity: productObj[item].quantity,
        productName: productObj[item].productName,
      });
      return 0;
    });

    return productSumQuantityArray
      .sort((a, b) => (a.quantity < b.quantity ? 1 : -1))
      .slice(0, 3);
  };

  const calculateProductIncome = (data) => {
    const productObj = {};
    const productSumIncomeArray = [];

    data.map((item) => {
      if (productObj[item.productId]) {
        productObj[item.productId].quantity += parseInt(item.quantity);
        productObj[item.productId].price = parseFloat(
          item.price.replace(/,/g, '')
        );
        productObj[item.productId].productName = item.productName;
      } else {
        productObj[item.productId] = {
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price.replace(/,/g, '')),
          productName: item.productName,
        };
      }
      return 0;
    });

    Object.keys(productObj).map((item) => {
      productSumIncomeArray.push({
        productId: item,
        income: productObj[item].quantity * productObj[item].price,
        productName: productObj[item].productName,
      });
      return 0;
    });

    return productSumIncomeArray
      .sort((a, b) => (a.income < b.income ? 1 : -1))
      .slice(0, 3);
  };

  const calculateOrderVolumeByDay = (data) => {
    const orderObj = {};
    const orderVolumeByDayArray = [];

    function filter(arr, criteria) {
      return arr.filter(function (obj) {
        return Object.keys(criteria).every(function (c) {
          if (!isNaN(parseFloat(obj[c])) && isFinite(obj[c])) {
            return obj[c] == criteria[c];
          } else {
            return new RegExp('' + criteria[c] + '', 'i').test(obj[c]);
          }
        });
      });
    }

    let filteredData = filter(data, filterType);

    // TODO need refactor when where is filtered data
    const orderVolumeByDay = (selectedData) => {
      selectedData.map((item) => {
        if (orderObj[item.orderedOn]) {
          orderObj[item.orderedOn].quantity += parseInt(item.quantity);
          orderObj[item.orderedOn].price = parseFloat(
            item.price.replace(/,/g, '')
          );
        } else {
          orderObj[item.orderedOn] = {
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price.replace(/,/g, '')),
          };
        }
        return 0;
      });

      Object.keys(orderObj).map((item) => {
        orderVolumeByDayArray.push({
          orderedOn: item,
          income: orderObj[item].quantity * orderObj[item].price,
        });
        return 0;
      });

      return orderVolumeByDayArray.sort((d1, d2) =>
        moment(d1.orderedOn, dateFormat) > moment(d2.orderedOn, dateFormat)
          ? 1
          : -1
      );
    };

    if (filteredData.length > 0) {
      return orderVolumeByDay(filteredData);
    } else {
      alert('No results found! Showing all data.');
      return orderVolumeByDay(data);
    }
  };

  const calculateFilterValues = (data) => {
    return [
      [...new Set(data.map((order) => order.productCategory1))],
      [...new Set(data.map((order) => order.productCategory2))],
      [...new Set(data.map((order) => order.supplier))],
    ];
  };

  const calculateSuppliersRank = (data) => {
    const supplierObj = {};
    const suppliersRankArray = [];

    data.map((item) => {
      let purchasingVolume =
        parseInt(item.quantity) * parseFloat(item.price.replace(/,/g, ''));
      if (supplierObj[item.supplier]) {
        supplierObj[item.supplier].price = parseFloat(
          item.price.replace(/,/g, '')
        );
        supplierObj[item.supplier].supplierQuantity += parseInt(item.quantity);
        supplierObj[item.supplier].purchasesVolume += purchasingVolume;
      } else {
        supplierObj[item.supplier] = {
          price: parseFloat(item.price.replace(/,/g, '')),
          supplierQuantity: parseInt(item.quantity),
          purchasesVolume: purchasingVolume,
        };
      }
      return 0;
    });

    Object.keys(supplierObj).map((item) => {
      suppliersRankArray.push({
        supplier: item,
        quantity: supplierObj[item].supplierQuantity,
        purchasingVolume: supplierObj[item].purchasesVolume,
      });
      return 0;
    });

    return suppliersRankArray;
  };

  const calculateDeliveries = (data) => {
    data = data.sort((d1, d2) =>
      moment(d1.deliveryDate, dateFormat) < moment(d2.deliveryDate, dateFormat)
        ? 1
        : -1
    );

    const groupedMap = data.reduce(
      (entryMap, e) =>
        entryMap.set(e.deliveryDate, [
          ...(entryMap.get(e.deliveryDate) || []),
          e,
        ]),
      new Map()
    );

    return Array.from(groupedMap.entries());
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="absolute"
          className={clsx(classes.appBar, open && classes.appBarShift)}
        >
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(
                classes.menuButton,
                open && classes.menuButtonHidden
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              Dashboard
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>{mainListItems}</List>
          <Divider />
          <List>{secondaryListItems}</List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
              {/* 3 top products table */}
              <Grid item xs={12} md={6}>
                <Paper className={fixedHeightPaper}>
                  <Orders
                    topChartDataType={topChartDataType}
                    onChange={handleTopChartChange}
                    bestOrders={
                      topChartDataType === 'byIncome'
                        ? topProductByIncomeData
                        : topProductByQuantityData
                    }
                  />
                </Paper>
              </Grid>
              {/* Suppliers rank chart */}
              <Grid item xs={12} md={6}>
                <Paper className={fixedHeightPaper}>
                  <RankChart chartData={rankSuppliersData} />
                </Paper>
              </Grid>
              {/* Order value by day chart */}
              <Grid item xs={12}>
                {filterType.length > 0 &&
                  `Filtering by: ${filterType} not working`}
                <Paper className={fixedHeightPaper}>
                  <Chart
                    chartData={orderVolumeByDayData}
                    filterValues={filterValues}
                    filterChange={handleFilterChange}
                  />
                </Paper>
              </Grid>
              {/* List of deliveries */}
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Deliveries deliveriesData={deliveriesData} />
                </Paper>
              </Grid>
            </Grid>
            <Box pt={4}>
              <Copyright />
            </Box>
          </Container>
        </main>
      </div>
    </ThemeProvider>
  );
}
