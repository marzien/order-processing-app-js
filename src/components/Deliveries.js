import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Link,
  makeStyles,
  IconButton,
  TableContainer,
  Paper,
  Collapse,
  Box,
} from '@material-ui/core';
import Title from './Title';
import PropTypes from 'prop-types';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
}));

function Row(props) {
  const { deliveriesByDate } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {deliveriesByDate[0]}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Supplier</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total income (€)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deliveriesByDate[1].map((deliveries, d) => (
                    <TableRow key={d}>
                      <TableCell component="th" scope="deliveries">
                        {deliveries.supplier}
                      </TableCell>
                      <TableCell>{deliveries.productName}</TableCell>
                      <TableCell align="right">{deliveries.quantity}</TableCell>
                      <TableCell align="right">
                        {(deliveries.price * deliveries.quantity).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  deliveriesByDate: PropTypes.array.isRequired,
};

export default function Deliveries({ deliveriesData }) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Title className={classes.seeMore}>Deliveries by day</Title>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableBody>
            {deliveriesData.map((deliveriesByDate, d) => (
              <Row key={d} deliveriesByDate={deliveriesByDate} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
}

Deliveries.propTypes = {
  deliveriesData: PropTypes.any.isRequired,
};
