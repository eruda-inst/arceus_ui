import { Skeleton, Tag, TagRootProps } from "@heroui/react";
import { PermOutType } from "@/types/perm.type";

export interface MyTagProps extends TagRootProps {
  perms: PermOutType[];
}

export default function SidebarTag({
  perms,
  children,
  id,
  isDisabled,
  onPress,
  ...props
}: MyTagProps) {
  if (!perms) {
    return <Skeleton className="w-full h-12 rounded-3xl" />;
  }

  return (
    <Tag
      {...props}
      id={id}
      isDisabled={isDisabled}
      onPress={onPress}
      className="text-sm w-full justify-start gap-3 h-12 text-gray-800 dark:text-white data-[selected=true]:bg-linear-to-r data-[selected=true]:from-purple-500 data-[selected=true]:to-indigo-500"
    >
      {children}
    </Tag>
  );
}
