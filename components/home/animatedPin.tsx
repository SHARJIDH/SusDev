"use client";
import React from "react";
import { PinContainer } from "../ui/3d-pin";
import Image from 'next/image';

export function AnimatedPin({ devlink, title, description, imageUrl }) {
  return (
    <div className="h-[30rem] w-full flex items-center justify-center">
      <PinContainer
        title={title}
        href={devlink}
      >
        <div className="flex flex-col p-4 tracking-tight text-slate-100/50 w-[16rem] h-[16rem]">
          <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
            {title}
          </h3>
          <div className="text-base !m-0 !p-0 font-normal mb-4">
            <span className="text-slate-500">
              {description}
            </span>
          </div>
          <div className="relative flex-1 w-full rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
      </PinContainer>
    </div>
  );
}