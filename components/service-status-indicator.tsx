"use client"
import { useFavorites } from "./favorites-context"
import { useReviews } from "./reviews-context"
import { Wifi, WifiOff } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export const ServiceStatusIndicator = () => {
  // Inicializar con manejo de errores
  const [favoritesAvailable, setFavoritesAvailable] = useState(true)
  const [isReviewsAvailable, setIsReviewsAvailable] = useState(true)
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true)
  const [showIndicator, setShowIndicator] = useState(true)

  // Initialize contexts outside of the useEffect to avoid conditional hook calls
  const favoritesContext = useFavorites()
  const reviewsContext = useReviews()

  useEffect(() => {
    try {
      setFavoritesAvailable(favoritesContext.isServiceAvailable)
    } catch (error) {
      console.warn("Servicio de favoritos no inicializado correctamente")
      setFavoritesAvailable(false)
    }

    try {
      setIsReviewsAvailable(reviewsContext.isServiceAvailable)
    } catch (error) {
      console.warn("Servicio de reseñas no inicializado correctamente")
      setIsReviewsAvailable(false)
    }

    // Detectar cambios en la conectividad
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [favoritesContext, reviewsContext])

  // Actualizar periódicamente el estado de los servicios
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        setFavoritesAvailable(favoritesContext.isServiceAvailable)
      } catch (error) {
        setFavoritesAvailable(false)
      }

      try {
        setIsReviewsAvailable(reviewsContext.isServiceAvailable)
      } catch (error) {
        setIsReviewsAvailable(false)
      }
    }, 30000) // Verificar cada 30 segundos en lugar de 10 segundos

    return () => clearInterval(interval)
  }, [favoritesContext, reviewsContext])

  // Si todo está bien, no mostrar el indicador
  if ((favoritesAvailable && isReviewsAvailable && isOnline) || !showIndicator) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg">
      <div className="flex items-center gap-3">
        {!isOnline ? (
          <>
            <WifiOff className="h-5 w-5 text-amber-500" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">Modo sin conexión</span>
              <span className="text-xs text-muted-foreground">Algunas funciones están limitadas</span>
            </div>
          </>
        ) : (
          <>
            <Wifi className="h-5 w-5 text-amber-500" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">Servicios limitados</span>
              <div className="flex flex-col text-xs text-muted-foreground">
                {!favoritesAvailable && (
                  <span>
                    • Favoritos: No disponible - Ejecuta{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded">node server.js</code> en
                    microservices/favorites-service
                  </span>
                )}
                {!isReviewsAvailable && (
                  <span>
                    • Reseñas: No disponible - Ejecuta{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded">node server.js</code> en
                    microservices/reviews-service
                  </span>
                )}
              </div>
            </div>
          </>
        )}
        <Button variant="ghost" size="sm" className="ml-2 h-6 w-6 p-0" onClick={() => setShowIndicator(false)}>
          &times;
        </Button>
      </div>
    </div>
  )
}
