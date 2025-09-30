import { UserModel } from "#models/index.js";

export const userRepository = {
    read: {
        userByEmail: (email) => {
            return UserModel.findOne({ email }).exec();
        },

        usersCount: (tenant) => {
            return UserModel.countDocuments({ tenant }).exec();
        },
    },

    write: {
        user: (data) => {
            return UserModel.create(data);
        },
    },
};
