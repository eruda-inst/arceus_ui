import { create } from "zustand";
import { IXCUserOut } from "@/types/ixcUser.type";

export type IxcUserStore = {
  // IXC users
  ixcUsers: IXCUserOut[];
  setIxcUsers: (data: IXCUserOut[]) => void;

  // Selected IXC user
  selectedIxcUser: IXCUserOut | null;
  setSelectedIxcUser: (data: IXCUserOut | null) => void;
};

export const useIxcUserStore = create<IxcUserStore>()((set) => ({
  // IXC users
  ixcUsers: [],
  setIxcUsers: (data: IXCUserOut[]) => set({ ixcUsers: data }),

  // Selected IXC user
  selectedIxcUser: null,
  setSelectedIxcUser: (data: IXCUserOut | null) =>
    set({ selectedIxcUser: data }),
}));
