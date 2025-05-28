"use client"

import { useState, useCallback, memo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth/auth-context"
import { useRatingsService } from "@/services/ratings-service"

interface RatingInputProps {
  placeId: string
  placeType: "restaurant" | "hotel" | "activity" | "city"
  placeName: string
  onRatingSubmitted?: () => void
}

const RatingInput = memo(({ placeId, placeType, placeName, onRatingSubmitted }: RatingInputProps) => {
  const [selectedRating, setSelectedRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const { user } = useAuth() || { user: null }
  const { userRating, addOrUpdateRating, isServiceAvailable, hasUserRated } = useRatingsService(placeId, placeType)

  // Actualizar selectedRating cuando userRating cambie
  useEffect(() => {
    if (userRating) {
      setSelectedRating(userRating.rating)
    }
  }, [userRating])

  const handleNumberClick = useCallback((rating: number) => {
    setSelectedRating(rating)
    setError(null)
    setSuccess(null)
  }, [])

  const handleNumberHover = useCallback((rating: number) => {
    setHoveredRating(rating)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredRating(0)
  }, [])

  const handleSubmit = async () => {
    if (!user) {
      setError("Debes iniciar sesión para calificar")
      return
    }

    if (selectedRating === 0) {
      setError("Por favor selecciona una calificación del 1 al 5")
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      await addOrUpdateRating(selectedRating)
      setSuccess(hasUserRated() ? "Tu calificación ha sido actualizada" : "Tu calificación ha sido enviada")
      onRatingSubmitted?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar la calificación")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return "Muy malo"
      case 2:
        return "Malo"
      case 3:
        return "Regular"
      case 4:
        return "Bueno"
      case 5:
        return "Excelente"
      default:
        return "Selecciona una calificación"
    }
  }

  const displayRating = hoveredRating || selectedRating

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        {!isServiceAvailable && (
          <Alert variant="warning" className="bg-amber-50 border-amber-200 mb-4">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              El servicio de calificaciones está temporalmente no disponible.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert variant="default" className="bg-green-50 border-green-200 mb-4">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {hasUserRated() ? (
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-3">Tu calificación actual</h3>
            <div className="flex justify-center mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-8 w-8 ${
                    userRating && userRating.rating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Calificaste este lugar con {userRating?.rating} estrella{userRating?.rating !== 1 ? "s" : ""}
            </p>
            <p className="text-xs text-muted-foreground">
              {userRating && `Calificado el ${new Date(userRating.date).toLocaleDateString()}`}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-4">
              {user ? `Califica ${placeName}` : "Inicia sesión para calificar"}
            </h3>

            {user && (
              <>
                <p className="text-sm text-muted-foreground mb-4">Selecciona un número del 1 al 5 para calificar:</p>

                {/* Números de calificación */}
                <div className="flex justify-center gap-3 mb-4" onMouseLeave={handleMouseLeave}>
                  {[1, 2, 3, 4, 5].map((number) => (
                    <button
                      key={number}
                      type="button"
                      className={`
                        w-12 h-12 rounded-full border-2 font-bold text-lg transition-all duration-200 
                        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                        ${
                          displayRating >= number
                            ? "bg-primary text-white border-primary shadow-lg transform scale-110"
                            : "bg-white text-gray-600 border-gray-300 hover:border-primary hover:text-primary hover:scale-105"
                        }
                        ${isSubmitting || !isServiceAvailable ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                      `}
                      onClick={() => handleNumberClick(number)}
                      onMouseEnter={() => handleNumberHover(number)}
                      disabled={isSubmitting || !isServiceAvailable}
                    >
                      {number}
                    </button>
                  ))}
                </div>

                <p className="text-sm font-medium mb-6 h-6 text-primary">
                  {displayRating > 0 ? getRatingText(displayRating) : ""}
                </p>

                <Button
                  onClick={handleSubmit}
                  disabled={selectedRating === 0 || isSubmitting || !isServiceAvailable}
                  className="w-full"
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? "Enviando..." : "Enviar calificación"}
                </Button>
              </>
            )}

            {!user && <p className="text-muted-foreground">Debes iniciar sesión para poder calificar este lugar</p>}
          </div>
        )}
      </CardContent>
    </Card>
  )
})

RatingInput.displayName = "RatingInput"

export default RatingInput
