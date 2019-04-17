import React from "react";
import { Table } from "semantic-ui-react";

const genData = () => {
  let data = [];

  for (let i = 0; i < 17; i++) {
    data.push([
      `SOURCE ${i}`,
      `${(Math.random() * 0.5 - 0.25).toFixed(2)}`,
      `${(Math.random() * 50 + 25).toFixed(3)}`,
      `${(Math.random() * 150 + 60).toFixed(3)}`
    ]);
  }

  return data;
};

const renderBodyRow = (cells, i) => ({
  key: cells[0],
  cells
});

const SourceTable = props => {
  const tableData = genData();
  return (
    <Table
      compact
      headerRow={["SYMBOL", "+/-", "BID", "ASK"]}
      renderBodyRow={renderBodyRow}
      tableData={tableData}
      {...props}
    />
  );
};

export default SourceTable;
