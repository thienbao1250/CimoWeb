import IStudents from 'types/students';
import BaseAdminService from '../core/baseAdminService';
import axiosClient from 'utils/axiosClient';

class StudentService extends BaseAdminService<IStudents> {
  constructor() {
    super('/so-students');
  }

  async postParents(id: string, parentIds: string[]) {
    return await axiosClient.post(`/so-students/${id}/parents`, { parentIds });
  }

  async getParents(id: string) {
    return await axiosClient.get(`/so-students/${id}/parents`);
  }

  async removeParent(id: string, parentId: string) {
    return await axiosClient.delete(`/so-students/${id}/parents/${parentId}`);
  }

}

export default new StudentService();
