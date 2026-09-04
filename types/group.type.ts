import z from "zod";
import { GroupOutSchema } from "@/schemas/group.schema";

type GroupOutType = z.infer<typeof GroupOutSchema>;

export type { GroupOutType };
