import React, { useState } from 'react';
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

export default function SuppliersRank({ suppliersData }) {
  const [byValue, setTableType] = useState(false);
  const classes = useStyles();
  let caption;

  byValue
    ? (caption = <TableCell>Quantity (pcs)</TableCell>)
    : (caption = <TableCell>Value (€)</TableCell>);

  const supplierRow = (row) => {
    if (byValue) {
      return row.quantity;
    } else {
      return row.purchasingVolume.toFixed(2);
    }
  };

  return (
    <React.Fragment>
      <Title>Suppliers rank</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Supplier</TableCell>
            {caption}
          </TableRow>
        </TableHead>
        <TableBody>
          {suppliersData.map((row) => (
            <TableRow key={row.supplier}>
              <TableCell>{row.supplier}</TableCell>
              <TableCell>{supplierRow(row)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label="suppliers"
              name="suppliers"
              value={byValue}
              onChange={(event) => setTableType(event.target.value === 'true')}
            >
              <FormControlLabel
                value={false}
                control={<Radio />}
                label="By value"
                labelPlacement="end"
              />
              <FormControlLabel
                value={true}
                control={<Radio />}
                label="By quantity"
                labelPlacement="end"
              />
            </RadioGroup>
          </FormControl>
        </Link>
      </div>
    </React.Fragment>
  );
}

SuppliersRank.propTypes = {
  suppliersData: PropTypes.any.isRequired,
};
