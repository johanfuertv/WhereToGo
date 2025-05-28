"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useFavoritesService, type FavoritePlace } from "@/services/favorites-service"

interface FavoritesContextType {
  favorites: FavoritePlace[]
  isLoading: boolean
  isServiceAvailable: boolean
  addFavorite: (place: FavoritePlace) => Promise<boolean>
  removeFavorite: (id: string) => Promise<boolean>
  isFavorite: (id: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const favoritesService = useFavoritesService()

  return <FavoritesContext.Provider value={favoritesService}>{children}</FavoritesContext.Provider>
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites debe ser usado dentro de un FavoritesProvider")
  }
  return context
}
