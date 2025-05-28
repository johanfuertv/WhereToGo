"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-context"
import * as RatingsAPI from "./ratings-api"
import type { Rating, RatingAverage } from "./ratings-api"

export type { Rating, RatingAverage } from "./ratings-api"

export const useRatingsService = (placeId?: string, placeType?: "restaurant" | "hotel" | "activity" | "city") => {
  const { user } = useAuth()
  const [ratings, setRatings] = useState<Rating[]>([])
  const [ratingAverage, setRatingAverage] = useState<RatingAverage | null>(null)
  const [userRating, setUserRating] = useState<Rating | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isServiceAvailable, setIsServiceAvailable] = useState(true)
  const [lastCheckTime, setLastCheckTime] = useState(0)
  const CHECK_INTERVAL = 60000 // 60 segundos entre verificaciones

  // Verificar disponibilidad del servicio
  const checkServiceAvailability = async () => {
    // Evitar verificaciones demasiado frecuentes
    if (Date.now() - lastCheckTime < CHECK_INTERVAL) {
      return
    }

    try {
      const isAvailable = await RatingsAPI.checkServiceHealth()
      // Solo actualizar el estado si ha cambiado para evitar re-renderizados innecesarios
      if (isAvailable !== isServiceAvailable) {
        setIsServiceAvailable(isAvailable)
        console.log("Estado del servicio de calificaciones:", isAvailable ? "Disponible" : "No disponible")
      }
      setLastCheckTime(Date.now())
    } catch (error) {
      console.error("Error al verificar disponibilidad del servicio de calificaciones:", error)
      if (isServiceAvailable) {
        setIsServiceAvailable(false)
      }
      setLastCheckTime(Date.now())
    }
  }

  // Cargar datos al iniciar o cuando cambian los parámetros
  useEffect(() => {
    if (placeId && placeType) {
      loadRatingsData()
    } else {
      setRatings([])
      setRatingAverage(null)
      setUserRating(null)
      setIsLoading(false)
    }

    // Verificar periódicamente
    const interval = setInterval(() => {
      // Solo verificar si ha pasado suficiente tiempo desde la última verificación
      if (Date.now() - lastCheckTime >= CHECK_INTERVAL) {
        checkServiceAvailability()
      }
    }, CHECK_INTERVAL)

    return () => clearInterval(interval)
  }, [placeId, placeType, user, lastCheckTime])

  const loadRatingsData = async () => {
    if (!placeId || !placeType) return

    setIsLoading(true)
    try {
      // Cargar calificaciones y promedio en paralelo
      const [ratingsData, averageData] = await Promise.all([
        RatingsAPI.getRatings(placeId, placeType),
        RatingsAPI.getRatingAverage(placeId, placeType),
      ])

      setRatings(ratingsData)
      setRatingAverage(averageData)

      // Actualizar el estado de disponibilidad del servicio
      setIsServiceAvailable(true)
      setLastCheckTime(Date.now())

      // Si hay un usuario logueado, intentar cargar su calificación específica
      if (user) {
        try {
          const userRatingData = await RatingsAPI.getUserRating(user.id, placeId, placeType)
          setUserRating(userRatingData)
        } catch (error) {
          console.error("Error al cargar la calificación del usuario:", error)
          // Intentamos encontrar la calificación del usuario en las calificaciones cargadas
          const foundUserRating = ratingsData.find((rating) => rating.userId === user.id)
          setUserRating(foundUserRating || null)
        }
      } else {
        setUserRating(null)
      }
    } catch (error) {
      console.error("Error loading ratings data:", error)
      // Si hay un error al cargar, asumimos que el servicio no está disponible
      setIsServiceAvailable(false)
      setLastCheckTime(Date.now())
    } finally {
      setIsLoading(false)
    }
  }

  const addOrUpdateRating = async (rating: number) => {
    if (!isServiceAvailable) {
      throw new Error("El servicio de calificaciones no está disponible. No puedes calificar en este momento.")
    }

    if (!user) {
      throw new Error("Debes iniciar sesión para calificar")
    }

    if (!placeId || !placeType) {
      throw new Error("Información del lugar incompleta")
    }

    try {
      const newRating = await RatingsAPI.addOrUpdateRating({
        placeId,
        placeType,
        userId: user.id,
        userName: user.name,
        rating,
      })

      // Actualizar el estado local
      setUserRating(newRating)

      // Recargar los datos para obtener el nuevo promedio
      await loadRatingsData()

      // Actualizar el estado de disponibilidad del servicio
      setIsServiceAvailable(true)
      setLastCheckTime(Date.now())

      return newRating
    } catch (error) {
      console.error("Error adding/updating rating:", error)
      // Si hay un error al añadir, verificamos si el servicio sigue disponible
      setIsServiceAvailable(false)
      setLastCheckTime(Date.now())
      throw error
    }
  }

  const getUserRatingValue = () => {
    return userRating?.rating || 0
  }

  const hasUserRated = () => {
    return userRating !== null
  }

  return {
    ratings,
    ratingAverage,
    userRating,
    isLoading,
    isServiceAvailable,
    addOrUpdateRating,
    getUserRatingValue,
    hasUserRated,
    refreshData: loadRatingsData,
  }
}
