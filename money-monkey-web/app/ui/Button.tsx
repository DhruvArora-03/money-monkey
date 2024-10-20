import React, { ReactNode } from "react";
import { IconType } from "react-icons";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  Icon?: IconType;
  iconColor?: string;
}

export default function Button({
  Icon,
  iconColor,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`flex items-center gap-1 border-2 rounded p-1.5 hover:bg-gray-100 active:bg-gray-200 ${className}`}
      {...props}
    >
      {Icon && <Icon color={iconColor} size={20} />}
      {children}
    </button>
  );
}
