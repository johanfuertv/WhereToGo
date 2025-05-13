"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { useFavorites } from "@/components/favorites-context"
import { useAuth } from "@/components/auth/auth-context"
import { Heart, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react"

const destinations = [
  { id: "cali", name: "Cali", image: "/placeholder.svg?height=200&width=300", description: "La capital de la salsa" },
  {
    id: "medellin",
    name: "Medellín",
    image: "/placeholder.svg?height=200&width=300",
    description: "La ciudad de la eterna primavera",
  },
  { id: "tulua", name: "Tuluá", image: "/placeholder.svg?height=200&width=300", description: "Corazón del Valle" },
  { id: "cartagena", name: "Cartagena", image: "/placeholder.svg?height=200&width=300", description: "La heroica" },
  {
    id: "bogota",
    name: "Bogotá",
    image: "/placeholder.svg?height=200&width=300",
    description: "La capital de Colombia",
  },
  {
    id: "santa-marta",
    name: "Santa Marta",
    image: "/placeholder.svg?height=200&width=300",
    description: "La perla del Caribe",
  },
  { id: "popayan", name: "Popayán", image: "/placeholder.svg?height=200&width=300", description: "La ciudad blanca" },
  {
    id: "bucaramanga",
    name: "Bucaramanga",
    image: "/placeholder.svg?height=200&width=300",
    description: "La ciudad de los parques",
  },
  { id: "pasto", name: "Pasto", image: "/placeholder.svg?height=200&width=300", description: "Ciudad sorpresa" },
]

export default function Destinations() {
  // Inicializar auth y favorites con manejo de errores
  const auth = useAuth()
  const { user } = auth || { user: null }

  const favoritesService = useFavorites()
  const { isServiceAvailable, addFavorite, removeFavorite, isFavorite } = favoritesService || {
    favorites: [],
    isServiceAvailable: true,
    addFavorite: async () => false,
    removeFavorite: async () => false,
    isFavorite: () => false,
  }

  const [showServiceAlert, setShowServiceAlert] = useState(!isServiceAvailable)

  const handleToggleFavorite = async (destination: any) => {
    if (!user) {
      alert("Debes iniciar sesión para guardar favoritos")
      return
    }

    try {
      const isFav = isFavorite(destination.id)
      if (isFav) {
        await removeFavorite(destination.id)
      } else {
        await addFavorite({
          id: destination.id,
          name: destination.name,
          type: "activity", // Consideramos los destinos como actividades
          image: destination.image,
          location: "Colombia",
        })
      }
    } catch (error) {
      console.error("Error al gestionar favorito:", error)
    }
  }

  return (
    <section className="py-12 container">
      <h2 className="text-3xl font-bold text-center mb-8">Planifica tu viaje perfecto</h2>

      {showServiceAlert && !isServiceAvailable && (
        <Alert variant="warning" className="bg-amber-50 border-amber-200 mb-6">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            El servicio de favoritos está temporalmente no disponible. Algunas funciones pueden estar limitadas.
            <Button
              variant="link"
              className="p-0 h-auto text-amber-800 underline ml-2"
              onClick={() => setShowServiceAlert(false)}
            >
              Cerrar
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {destinations.map((destination, index) => {
          const isFav = isFavorite(destination.id)

          return (
            <Card key={index} className="overflow-hidden">
              <div className="relative">
                <div className="relative h-48">
                  <Image
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    fill
                    className="object-cover"
                  />
                </div>
                {user && (
                  <Button
                    variant={isFav ? "default" : "outline"}
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                    onClick={() => handleToggleFavorite(destination)}
                  >
                    <Heart className={`h-4 w-4 ${isFav ? "fill-primary text-primary" : "text-gray-600"}`} />
                    <span className="sr-only">{isFav ? "Quitar de favoritos" : "Añadir a favoritos"}</span>
                  </Button>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-semibold">{destination.name}</h3>
                <p className="text-muted-foreground">{destination.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
