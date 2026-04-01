import IAuthParentType from "../../types/auth/authParent";
import axiosClient from "../../util/axiosClient";
import BaseAdminService from "../core/baseAdminService";

class SoParents extends BaseAdminService<IAuthParentType> {
  constructor() {
    super("/so-parents");
  }

  async sendOtp(data: IAuthParentType) {
    const response = await axiosClient.post("/parents/auth/send-otp", data);
    return response.data;
  }

  async loginWithOtp(data: IAuthParentType) {
    const response = await axiosClient.post(
      "/parents/auth/login-with-otp",
      data
    );
    return response.data;
  }

  async getProfile() {
    const response = await axiosClient.get("/parents/auth/me");
    return response.data;
  }

  async getCheckIn(soStudentId: any, moth?: any) {
    const response = await axiosClient.get(
      `/parents/checkin/${soStudentId}?month=${moth}`
    );
    return response.data;
  }
}

export default new SoParents();
