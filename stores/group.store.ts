import { create } from "zustand";
import { GroupOut } from "@/types/group.type";

export type GroupStore = {
  groups: GroupOut[];
  setGroups: (groups: GroupOut[]) => void;
};

export const useGroupStore = create<GroupStore>()((set, get) => ({
  groups: [],
  setGroups: (groups) => set({ groups }),
}));
