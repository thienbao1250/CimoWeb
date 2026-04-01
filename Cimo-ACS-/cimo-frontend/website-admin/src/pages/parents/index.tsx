import React from 'react';
import { Button, Popconfirm, Input } from 'antd';
import { ColumnsType } from 'antd/es/table';
import IParents from 'types/parents';
import parentService from 'service/apis/parentService';
import TableDataGrid from 'ui-components/TableDataGrid/TableDataGrid';
import ModalForm from 'ui-components/ModalForm/ModalForm';
import { useCrud } from 'hooks/useCrud';

const { Search } = Input;

const parentValidationRules = [
  { field: 'name', required: true },
  { field: 'dob', required: true, type: 'string' as const },
  { field: 'phone', required: true, minLength: 10 },
  { field: 'email', required: true, custom: (value) => value.includes('@') || 'Email không hợp lệ.' },
  { field: 'address', required: true },
  { field: 'job', required: true },
  { field: 'gender', required: true, type: 'boolean' as const },
  { field: 'nationalId', required: true, minLength: 12 },
];

const ParentPage = () => {
  const { list: listParent, open, selectedItem: selectedParent, setSelectedItem: setSelectedParent, isAdding, handleOpen, handleClose, addOrUpdateItem, deleteItem, onSearch, searchTerm } = useCrud<IParents>(parentService, parentValidationRules);

  const columns: ColumnsType<IParents> = [
    {
      title: 'STT',
      dataIndex: 'id',
      render: (_: any, __: IParents, index: number) => index + 1,
    },
    { title: 'Họ và Tên', dataIndex: 'name' },
    { title: 'Ngày sinh', dataIndex: 'dob' },
    { title: 'Số điện thoại', dataIndex: 'phone' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Giới tính', dataIndex: 'gender', render: (gender: boolean) => (gender ? 'Nữ' : 'Nam') },
    { title: 'Địa chỉ', dataIndex: 'address' },
    { title: 'CCCD', dataIndex: 'nationalId' },
    { title: 'Nghề nghiệp', dataIndex: 'job' },
    {
      title: 'Actions',
      render: (_: any, parent: IParents) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button type="default" onClick={() => handleOpen(parent)}>
            Edit
          </Button>
          <Popconfirm title="Bạn có chắc muốn xóa phụ huynh này?" onConfirm={() => deleteItem(parent)} okText="Yes" cancelText="No">
            <Button type="default" danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <Button type="primary" style={{ marginBottom: '10px' }} onClick={() => handleOpen()}>
          Thêm phụ huynh
        </Button>
        <Search placeholder="Tìm kiếm" onSearch={onSearch} style={{ width: 200 }} />
      </div>

      <TableDataGrid columns={columns} dataSource={listParent.filter((parent) => parent.name.toLowerCase().includes(searchTerm))} />

      <ModalForm
        open={open}
        title={isAdding ? 'Thêm phụ huynh' : 'Chỉnh sửa phụ huynh'}
        fields={[
          {
            name: 'name',
            label: 'Họ và Tên',
            value: selectedParent?.name || '',
            onChange: (value) => setSelectedParent((prev) => ({ ...prev, name: value }) as IParents),
          },
          {
            name: 'dob',
            label: 'Ngày sinh',
            type: 'date',
            value: selectedParent?.dob || '',
            onChange: (value) => setSelectedParent((prev) => ({ ...prev, dob: value }) as IParents),
          },
          {
            name: 'phone',
            label: 'Số điện thoại',
            value: selectedParent?.phone || '',
            onChange: (value) => setSelectedParent((prev) => ({ ...prev, phone: value }) as IParents),
          },
          {
            name: 'email',
            label: 'Email',
            value: selectedParent?.email || '',
            onChange: (value) => setSelectedParent((prev) => ({ ...prev, email: value }) as IParents),
          },
          {
            name: 'address',
            label: 'Địa chỉ',
            value: selectedParent?.address || '',
            onChange: (value) => setSelectedParent((prev) => ({ ...prev, address: value }) as IParents),
          },
          {
            name: 'nationalId',
            label: 'CCCD',
            value: selectedParent?.nationalId || '',
            onChange: (value) => setSelectedParent((prev) => ({ ...prev, nationalId: value }) as IParents),
          },
          {
            name: 'job',
            label: 'Nghề nghiệp',
            value: selectedParent?.job || '',
            onChange: (value) => setSelectedParent((prev) => ({ ...prev, job: value }) as IParents),
          },
          {
            name: 'gender',
            label: 'Giới tính',
            type: 'select',
            options: [
              { value: 'false', label: 'Nam' },
              { value: 'true', label: 'Nữ' },
            ],
            value: selectedParent?.gender ? 'true' : 'false',
            onChange: (value) => setSelectedParent((prev) => ({ ...prev, gender: value === 'true' }) as IParents),
          },
        ]}
        onClose={handleClose}
        onSubmit={addOrUpdateItem}
      />
    </div>
  );
};

export default ParentPage;
