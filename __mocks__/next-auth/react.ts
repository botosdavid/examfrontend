import { Role } from "@prisma/client";

const useSession = () => ({
  data: { user: { id: "userId", role: Role.TEACHER } },
});
export { useSession };
