"use client"

import { useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import UserMenu from "./auth/user-menu"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            WhereToGo
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/buscar-plan" className="text-sm font-medium transition-colors hover:text-primary">
              Buscar Plan
            </Link>
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Buscar Transporte
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar destinos..." className="w-full pl-8" />
          </div>

          <UserMenu />

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden container py-4 border-t">
          <nav className="flex flex-col gap-4">
            <Link href="/buscar-plan" className="text-sm font-medium">
              Buscar Plan
            </Link>
            <Link href="#" className="text-sm font-medium">
              Buscar Transporte
            </Link>
          </nav>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar destinos..." className="w-full pl-8" />
          </div>
        </div>
      )}
    </header>
  )
}
