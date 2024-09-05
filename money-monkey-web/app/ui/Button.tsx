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
    <button className={`flex items-center gap-2 border-2 rounded p-2 active:bg-green-600 ${props.className}`} onClick={props.onClick}>
      {props.icon && <props.icon color={props.iconColor} size={24} />}
      {props.text && <span className="">{props.text}</span>}
    </button>
  );
};
