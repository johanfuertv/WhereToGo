"use client"

// Microservicio para gestionar reseñas
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-context"

export interface Review {
  id: string
  placeId: string
  placeType: "restaurant" | "hotel" | "activity" | "city"
  userId: string
  userName: string
  rating: number
  comment: string
  date: string
}

export const useReviewsService = (placeId?: string, placeType?: "restaurant" | "hotel" | "activity" | "city") => {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isServiceAvailable, setIsServiceAvailable] = useState(true)

  // Cargar reseñas al iniciar
  useEffect(() => {
    loadReviews()

    // Simular verificación periódica del servicio
    const interval = setInterval(() => {
      // 97% de disponibilidad simulada
      setIsServiceAvailable(Math.random() > 0.03)
    }, 30000)

    return () => clearInterval(interval)
  }, [placeId, placeType])

  const loadReviews = async () => {
    setIsLoading(true)
    try {
      // Simular carga desde localStorage (en producción sería una API)
      const storedReviews = localStorage.getItem("reviews")
      if (storedReviews) {
        const allReviews = JSON.parse(storedReviews) as Review[]

        // Filtrar por placeId y placeType si se proporcionan
        if (placeId && placeType) {
          setReviews(allReviews.filter((review) => review.placeId === placeId && review.placeType === placeType))
        } else {
          setReviews(allReviews)
        }
      }
    } catch (error) {
      console.error("Error loading reviews:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addReview = async (rating: number, comment: string) => {
    if (!isServiceAvailable) {
      throw new Error("El servicio de reseñas no está disponible en este momento")
    }

    if (!user) {
      throw new Error("Debes iniciar sesión para dejar una reseña")
    }

    if (!placeId || !placeType) {
      throw new Error("Información del lugar incompleta")
    }

    // Crear nueva reseña
    const newReview: Review = {
      id: `review_${Date.now()}`,
      placeId,
      placeType,
      userId: user.id,
      userName: user.name,
      rating,
      comment,
      date: new Date().toISOString(),
    }

    // Obtener reseñas existentes
    const storedReviews = localStorage.getItem("reviews")
    let allReviews: Review[] = storedReviews ? JSON.parse(storedReviews) : []

    // Añadir nueva reseña
    allReviews = [...allReviews, newReview]
    localStorage.setItem("reviews", JSON.stringify(allReviews))

    // Actualizar estado
    setReviews((prev) => [...prev, newReview])

    return newReview
  }

  const getUserReview = () => {
    if (!user) return null
    return reviews.find((review) => review.userId === user.id)
  }

  const updateReview = async (reviewId: string, rating: number, comment: string) => {
    if (!isServiceAvailable) {
      throw new Error("El servicio de reseñas no está disponible en este momento")
    }

    if (!user) {
      throw new Error("Debes iniciar sesión para actualizar una reseña")
    }

    // Obtener todas las reseñas
    const storedReviews = localStorage.getItem("reviews")
    if (!storedReviews) return false

    const allReviews: Review[] = JSON.parse(storedReviews)

    // Encontrar y actualizar la reseña
    const updatedReviews = allReviews.map((review) => {
      if (review.id === reviewId && review.userId === user.id) {
        return {
          ...review,
          rating,
          comment,
          date: new Date().toISOString(),
        }
      }
      return review
    })

    // Guardar reseñas actualizadas
    localStorage.setItem("reviews", JSON.stringify(updatedReviews))

    // Actualizar estado
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId ? { ...review, rating, comment, date: new Date().toISOString() } : review,
      ),
    )

    return true
  }

  return {
    reviews,
    isLoading,
    isServiceAvailable,
    addReview,
    getUserReview,
    updateReview,
  }
}
