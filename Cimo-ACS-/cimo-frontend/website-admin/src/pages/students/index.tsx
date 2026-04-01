import { Button, Input, message, Popconfirm, Select } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useCrud } from 'hooks/useCrud';
import { useEffect, useState } from 'react';
import classService from 'service/apis/classService';
import parentService from 'service/apis/parentService';
import studentService from 'service/apis/studentService';
import IClasses from 'types/classes';
import IParents from 'types/parents';
import IStudents from 'types/students';
import ModalForm from 'ui-components/ModalForm/ModalForm';
import TableDataGrid from 'ui-components/TableDataGrid/TableDataGrid';

const { Option } = Select;

const { Search } = Input;

const studentValidationRules = [
  { field: 'name', required: true },
  { field: 'dob', required: true },
  { field: 'email', required: true, custom: (value) => value.includes('@') || 'Email không hợp lệ.' },
  { field: 'phone', required: true, minLength: 9 },
  { field: 'nationalId', required: true, minLength: 12 },
  { field: 'gender', required: true, type: 'boolean' as const },
  { field: 'address', required: true },
];

const StudentPage = () => {
  const {
    list,
    open,
    setOpen,
    selectedItem: selectedUser,
    setSelectedItem: setSelectedUser,
    isAdding,
    setIsAdding,
    handleOpen,
    handleClose,
    addOrUpdateItem,
    deleteItem,
    searchTerm,
    onSearch,
    fetchList,
  } = useCrud<IStudents>(studentService, studentValidationRules);
  const [classes, setClasses] = useState<IClasses[]>([]);
  const [parents, setParents] = useState<IParents[]>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await classService.getAll();
        if (res) setClasses(res.filter((cls) => !cls.isDeleted));
      } catch (error) {
        console.error('Lỗi khi tải danh sách lớp:', error);
      }
    };

    const fetchParents = async () => {
      try {
        const res = await parentService.getAll();
        if (res) setParents(res.filter((cls) => !cls.isDeleted));
      } catch (error) {
        console.error(error);
      }
    };

    fetchClasses();
    fetchParents();
  }, []);

  const addStudent = async () => {
    if (!selectedUser) return;

    try {
      // ✅ Chỉ lấy dữ liệu cần thiết
      const { soParentId, ...data } = selectedUser;

      // ✅ Gọi API tạo học sinh mới
      const newStudent = await studentService.create(data);

      if (newStudent?.id && soParentId?.length) {
        // ✅ Gọi API thêm danh sách phụ huynh vào học sinh
        await studentService.postParents(newStudent.id, soParentId);
        message.success('Thêm học sinh và phụ huynh thành công!');
      } else {
        message.success('Thêm học sinh thành công!');
      }

      fetchList();
      handleClose();
    } catch (error) {
      console.error('❌ Lỗi khi thêm học sinh:', error);
      message.error('Đã xảy ra lỗi.');
    }
  };

  const updateStudent = async () => {
    if (!selectedUser || !selectedUser.id) return;

    try {
      const { id, soParentId, ...data } = selectedUser;

      await studentService.update(id, data);

      if (soParentId?.length) {
        await studentService.postParents(id, soParentId);
        message.success('Cập nhật học sinh và phụ huynh thành công!');
      } else {
        message.success('Cập nhật học sinh thành công!');
      }

      fetchList();
      handleClose();
    } catch (error) {
      console.error(' Lỗi khi cập nhật học sinh:', error);
      message.error('Đã xảy ra lỗi.');
    }
  };

  const handleSubmit = async () => {
    if (isAdding) {
      await addStudent();
    } else {
      await updateStudent();
    }
  };

  const handleStudentOpen = async (student?: IStudents) => {
    if (student) {
      try {
        // 🟢 Gọi API lấy danh sách phụ huynh của học sinh
        const res = await studentService.getParents(student.id!);
        const parentIds = Array.isArray(res.data) ? res.data.map((p: any) => p.id) : [];

        // 🟢 Cập nhật `selectedUser` với danh sách phụ huynh từ API
        setSelectedUser({ ...student, soParentId: parentIds });

        // 🔹 Đặt lại `isAdding = false` để hệ thống biết đây là chỉnh sửa
        setIsAdding(false);
        setOpen(true);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phụ huynh:', error);
      }
    } else {
      setSelectedUser({
        name: '',
        dob: '',
        email: '',
        phone: '',
        nationalId: '',
        gender: false,
        address: '',
        soClassId: '',
        soParentId: [],
      });
      setIsAdding(true);
      setOpen(true);
    }
  };

  const handleParentChange = async (selectedParents: string[]) => {
    if (!selectedUser || !selectedUser.id) return;

    // 🔹 Lấy danh sách phụ huynh cũ của học sinh
    const oldParentIds = selectedUser.soParentId || [];

    // 🔹 Tìm những phụ huynh bị xóa (có trong danh sách cũ nhưng không có trong danh sách mới)
    const removedParents = oldParentIds.filter((parentId) => !selectedParents.includes(parentId));

    // 🔹 Gọi API xóa từng phụ huynh khỏi học sinh
    for (const parentId of removedParents) {
      await studentService.removeParent(selectedUser.id, parentId);
    }

    // 🔹 Cập nhật lại danh sách phụ huynh trong state
    setSelectedUser((prev) => ({ ...prev, soParentId: selectedParents }) as IStudents);
  };

  const columns: ColumnsType<IStudents> = [
    {
      title: 'STT',
      dataIndex: 'id',
      render: (_: any, __: IStudents, index: number) => index + 1,
    },
    { title: 'Tên đầy đủ', dataIndex: 'name' },
    { title: 'Ngày sinh', dataIndex: 'dob' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Số điện thoại', dataIndex: 'phone' },
    { title: 'Giới tính', dataIndex: 'gender', render: (gender: boolean) => (gender ? 'Nữ' : 'Nam') },
    { title: 'Địa chỉ', dataIndex: 'address' },
    { title: 'CCCD', dataIndex: 'nationalId' },
    {
      title: 'Lớp',
      dataIndex: 'soClassId',
      render: (soClassId: string) => {
        const clsName = soClassId ? classes.find((cls) => cls.id === soClassId)?.name : '';
        return clsName || 'N/A';
      },
    },
    {
      title: 'Actions',
      render: (_: any, students: IStudents) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button type="default" onClick={() => handleStudentOpen(students)}>
            Edit
          </Button>
          <Popconfirm title="Delete the task" description="Are you sure to delete this task?" onConfirm={() => deleteItem(students)} okText="Yes" cancelText="No">
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
      <TableDataGrid columns={columns} dataSource={list.filter((item) => item.name.toLowerCase().includes(searchTerm))} />

      <ModalForm
        open={open}
        title={isAdding ? 'Thêm người dùng' : 'Chỉnh sửa người dùng'}
        fields={[
          {
            name: 'name',
            label: 'Họ và Tên',
            value: selectedUser?.name || '',
            onChange: (value) => setSelectedUser((prev) => ({ ...prev, name: value }) as IStudents),
          },
          {
            name: 'dob',
            label: 'Ngày sinh',
            type: 'date',
            value: selectedUser?.dob || '',
            onChange: (value) => setSelectedUser((prev) => ({ ...prev, dob: value }) as IStudents),
          },
          {
            name: 'email',
            label: 'Email',
            value: selectedUser?.email || '',
            onChange: (value) => setSelectedUser((prev) => ({ ...prev, email: value }) as IStudents),
          },
          {
            name: 'phone',
            label: 'Số điện thoại',
            value: selectedUser?.phone || '',
            onChange: (value) => setSelectedUser((prev) => ({ ...prev, phone: value }) as IStudents),
          },
          {
            name: 'nationalId',
            label: 'CCCD',
            value: selectedUser?.nationalId || '',
            onChange: (value) => setSelectedUser((prev) => ({ ...prev, nationalId: value }) as IStudents),
          },
          {
            name: 'soClassId',
            label: 'Lớp',
            type: 'select',
            options: classes.map((cls) => ({ value: cls.id, label: cls.name })) as { value: string; label: string }[],
            value: selectedUser?.soClassId || '',
            onChange: (value) => setSelectedUser((prev) => ({ ...prev, soClassId: value }) as IStudents),
          },
          {
            name: 'gender',
            label: 'Giới tính',
            type: 'select',
            options: [
              { value: 'false', label: 'Nam' },
              { value: 'true', label: 'Nữ' },
            ],
            value: selectedUser?.gender ? 'true' : 'false',
            onChange: (value) => setSelectedUser((prev) => ({ ...prev, gender: value === 'true' }) as IStudents),
          },
          {
            name: 'address',
            label: 'Địa chỉ',
            value: selectedUser?.address || '',
            onChange: (value) => setSelectedUser((prev) => ({ ...prev, address: value }) as IStudents),
          },
          {
            name: 'parents',
            label: 'Chọn Phụ huynh',
            type: 'select',
            mode: 'multiple',
            options: parents.map((parent) => ({ value: parent.id, label: parent.name })) as { value: string; label: string }[],
            value: selectedUser?.soParentId || [],
            onChange: handleParentChange,
          },
        ]}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default StudentPage;
