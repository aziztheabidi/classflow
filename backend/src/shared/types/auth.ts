export const USER_ROLES = ["TEACHER", "STUDENT"] as const;

export type UserRole = (typeof USER_ROLES)[number];
