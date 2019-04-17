import React, { useState, useEffect } from "react";
import { format, addMinutes } from "date-fns";
import { LineChart } from "recharts";

const MarketChart = props => {
  const data = [];
  let t = new Date();
  for (let i = 0; i < 300; i++, t = addMinutes(t, 1)) {
    data.push({
      time: t,
      value: 3.7 + Math.random() * 0.4
    });
  }
  return (
    <LineChart
      data={data}
      margin={{ top: 0, left: 0, bottom: 0, right: 0 }}
      {...props}
      tickFormatter={value => format(value, "H:mm")}
    />
  );
};

export default MarketChart;
