import { TenantModel } from "#models/index.js";

export const tenantRepository = {
    read: {
        tenantById: (id) => {
            return TenantModel.findById(id).exec();
        },

        tenantBySubdomain: (subdomain) => {
            return TenantModel.findOne({ subdomain }).exec();
        },
    },

    write: {
        tenant: (data) => {
            const { name, subdomain } = data;

            return TenantModel.create({ name, subdomain });
        },
    },

    update: {
        tenantById: (id, data) => {
            return TenantModel.findByIdAndUpdate(id, data, { new: true });
        },
    },
};
