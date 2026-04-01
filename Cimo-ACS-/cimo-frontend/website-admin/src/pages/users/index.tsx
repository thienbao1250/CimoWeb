import { Button, Input, Popconfirm } from 'antd';
import { useCrud } from 'hooks/useCrud';
import { useEffect, useState } from 'react';
import roleService from 'service/apis/roleService';
import userService from 'service/apis/userService';
import IRoles from 'types/roles';
import IUsers from 'types/users';
import ModalForm from 'ui-components/ModalForm/ModalForm';
import TableDataGrid from 'ui-components/TableDataGrid/TableDataGrid';

const { Search } = Input;

const userValidationRules = [
  { field: 'username', required: true, minLength: 4 },
  { field: 'name', required: true },
  { field: 'dob', required: true },
  { field: 'password', required: true, minLength: 6 },
];

const UserPage = () => {
  const { list: listUser, open, selectedItem: selectedUser, setSelectedItem: setSelectedUser, isAdding, handleOpen, handleClose, addOrUpdateItem, deleteItem, searchTerm, onSearch } = useCrud<IUsers>(userService, userValidationRules);

  const [roles, setRoles] = useState<IRoles[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await roleService.getAll();
        setRoles(res.filter((role) => !role.isDeleted));
      } catch (error) {
        console.error('Lỗi khi tải danh sách Roles:', error);
      }
    };
    fetchRoles();
  }, []);

  const columns = [
    {
      title: 'STT',
      dataIndex: 'id',
      render: (_: any, __: IUsers, index: number) => index + 1,
    },
    { title: 'Tên đăng nhập', dataIndex: 'username' },
    { title: 'Tên đầy đủ', dataIndex: 'name' },
    { title: 'Ngày sinh', dataIndex: 'dob' },
    {
      title: 'Roles',
      dataIndex: 'soRoleIds',
      render: (roleIds: string[]) => {
        if (!Array.isArray(roleIds)) {
          return 'N/A'; // Trả về 'N/A' nếu roleIds không phải là mảng
        }
        const roleNames = roleIds.map((roleId) => roles.find((r) => r.id === roleId)?.name || 'N/A').join(', ');
        return roleNames || 'N/A';
      },
    },

    {
      title: 'Actions',
      render: (_: any, user: IUsers) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button type="default" onClick={() => handleOpen(user)}>
            Edit
          </Button>
          <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => deleteItem(user)} okText="Yes" cancelText="No">
            <Button danger>Xóa</Button>
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
      <TableDataGrid columns={columns} dataSource={listUser.filter((user) => user.username.toLowerCase().includes(searchTerm))} />
      <ModalForm
        open={open}
        title={isAdding ? 'Thêm người dùng' : 'Chỉnh sửa người dùng'}
        fields={[
          { name: 'username', label: 'Tên đăng nhập', value: selectedUser?.username ?? '', onChange: (value) => setSelectedUser((prev) => ({ ...prev!, username: value })) },
          { name: 'name', label: 'Tên đầy đủ', value: selectedUser?.name ?? '', onChange: (value) => setSelectedUser((prev) => ({ ...prev!, name: value })) },
          { name: 'dob', label: 'Ngày sinh', type: 'date', value: selectedUser?.dob ?? '', onChange: (value) => setSelectedUser((prev) => ({ ...prev!, dob: value })) },
          ...(isAdding
            ? [
                {
                  name: 'password',
                  label: 'Mật khẩu',
                  type: 'password',
                  value: selectedUser?.password || '',
                  onChange: (value) => setSelectedUser((prev) => ({ ...prev!, password: value })),
                },
              ]
            : []),
          //   {
          //     name: 'soRoleIds',
          //     label: 'Roles',
          //     type: 'select',
          //     mode: 'multiple',
          //     options: roles.map((role) => ({ value: role.id!, label: role.name })) as { value: string; label: string }[],
          //     value: selectedUser?.soRoleIds || [],
          //     onChange: async (newRoles) => {
          //       if (selectedUser?.id) {
          //         const removedRoles = selectedUser.soRoleIds?.filter((roleId) => !newRoles.includes(roleId));
          //         if (removedRoles?.length) {
          //           await Promise.all(removedRoles.map((roleId) => userService.removeRole(selectedUser.id!, roleId)));
          //         }
          //         setSelectedUser((prev) => ({
          //           ...prev!,
          //           soRoleIds: newRoles,
          //         }));
          //       }
          //     },
          //   },
          {
            name: 'soRoleIds',
            label: 'Roles',
            type: 'select',
            mode: 'multiple',
            options: roles.map((role) => ({ value: role.id!, label: role.name })) as { value: string; label: string }[],
            value: selectedUser?.soRoleIds || [],
            onChange: async (newRoles) => {
              if (selectedUser?.id) {
                // 🟢 Khi chỉnh sửa, xử lý xóa Role bằng API
                const removedRoles = selectedUser.soRoleIds?.filter((roleId) => !newRoles.includes(roleId));
                if (removedRoles?.length) {
                  await Promise.all(removedRoles.map((roleId) => userService.removeRole(selectedUser.id!, roleId)));
                }
              }

              setSelectedUser((prev) => ({
                ...prev!,
                soRoleIds: newRoles,
              }));

              console.log('🟢 Danh sách Role mới:', newRoles);
            },
          },
        ]}
        onClose={handleClose}
        onSubmit={addOrUpdateItem}
      />
    </>
  );
};

export default UserPage;
