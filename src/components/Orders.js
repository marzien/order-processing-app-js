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

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
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

  return (
    <React.Fragment>
      <Title>TOP Orders</Title>
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
              <TableCell>{row.productId}</TableCell>
              <TableCell>{orderRow(row)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label="gender"
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
    </React.Fragment>
  );
}

Orders.propTypes = {
  bestOrders: PropTypes.array.isRequired,
  topChartDataType: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
