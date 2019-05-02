import React from "react";
import { parse } from "date-fns";
// import { ResponsiveContainer } from "recharts";
import useDimensions from "react-use-dimensions";

import chartData from "./stock-data.tsv";
import StockChart from "./StockChart";

const StockChartMock = props => {
  const [ref, { width, height }] = useDimensions();
  const data = chartData.map(row => ({ ...row, date: parse(row.date) }));

  return (
    <div ref={ref} style={{ width: "100%", height: "calc(100vh - 70px)" }}>
      {!isNaN(width) && !isNaN(height) && (
        <StockChart data={data} width={width} height={height} {...props} />
      )}
    </div>
  );
};

export default StockChartMock;
