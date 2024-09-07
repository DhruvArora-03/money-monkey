import React from 'react';
import { IconType } from 'react-icons';

interface ButtonProps {
  className?: string;
  icon?: IconType;
  iconColor?: string;
  text?: string;
  onClick?: () => void;
}

export default function Button(props: ButtonProps) {
  return (
    <button className={`flex items-center gap-1 border-2 rounded p-1.5 hover:bg-gray-100 active:bg-gray-200 ${props.className}`} onClick={props.onClick}>
      {props.icon && <props.icon color={props.iconColor} size={20} />}
      {props.text && <span className="">{props.text}</span>}
    </button>
  );
};
