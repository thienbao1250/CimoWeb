import React, { useEffect, useState } from 'react';
import { Button, message, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/es/table';
import IClasses from 'types/classes';
import IStudents from 'types/students';
import classService from 'service/apis/classService';
import studentService from 'service/apis/studentService';
import ModalForm from 'ui-components/ModalForm/ModalForm';
import TableDataGrid from 'ui-components/TableDataGrid/TableDataGrid';
import { useCrud } from 'hooks/useCrud';

const classValidationRules = [{ field: 'name', required: true }];

const ClassPage = () => {
  const { list: listClass, open, selectedItem: selectedClass, setSelectedItem: setSelectedClass, isAdding, handleOpen, handleClose, addOrUpdateItem, deleteItem, fetchList } = useCrud<IClasses>(classService, classValidationRules);

  const [listStudent, setListStudent] = useState<IStudents[]>([]);
  const [availableStudents, setAvailableStudents] = useState<IStudents[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await studentService.getAll();
        if (res) setListStudent(res.filter((student) => !student.isDeleted));
      } catch (error) {
        console.error(error);
      }
    };
    fetchStudents();
  }, []);

  const columns: ColumnsType<IClasses> = [
    {
      title: 'STT',
      dataIndex: 'id',
      render: (_: any, __: IClasses, index: number) => index + 1,
    },
    { title: 'Tên lớp', dataIndex: 'name' },
    {
      title: 'Actions',
      render: (_: any, cls: IClasses) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button type="default" onClick={() => handleOpen(cls)}>
            Edit
          </Button>
          <Popconfirm title="Bạn có chắc muốn xóa lớp học này?" onConfirm={() => deleteItem(cls)} okText="Yes" cancelText="No">
            <Button type="default" danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (selectedClass) {
      const studentsWithoutClass = listStudent.filter((student) => !student.soClassId);
      setAvailableStudents(studentsWithoutClass);
    }
  }, [selectedClass, listStudent]);

  return (
    <div>
      <Button type="primary" onClick={() => handleOpen()} style={{ marginBottom: 16 }}>
        Thêm lớp học
      </Button>
      <TableDataGrid dataSource={listClass} columns={columns} />
      <ModalForm
        open={open}
        title={isAdding ? 'Thêm lớp học' : 'Chỉnh sửa lớp học'}
        fields={[
          {
            name: 'name',
            label: 'Tên lớp',
            value: selectedClass?.name || '',
            onChange: (value) => setSelectedClass((prev) => ({ ...prev, name: value })),
          },
          {
            name: 'soStudents',
            label: 'Học sinh',
            type: 'select',
            mode: 'multiple',
            options: availableStudents.map((student) => ({ value: student.id, label: student.name })) as { value: string; label: string }[],
            value: selectedClass?.soStudents || [],
            onChange: (value) => setSelectedClass((prev) => ({ ...prev, soStudents: value })),
          },
        ]}
        onClose={handleClose}
        onSubmit={addOrUpdateItem}
      />
    </div>
  );
};

export default ClassPage;
