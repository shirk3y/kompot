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

const renderHeaderRow = (columns, sortBy = "SYMBOL") => (
  <Table.Row>
    {columns.map(column => (
      <Table.HeaderCell sorted={column === sortBy ? "ascending" : undefined}>
        {column}
      </Table.HeaderCell>
    ))}
  </Table.Row>
);

const renderBodyRow = (cells, i) => ({
  key: cells[0],
  cells
});

const SourceTable = props => {
  const headerRow = renderHeaderRow(["SYMBOL", "+/-", "BID", "ASK"]);
  const tableData = genData();
  return (
    <Table
      compact
      headerRow={headerRow}
      renderBodyRow={renderBodyRow}
      tableData={tableData}
      {...props}
    />
  );
};

export default SourceTable;
