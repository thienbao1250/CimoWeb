import BaseAdminService from "service/core/baseAdminService";
import IRoles from "types/roles";

class RoleService extends BaseAdminService<IRoles> {
    constructor() {
        super("/so-roles");
    }
}

export default new RoleService();