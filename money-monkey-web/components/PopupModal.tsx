"use client";

import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import { MdClose } from "react-icons/md";

type PopupModalProps = {
  visible: boolean;
  title: string;
  onClose: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  children: React.ReactNode;
};

export default function PopupModal({
  visible,
  title,
  onClose,
  children,
}: PopupModalProps) {
  // disable scrolling
  useEffect(() => {
    document.body.style.overflow = visible ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [visible]);

  return (
    <div
      className={cn(
        "z-50 transition w-screen h-screen fixed left-0 top-0 flex items-center justify-center",
        visible ? "bg-gray-200 bg-opacity-75" : "pointer-events-none"
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          "transition-all w-80 md:w-96 flex justify-center flex-col gap-1 p-[18px] pt-2 bg-white border-2 rounded-xl [&_label]:pr-2",
          visible ? "scale-100" : "scale-0"
        )}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onKeyDown={(e) => {
          // todo: not sure about this
          if (e.key === "Tab") {
            e.stopPropagation();
          }
        }}
        role="dialog"
        aria-modal="true"
      >
        <div className="relative w-full h-10">
          <h2 className="pl-2 py-2 text-md font-semibold mb-2 ">{title}</h2>
          <button
            className="absolute top-0 right-[-0.5rem] rounded-full hover:bg-gray-400 p-0 hover:p-2 m-2 hover:m-0 transition-all "
            type="button"
            onClick={onClose}
            aria-label={`Close ${title} modal`}
          >
            <MdClose size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
