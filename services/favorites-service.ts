"use client"

// Microservicio para gestionar favoritos
import { useState, useEffect } from "react"

export interface FavoritePlace {
  id: string
  name: string
  type: "restaurant" | "hotel" | "activity"
  image: string
  location: string
}

// Simulación de un servicio de favoritos
export const useFavoritesService = () => {
  const [favorites, setFavorites] = useState<FavoritePlace[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isServiceAvailable, setIsServiceAvailable] = useState(true)

  // Cargar favoritos al iniciar
  useEffect(() => {
    loadFavorites()

    // Simular verificación periódica del servicio
    const interval = setInterval(() => {
      // 98% de disponibilidad simulada
      setIsServiceAvailable(Math.random() > 0.02)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const loadFavorites = async () => {
    setIsLoading(true)
    try {
      // Simular carga desde localStorage (en producción sería una API)
      const storedFavorites = localStorage.getItem("favorites")
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites))
      }
    } catch (error) {
      console.error("Error loading favorites:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addFavorite = async (place: FavoritePlace) => {
    if (!isServiceAvailable) {
      throw new Error("El servicio de favoritos no está disponible en este momento")
    }

    // Verificar si ya existe
    const exists = favorites.some((fav) => fav.id === place.id)
    if (exists) return

    const newFavorites = [...favorites, place]
    setFavorites(newFavorites)
    localStorage.setItem("favorites", JSON.stringify(newFavorites))
    return true
  }

  const removeFavorite = async (placeId: string) => {
    if (!isServiceAvailable) {
      throw new Error("El servicio de favoritos no está disponible en este momento")
    }

    const newFavorites = favorites.filter((fav) => fav.id !== placeId)
    setFavorites(newFavorites)
    localStorage.setItem("favorites", JSON.stringify(newFavorites))
    return true
  }

  const isFavorite = (placeId: string) => {
    return favorites.some((fav) => fav.id === placeId)
  }

  return {
    favorites,
    isLoading,
    isServiceAvailable,
    addFavorite,
    removeFavorite,
    isFavorite,
  }
}
