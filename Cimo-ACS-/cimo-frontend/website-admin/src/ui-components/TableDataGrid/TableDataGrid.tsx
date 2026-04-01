import React from 'react';
import { Table, Button } from 'antd';
import { ColumnsType } from 'antd/es/table';

interface TableDataGridProps<T> {
  columns: ColumnsType<T>;
  dataSource: T[];
}

const TableDataGrid = <T extends object>({ columns, dataSource }: TableDataGridProps<T>) => {
  return <Table columns={columns} dataSource={dataSource} rowKey="id" pagination={{ pageSize: 5 }} bordered />;
};

export default TableDataGrid;
