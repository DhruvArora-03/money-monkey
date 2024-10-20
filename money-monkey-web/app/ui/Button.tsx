import React, { ReactNode } from "react";
import { IconType } from "react-icons";

/**
 * Props for the Button component.
 *
 * @property {IconType} [Icon] - Optional icon component to be rendered inside the button.
 * @property {string} [iconColor] - Color of the icon, if provided.
 */
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
      className={`flex items-center gap-1 border-2 rounded p-1.5 hover:bg-gray-100 active:bg-gray-200 disabled:bg-gray-300 disabled:text-gray-500 ${className}`}
      {...props}
    >
      {Icon && <Icon color={iconColor} size={20} />}
      {children}
    </button>
  );
}
