import { create } from "zustand";
import { GroupOut } from "@/types/group.type";

type GroupStore = {
  groups: GroupOut[];
  setGroups: (groups: GroupOut[]) => void;
  getGroupName: (id: number) => string;
};

export const useGroupStore = create<GroupStore>()((set, get) => ({
  groups: [],
  setGroups: (groups) => set({ groups }),
  getGroupName: (id) => {
    const group = get().groups.find((g) => g.id === id);
    return group?.nome || String(id);
  },
}));
