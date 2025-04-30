"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { useFavoritesService, type FavoritePlace } from "@/services/favorites-service"

interface FavoritesContextType {
  favorites: FavoritePlace[]
  isLoading: boolean
  isServiceAvailable: boolean
  addFavorite: (place: FavoritePlace) => Promise<boolean | undefined>
  removeFavorite: (placeId: string) => Promise<boolean | undefined>
  isFavorite: (placeId: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const favoritesService = useFavoritesService()

  return <FavoritesContext.Provider value={favoritesService}>{children}</FavoritesContext.Provider>
}
