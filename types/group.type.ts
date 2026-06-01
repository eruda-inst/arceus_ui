import z from "zod";
import { GroupOutSchema } from "@/schemas/group.schema";

type GroupOut = z.infer<typeof GroupOutSchema>;

export type { GroupOut };
