import { message } from 'antd';

type ValidationRule = {
  field: string; // Tên trường cần kiểm tra
  required?: boolean; // Trường bắt buộc
  minLength?: number; // Độ dài tối thiểu
  maxLength?: number; // Độ dài tối đa
  type?: 'string' | 'number' | 'array' | 'boolean' | 'date'; // Kiểu dữ liệu
  custom?: (value: any) => boolean | string; // Hàm kiểm tra tùy chỉnh
};

const validate = (data: any, rules: ValidationRule[]): boolean => {
    if (!data) {
      message.error('Dữ liệu không hợp lệ.');
      return false;
    }

    for (const rule of rules) {
      const value = data[rule.field];

      // Kiểm tra bắt buộc
      if (rule.required && (value === undefined || value === null || value === '')) {
        message.error(`${rule.field} là bắt buộc.`);
        return false;
      }

      // Kiểm tra độ dài tối thiểu
      if (rule.minLength && value?.length < rule.minLength) {
        message.error(`${rule.field} phải có ít nhất ${rule.minLength} ký tự.`);
        return false;
      }

      // Kiểm tra độ dài tối đa
      if (rule.maxLength && value?.length > rule.maxLength) {
        message.error(`${rule.field} không được vượt quá ${rule.maxLength} ký tự.`);
        return false;
      }

      // Kiểm tra kiểu dữ liệu
      if (rule.type && typeof value !== rule.type) {
        message.error(`${rule.field} phải là kiểu ${rule.type}.`);
        return false;
      }

      // Kiểm tra tùy chỉnh
      if (rule.custom) {
        const customResult = rule.custom(value);
        if (customResult !== true) {
          message.error(typeof customResult === 'string' ? customResult : `${rule.field} không hợp lệ.`);
          return false;
        }
      }
    }

    return true;
  };


export default validate;