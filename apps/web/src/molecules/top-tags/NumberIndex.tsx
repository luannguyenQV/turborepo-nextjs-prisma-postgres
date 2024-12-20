"use client"

import React from "react"

import { bebasNeue } from "font"
import { cn } from "ui"

interface NumberIndexProps {
  number: number
}

const NumberIndex: React.FC<NumberIndexProps> = ({ number }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center fill-none stroke-black stroke-1 text-2xl font-extrabold",
        bebasNeue.className
      )}
    >
      {number}.
    </div>
  )
}

export default NumberIndex
