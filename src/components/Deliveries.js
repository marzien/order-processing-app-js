import { useState, Fragment } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
import Spinner from './Spinner';

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
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  return (
    <Fragment>
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
          {deliveriesByDate[0]} with {deliveriesByDate[1].length}{' '}
          {deliveriesByDate[1].length > 1 ? 'deliveries' : 'delivery'}
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
    </Fragment>
  );
}

Row.propTypes = {
  deliveriesByDate: PropTypes.array.isRequired,
};

export default function Deliveries({ deliveriesData }) {
  const classes = useStyles();

  return deliveriesData.length > 0 ? (
    <Fragment>
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
    </Fragment>
  ) : (
    <Spinner />
  );
}

Deliveries.propTypes = {
  deliveriesData: PropTypes.any.isRequired,
};
