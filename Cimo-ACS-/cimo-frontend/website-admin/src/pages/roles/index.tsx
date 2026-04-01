import { useEffect, useState } from 'react';
import { Button, Popconfirm, Input, message } from 'antd';
import TableDataGrid from 'ui-components/TableDataGrid/TableDataGrid';
import ModalForm from 'ui-components/ModalForm/ModalForm';
import { useCrud } from 'hooks/useCrud';
import roleService from 'service/apis/roleService';
import IRoles from 'types/roles';
import IUsers from 'types/users';
import userService from 'service/apis/userService';

const { Search } = Input;
const roleValidationRules = [{ field: 'name', required: true }];

const PageRole = () => {
  const { list: listRole, open, selectedItem: selectedRole, setSelectedItem: setSelectedRole, isAdding, handleOpen, handleClose, addOrUpdateItem, deleteItem, searchTerm, onSearch } = useCrud<IRoles>(roleService, roleValidationRules);
  const [users, setUsers] = useState<IUsers[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUsers[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userService.getAll();
        setUsers(res.filter((role) => !role.isDeleted));
      } catch (error) {
        console.error('Lỗi khi tải danh sách Roles:', error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedRole?.id) {
      // ✅ Chỉ lọc danh sách user để hiển thị, không thay đổi state `users`
      setFilteredUsers(users.filter((user) => !user.soRoleIds?.includes(selectedRole.id!)));
    } else {
      setFilteredUsers(users); // Khi thêm mới, hiển thị tất cả user
    }
  }, [selectedRole, users]);

  const handleSubmit = async () => {
    try {
      await addOrUpdateItem();

      if (selectedRole?.id) {
        // ✅ Cập nhật Role cho từng User đã chọn
        await Promise.all(
          selectedUsers.map(async (userId) => {
            const user = await userService.getById(userId);
            const updatedRoles = [...(user.soRoleIds || []), selectedRole.id];

            await userService.updateUserRole(userId, updatedRoles as string[]);
          })
        );

        message.success('Cập nhật Users thành công!');
      }
    } catch (error) {
      message.error('Lỗi khi cập nhật Role và Users.');
    }
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'id',
      render: (_: any, _IRoles: IRoles, index: number) => index + 1,
    },
    { title: 'Tên role', dataIndex: 'name' },
    {
      title: 'Actions',
      render: (_: any, role: IRoles) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button type="default" onClick={() => handleOpen(role)}>
            Edit
          </Button>
          <Popconfirm title="Bạn có chắc muốn xóa lớp học này?" okText="Yes" cancelText="No" onConfirm={() => deleteItem(role)}>
            <Button type="default" danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <Button type="primary" onClick={() => handleOpen()}>
          Thêm người dùng
        </Button>
        <Search placeholder="Tìm kiếm" onSearch={onSearch} style={{ width: 200 }} />
      </div>
      <TableDataGrid columns={columns} dataSource={listRole.filter((role) => role.name.toLowerCase().includes(searchTerm))} />
      <ModalForm
        open={open}
        title={isAdding ? 'Thêm role' : 'Chỉnh sửa role'}
        fields={[
          {
            name: 'name',
            label: 'Ten role',
            value: selectedRole?.name || '',
            onChange: (value) => setSelectedRole((prev) => ({ ...prev, name: value }) as IRoles),
          },
          {
            name: 'users',
            label: 'Người dùng',
            type: 'select',
            mode: 'multiple',
            options: filteredUsers.map((user) => ({
              label: user.name,
              value: user.id ?? '',
            })),
            value: selectedUsers,
            onChange: (values) => setSelectedUsers(values),
          },
        ]}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default PageRole;
