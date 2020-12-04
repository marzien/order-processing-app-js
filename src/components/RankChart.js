import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
import {
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  Link,
  makeStyles,
} from '@material-ui/core';
import Title from './Title';
import Loader from './Loader';

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  fullTitle: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

export default function RankChart({ chartData }) {
  const [byValue, setTableType] = useState(false);
  const theme = useTheme();
  const classes = useStyles();
  let caption;
  let barValue;

  if (byValue) {
    caption = 'Quantity (pcs)';
    barValue = 'quantity';
  } else {
    caption = 'Value (€)';
    barValue = 'purchasingVolume';
  }

  return chartData.length > 0 ? (
    <React.Fragment>
      <div className={classes.fullTitle}>
        <Title>Suppliers rank</Title>
        <div>
          <Link color="primary" href="#" onClick={preventDefault}>
            <FormControl component="rank-chart">
              <RadioGroup
                row
                aria-label="suppliers"
                name="suppliers"
                value={byValue}
                onChange={(event) =>
                  setTableType(event.target.value === 'true')
                }
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
      </div>
      <ResponsiveContainer>
        <BarChart
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
              return `Supplier: ${value}`;
            }}
          />
          <XAxis dataKey="supplier" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              {caption}
            </Label>
          </YAxis>
          <Bar
            type="monotone"
            dataKey={barValue}
            stroke={theme.palette.primary.main}
            fill={theme.palette.primary.main}
            dot={true}
          />
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  ) : (
    <Loader />
  );
}

RankChart.propTypes = {
  chartData: PropTypes.array.isRequired,
};
