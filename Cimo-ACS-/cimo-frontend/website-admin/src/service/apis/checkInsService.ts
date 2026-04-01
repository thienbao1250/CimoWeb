import BaseAdminService from "service/core/baseAdminService";
import ICheckIns from "types/checkIns";

class CheckInsService extends BaseAdminService<ICheckIns> {
    constructor() {
        super("/so-checkins");
    }
}

export default new CheckInsService();