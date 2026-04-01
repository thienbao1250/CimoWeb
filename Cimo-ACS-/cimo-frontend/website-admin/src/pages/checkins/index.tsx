import { Box, Tab } from '@mui/material';
import { Button, message, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import checkInsService from 'service/apis/checkInsService';
import classService from 'service/apis/classService';
import studentService from 'service/apis/studentService';
import userService from 'service/apis/userService';
import ICheckIns from 'types/checkIns';
import IClasses from 'types/classes';
import IStudents from 'types/students';
import IUsers from 'types/users';
import ModalForm from 'ui-components/ModalForm/ModalForm';
import TableDataGrid from 'ui-components/TableDataGrid/TableDataGrid';

const CheckInsPage = () => {
  const [listCheckIns, setListCheckIns] = useState<ICheckIns[]>([]);
  const [listClasses, setListClasses] = useState<IClasses[]>([]);
  const [listStudents, setListStudents] = useState<IStudents[]>([]);
  const [listUsers, setListUsers] = useState<IUsers[]>([]);
  const [open, setOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCheckIn, setSelectedCheckIn] = useState<ICheckIns | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  const columns: ColumnsType<ICheckIns> = [
    {
      title: 'STT',
      dataIndex: 'id',
      render: (_: any, __: ICheckIns, index: number) => index + 1,
    },
    {
      title: 'Lớp',
      dataIndex: 'soClassesId',
      render: (_: any, checkin: ICheckIns) => {
        const cls = listClasses.find((cls) => cls.id === checkin.soClassesId);
        return cls?.name || 'N/A';
      },
    },
    {
      title: 'Giáo viên',
      dataIndex: 'soUserId',
      render: (_: any, checkin: ICheckIns) => {
        const user = listUsers.find((user) => user.id === checkin.soUserId);
        return user?.name || 'N/A';
      },
    },
    {
      title: 'Học sinh',
      dataIndex: 'soStudentId',
      render: (_: any, checkin: ICheckIns) => {
        const student = listStudents.find((student) => checkin.soStudentId.includes(student.id!));
        return student?.name || 'N/A';
      },
    },
    { title: 'Trạng thái', dataIndex: 'checkType' },
    { title: 'Ngày', dataIndex: 'checkDate' },
    { title: 'Ghi chú', dataIndex: 'note' },
    {
      title: 'Actions',
      render: (_: any, checkin: ICheckIns) => (
        <Box sx={{ display: 'flex', gap: '10px' }}>
          <Button type="default" onClick={() => handleOpen(checkin)}>
            Edit
          </Button>
          <Popconfirm title="Bạn có chắc muốn xóa lớp học này?" okText="Yes" cancelText="No">
            <Button type="default" danger onClick={() => deleteCheckIn(checkin)}>
              Delete
            </Button>
          </Popconfirm>
        </Box>
      ),
    },
  ];

  const handleOpen = (checkin?: ICheckIns) => {
    if (checkin) {
      // Gán selectedClassId từ soClassesId của checkin
      setSelectedClassId(checkin.soClassesId);
      setSelectedCheckIn(checkin);
    } else {
      // Reset nếu tạo mới
      setSelectedClassId(null);
      setSelectedCheckIn({ soClassesId: '', soUserId: '', soStudentId: [], checkType: '', checkDate: '', note: '' });
    }
    setIsAdding(!checkin);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCheckIn(null);
  };

  const addOrUpdateCheckIn = async () => {
    try {
      if (selectedCheckIn) {
        const checkInWithDate = {
          ...selectedCheckIn,
          checkDate: dayjs().format('YYYY-MM-DD'), // Gán ngày hiện tại trước khi gửi
        };

        if (!isAdding && checkInWithDate.id) {
          await checkInsService.update(checkInWithDate.id, checkInWithDate);
          message.success('Cập nhật thành công!');
        } else {
          await checkInsService.create(checkInWithDate);
          message.success('Thêm thành công!');
        }
      }
      fetchCheckIns();
      handleClose();
    } catch (error) {
      console.error(error);
      message.error('Đã xảy ra lỗi!');
    }
  };

  const deleteCheckIn = async (checkin: ICheckIns) => {
    try {
      await checkInsService.delete(checkin.id!);
      message.success('Xóa thành công!');
    } catch (error) {
      console.error(error);
      message.error('Đã xảy ra lỗi khi xóa!');
    }
  };
  const fetchCheckIns = async () => {
    try {
      const res = await checkInsService.getAll();
      console.log(res);

      if (res) setListCheckIns(res);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await userService.getAll();
      if (res) setListUsers(res.filter((user) => !user.isDeleted));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await classService.getAll();
      if (res) setListClasses(res.filter((cls) => !cls.isDeleted));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await studentService.getAll();
      if (res) setListStudents(res.filter((cls) => !cls.isDeleted));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCheckIns();
    fetchUsers();
    fetchClasses();
    fetchStudents();
  }, []);
  return (
    <div>
      <Button type="primary" onClick={() => handleOpen()} style={{ marginBottom: 16 }}>
        Thêm
      </Button>
      <TableDataGrid columns={columns} dataSource={listCheckIns} />
      <ModalForm
        open={open}
        title={isAdding ? 'Add Check In' : 'Edit Check In'}
        fields={[
          {
            name: 'soUserId',
            label: 'Giáo viên',
            type: 'select',
            options: listUsers.map((user) => ({ value: user.id, label: user.name })) as { value: string; label: string }[],
            value: selectedCheckIn?.soUserId || [],
            onChange: (value) => setSelectedCheckIn((prev) => ({ ...prev, soUserId: value }) as ICheckIns),
          },
          {
            name: 'soClassesId',
            label: 'Lớp',
            type: 'select',
            options: listClasses.map((cls) => ({ value: cls.id, label: cls.name })) as { value: string; label: string }[],
            value: selectedClassId || '',
            onChange: (value) => {
              setSelectedClassId(value);
              setSelectedCheckIn((prev) => ({ ...prev, soClassesId: value, soStudentId: [] }) as ICheckIns);
            },
          },
          {
            name: 'soStudentId',
            label: 'Học sinh',
            type: 'select',
            options: listStudents.filter((student) => student.soClassId === selectedClassId).map((student) => ({ value: student.id, label: student.name })) as { value: string; label: string }[],
            value: selectedCheckIn?.soStudentId || [],
            onChange: (value) => setSelectedCheckIn((prev) => ({ ...prev, soStudentId: value }) as ICheckIns),
            disabled: !selectedClassId,
          },
          {
            name: 'checkType',
            label: 'Trạng thái',
            value: selectedCheckIn?.checkType || '',
            onChange: (value) => setSelectedCheckIn((prev) => ({ ...prev, checkType: value }) as ICheckIns),
          },
          {
            name: 'checkDate',
            label: 'Ngày',
            value: dayjs().format('YYYY-MM-DD'), // Tự động lấy ngày hiện tại
            disabled: true, // Vô hiệu hóa chỉnh sửa
            onChange: () => {},
          },
          {
            name: 'note',
            label: 'Ghi chú',
            value: selectedCheckIn?.note || '',
            onChange: (value) => setSelectedCheckIn((prev) => ({ ...prev, note: value }) as ICheckIns),
          },
        ]}
        onClose={handleClose}
        onSubmit={addOrUpdateCheckIn}
      />
    </div>
  );
};

export default CheckInsPage;

// import { Box } from '@mui/material';
// import { Button, message, Popconfirm } from 'antd';
// import dayjs from 'dayjs';
// import { ColumnsType } from 'antd/es/table';
// import { useEffect, useState } from 'react';
// import checkInsService from 'service/apis/checkInsService';
// import classService from 'service/apis/classService';
// import studentService from 'service/apis/studentService';
// import userService from 'service/apis/userService';
// import ICheckIns from 'types/checkIns';
// import IClasses from 'types/classes';
// import IStudents from 'types/students';
// import IUsers from 'types/users';
// import ModalForm from 'ui-components/ModalForm/ModalForm';
// import TableDataGrid from 'ui-components/TableDataGrid/TableDataGrid';
// import { useCrud } from 'hooks/useCrud';

// const checkInValidationRules = [
//   { field: 'soUserId', required: true },
//   { field: 'soClassesId', required: true },
//   { field: 'soStudentId', required: true },
//   { field: 'checkType', required: true },
// ];

// const CheckInsPage = () => {
//   // 🟢 Sử dụng useCrud cho danh sách điểm danh
//   const { list: listCheckIns, open, selectedItem: selectedCheckIn, setSelectedItem: setSelectedCheckIn, isAdding, handleOpen, handleClose, addOrUpdateItem, deleteItem, fetchList } = useCrud<ICheckIns>(checkInsService, checkInValidationRules);

//   const [listClasses, setListClasses] = useState<IClasses[]>([]);
//   const [listStudents, setListStudents] = useState<IStudents[]>([]);
//   const [listUsers, setListUsers] = useState<IUsers[]>([]);
//   const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

//   // 🟢 Lấy danh sách lớp, học sinh, giáo viên
//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const res = await classService.getAll();
//         if (res) setListClasses(res.filter((cls) => !cls.isDeleted));
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     const fetchStudents = async () => {
//       try {
//         const res = await studentService.getAll();
//         if (res) setListStudents(res.filter((student) => !student.isDeleted));
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     const fetchUsers = async () => {
//       try {
//         const res = await userService.getAll();
//         if (res) setListUsers(res.filter((user) => !user.isDeleted));
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchClasses();
//     fetchStudents();
//     fetchUsers();
//   }, []);

//   const handleSubmit = async () => {
//     if (!selectedCheckIn) return;

//     try {
//       // ✅ Cập nhật checkDate ngay trong state trước khi gửi API
//       const updatedCheckIn = {
//         ...selectedCheckIn,
//         checkDate: selectedCheckIn.checkDate || dayjs().format('YYYY-MM-DD'),
//       };

//       setSelectedCheckIn(updatedCheckIn); // Cập nhật state trước khi gửi API

//       // ✅ Đợi React cập nhật state rồi mới tiếp tục
//       setTimeout(async () => {
//         console.log('🟢 Dữ liệu gửi API:', updatedCheckIn); // Kiểm tra dữ liệu gửi
//         await addOrUpdateItem();
//         message.success('Cập nhật điểm danh thành công!');

//         fetchList(); // 🔄 Load lại danh sách ngay sau khi cập nhật
//         handleClose();
//       }, 200);
//     } catch (error) {
//       console.error('❌ Lỗi khi cập nhật điểm danh:', error);
//       message.error('Đã xảy ra lỗi khi cập nhật dữ liệu.');
//     }
//   };

//   const columns: ColumnsType<ICheckIns> = [
//     {
//       title: 'STT',
//       dataIndex: 'id',
//       render: (_: any, __: ICheckIns, index: number) => index + 1,
//     },
//     {
//       title: 'Lớp',
//       dataIndex: 'soClassesId',
//       render: (_, checkin: ICheckIns) => {
//         const cls = listClasses.find((cls) => cls.id === checkin.soClassesId);
//         return cls?.name || 'N/A';
//       },
//     },
//     {
//       title: 'Giáo viên',
//       dataIndex: 'soUserId',
//       render: (_, checkin: ICheckIns) => {
//         const user = listUsers.find((user) => user.id === checkin.soUserId);
//         return user?.name || 'N/A';
//       },
//     },
//     {
//       title: 'Học sinh',
//       dataIndex: 'soStudentId',
//       render: (_, checkin: ICheckIns) => {
//         const student = listStudents.find((student) => checkin.soStudentId.includes(student.id!));
//         return student?.name || 'N/A';
//       },
//     },
//     { title: 'Trạng thái', dataIndex: 'checkType' },
//     { title: 'Ngày', dataIndex: 'checkDate' },
//     { title: 'Ghi chú', dataIndex: 'note' },
//     {
//       title: 'Actions',
//       render: (_, checkin: ICheckIns) => (
//         <Box sx={{ display: 'flex', gap: '10px' }}>
//           <Button type="default" onClick={() => handleOpen(checkin)}>
//             Edit
//           </Button>
//           <Popconfirm title="Bạn có chắc muốn xóa?" okText="Yes" cancelText="No">
//             <Button type="default" danger onClick={() => deleteItem(checkin)}>
//               Delete
//             </Button>
//           </Popconfirm>
//         </Box>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <Button type="primary" onClick={() => handleOpen()} style={{ marginBottom: 16 }}>
//         Thêm
//       </Button>
//       <TableDataGrid columns={columns} dataSource={listCheckIns} />
//       <ModalForm
//         open={open}
//         title={isAdding ? 'Thêm điểm danh' : 'Chỉnh sửa điểm danh'}
//         fields={[
//           {
//             name: 'soUserId',
//             label: 'Giáo viên',
//             type: 'select',
//             options: listUsers.map((user) => ({ value: user.id, label: user.name })) as { value: string; label: string }[],
//             value: selectedCheckIn?.soUserId || '',
//             onChange: (value) => setSelectedCheckIn((prev) => ({ ...prev, soUserId: value }) as ICheckIns),
//           },
//           {
//             name: 'soClassesId',
//             label: 'Lớp',
//             type: 'select',
//             options: listClasses.map((cls) => ({ value: cls.id, label: cls.name })) as { value: string; label: string }[],
//             value: selectedClassId || '',
//             onChange: (value) => {
//               setSelectedClassId(value);
//               setSelectedCheckIn((prev) => ({ ...prev, soClassesId: value, soStudentId: [] }) as ICheckIns);
//             },
//           },
//           {
//             name: 'soStudentId',
//             label: 'Học sinh',
//             type: 'select',
//             options: listStudents.filter((student) => student.soClassId === selectedClassId).map((student) => ({ value: student.id, label: student.name })) as { value: string; label: string }[],
//             value: selectedCheckIn?.soStudentId || [],
//             onChange: (value) => setSelectedCheckIn((prev) => ({ ...prev, soStudentId: value }) as ICheckIns),
//             disabled: !selectedClassId,
//           },
//           {
//             name: 'checkType',
//             label: 'Trạng thái',
//             value: selectedCheckIn?.checkType || '',
//             onChange: (value) => setSelectedCheckIn((prev) => ({ ...prev, checkType: value }) as ICheckIns),
//           },
//           {
//             name: 'checkDate',
//             label: 'Ngày',
//             value: dayjs().format('YYYY-MM-DD'),
//             disabled: true,
//             onChange: () => {},
//           },
//           {
//             name: 'note',
//             label: 'Ghi chú',
//             value: selectedCheckIn?.note || '',
//             onChange: (value) => setSelectedCheckIn((prev) => ({ ...prev, note: value }) as ICheckIns),
//           },
//         ]}
//         onClose={handleClose}
//         onSubmit={handleSubmit}
//       />
//     </div>
//   );
// };

// export default CheckInsPage;
