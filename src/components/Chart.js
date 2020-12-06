import { useState, Fragment, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  useTheme,
  FormControl,
  Select,
  makeStyles,
  MenuItem,
  withStyles,
  InputBase,
} from '@material-ui/core';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import Title from './Title';
import Spinner from './Spinner';

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  fullTitle: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
  },
}));
export default function Chart({ chartData, filterValues, filterChange }) {
  const theme = useTheme();
  const classes = useStyles();

  const [productCategory1, setCategory1] = useState('');
  const [productCategory2, setCategory2] = useState('');
  const [supplier, setSupplier] = useState('');
  const didMountRef = useRef(false);

  const handleCat1Change = (event) => {
    setCategory1(event.target.value);
    didMountRef.current = true;
  };
  const handleCat2Change = (event) => {
    setCategory2(event.target.value);
    didMountRef.current = true;
  };
  const handleSupplierChange = (event) => {
    setSupplier(event.target.value);
    didMountRef.current = true;
  };

  useEffect(() => {
    if (didMountRef.current) {
      filterChange({ productCategory1, productCategory2, supplier });
      didMountRef.current = false;
    } else didMountRef.current = true;
  });

  return chartData.length > 0 && filterValues.length > 0 ? (
    <Fragment>
      <div className={classes.fullTitle}>
        <Title>Total order volume by day</Title>
        <div>
          <FormControl className={classes.margin}>
            <Select
              labelId="category1-label"
              id="category1-select"
              value={productCategory1}
              onChange={handleCat1Change}
              input={<BootstrapInput />}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {filterValues[0].map((filterItem, i) => (
                <MenuItem key={i} value={filterItem}>
                  {filterItem}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.margin}>
            <Select
              labelId="category2-label"
              id="category2-select"
              value={productCategory2}
              onChange={handleCat2Change}
              input={<BootstrapInput />}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {filterValues[1].map((filterItem, i) => (
                <MenuItem key={i} value={filterItem}>
                  {filterItem}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.margin}>
            <Select
              labelId="supplier-label"
              id="supplier-select"
              value={supplier}
              onChange={handleSupplierChange}
              input={<BootstrapInput />}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {filterValues[2].map((filterItem, i) => (
                <MenuItem key={i} value={filterItem}>
                  {filterItem}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <Tooltip
            labelStyle={{ color: theme.palette.background.default }}
            itemStyle={{ color: theme.palette.background.default }}
            formatter={function (value, name) {
              return `${value.toFixed(2)}€`;
            }}
            labelFormatter={function (value) {
              return `Date: ${value}`;
            }}
          />
          <XAxis dataKey="orderedOn" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              Income (€)
            </Label>
          </YAxis>
          <Line
            type="monotone"
            dataKey="income"
            stroke={theme.palette.primary.main}
            dot={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </Fragment>
  ) : (
    <Spinner />
  );
}

Chart.propTypes = {
  chartData: PropTypes.array.isRequired,
  filterValues: PropTypes.array.isRequired,
  filterChange: PropTypes.func.isRequired,
};
