import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import Title from './Title';
import PropTypes from 'prop-types';
import Loader from './Loader';

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  fullTitle: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
  },
}));

export default function Orders({ bestOrders, topChartDataType, onChange }) {
  const classes = useStyles();
  let caption;

  topChartDataType === 'byIncome'
    ? (caption = <TableCell>Income (€)</TableCell>)
    : (caption = <TableCell>Quantity (pcs)</TableCell>);
  const orderRow = (row) => {
    if (!!row.income) {
      return row.income.toFixed(2);
    } else if (!!row.quantity) {
      return row.quantity;
    }
  };

  function handleChange(event) {
    onChange(event.target.value);
  }

  return bestOrders.length > 0 ? (
    <React.Fragment>
      <div className={classes.fullTitle}>
        <Title>TOP Orders</Title>
        <div>
          <Link color="primary" href="#" onClick={preventDefault}>
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="orders"
                name="orders"
                value={topChartDataType}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="byIncome"
                  control={<Radio />}
                  label="By income"
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="byOrders"
                  control={<Radio />}
                  label="By orders"
                  labelPlacement="end"
                />
              </RadioGroup>
            </FormControl>
          </Link>
        </div>
      </div>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Product Name</TableCell>
            {caption}
          </TableRow>
        </TableHead>
        <TableBody>
          {bestOrders.map((row) => (
            <TableRow key={row.productId}>
              <TableCell>{row.productName}</TableCell>
              <TableCell>{orderRow(row)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  ) : (
    <Loader />
  );
}

Orders.propTypes = {
  bestOrders: PropTypes.array.isRequired,
  topChartDataType: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
