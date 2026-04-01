import { useState, useEffect } from "react";
import { message } from "antd";
import validate from "utils/validation/validation";

export const useCrud = <T extends { id?: string; isDeleted?: boolean }>(
  service: any,
  validationRules: any
) => {
  const [list, setList] = useState<T[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchList = async () => {
    try {
      const res = await service.getAll();
      if (res) setList(res.filter((item: T) => !item.isDeleted));
    } catch (error) {
      console.error("Lỗi khi tải danh sách:", error);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleOpen = (item?: T) => {
    setSelectedItem(item || ({} as T));
    setIsAdding(!item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  const addOrUpdateItem = async () => {
    if (!validate(selectedItem, validationRules)) {
      return;
    }

    try {
      if (selectedItem) {
        if (!isAdding && selectedItem.id) {
          await service.update(selectedItem.id, selectedItem);
          message.success("Cập nhật thành công!");
        } else {
          await service.create(selectedItem);
          message.success("Thêm mới thành công!");
        }
        fetchList();
        handleClose();
      }
    } catch (error) {
      console.error("Lỗi khi thêm hoặc cập nhật:", error);
      message.error("Đã xảy ra lỗi.");
    }
  };


  const deleteItem = async (item: T) => {
    try {
      if (item.id) {
        await service.delete(item.id);
        message.success("Xóa thành công!");
        fetchList();
      } else {
        console.error("Item không có ID, không thể xóa.");
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi khi xóa!");
    }
  };

  const onSearch = (value: string) => {
    setSearchTerm(value.toLowerCase());
  };

  return {
    list,
    open,
    setOpen,
    selectedItem,
    setSelectedItem,
    isAdding,
    setIsAdding,
    handleOpen,
    handleClose,
    addOrUpdateItem,
    deleteItem,
    searchTerm,
    onSearch,
    fetchList,
  };
};
