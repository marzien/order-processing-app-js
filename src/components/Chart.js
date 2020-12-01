import React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@material-ui/core/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import Title from "./Title";
export default function Chart({ chartData }) {
  const theme = useTheme();
  return(
    <React.Fragment>
      <Title>Total order volume by day</Title>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24
          }}
        >
          <Tooltip
            labelStyle={{ color: theme.palette.background.default }}
            itemStyle={{ color: theme.palette.background.default }}
            formatter={function(value, name) {
              return `${value.toFixed(2)}€`;
            }}
            labelFormatter={function(value) {
              return `Date: ${value}`;
            }}
          />
          <XAxis dataKey="orderedOn" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: "middle", fill: theme.palette.text.primary }}
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
    </React.Fragment>
  );
}

Chart.propTypes = {
  chartData: PropTypes.array.isRequired,
  // chartDataType: PropTypes.string.isRequired,
}