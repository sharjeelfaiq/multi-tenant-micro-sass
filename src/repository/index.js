import { auditRepository } from "./audit.repository.js";
import { tenantRepository } from "./tenant.repository.js";
import { userRepository } from "./user.repository.js";

export const repository = {
  read: {
    ...auditRepository.read,
    ...tenantRepository.read,
    ...userRepository.read,
  },

  write: {
    ...auditRepository.write,
    ...tenantRepository.write,
    ...userRepository.write,
  },

  update: {
    ...tenantRepository.update,
  },
};
