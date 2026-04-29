import z from "zod";
import { GroupOutSchema } from "@/schemas/groupSchema";

type GroupOut = z.infer<typeof GroupOutSchema>;

export type { GroupOut };
