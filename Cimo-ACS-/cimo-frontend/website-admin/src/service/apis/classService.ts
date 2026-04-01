import BaseAdminService from "service/core/baseAdminService";
import IClasses from "types/classes";

class ClassService extends BaseAdminService<IClasses> {
    constructor() {
        super("/so-classes");
    }
}

export default new ClassService();