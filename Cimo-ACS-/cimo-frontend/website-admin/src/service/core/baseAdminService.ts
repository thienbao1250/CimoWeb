import { omit } from 'lodash';
import axiosClient from 'utils/axiosClient';
class BaseAdminService<T> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async getAll(): Promise<T[]> {
    const response = await axiosClient.get(this.endpoint);
    return response.data;
  }

  async getById(id: string): Promise<T> {
    const response = await axiosClient.get(`${this.endpoint}/${id}`);
    return response.data;
  }

  async create(data: T): Promise<T> {
    data = this.clearTrackingField(data);
    const response = await axiosClient.post(this.endpoint, data);
    return response.data;
  }

  async update(id: string, data: T): Promise<T> {
    data = this.clearTrackingField(data);
    const response = await axiosClient.patch(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axiosClient.delete(`${this.endpoint}/${id}`);
  }

  private clearTrackingField(data) {
    data = omit(data, ['createdBy', 'createdDate', 'updatedBy', 'updatedDate']);
    return data;
  }
}

export default BaseAdminService;
