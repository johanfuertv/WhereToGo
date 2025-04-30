"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useFavorites } from "@/components/favorites-context"
import { useAuth } from "@/components/auth/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import Link from "next/link"

export default function FavoritosPage() {
  const { user } = useAuth()
  const { favorites, isLoading, isServiceAvailable, removeFavorite } = useFavorites()
  const [activeTab, setActiveTab] = useState<"all" | "restaurants" | "hotels" | "activities">("all")

  const filteredFavorites =
    activeTab === "all"
      ? favorites
      : favorites.filter((fav) => {
          if (activeTab === "restaurants") return fav.type === "restaurant"
          if (activeTab === "hotels") return fav.type === "hotel"
          if (activeTab === "activities") return fav.type === "activity"
          return true
        })

  const handleRemoveFavorite = async (id: string) => {
    try {
      await removeFavorite(id)
    } catch (error) {
      console.error("Error al eliminar favorito:", error)
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Acceso restringido</h1>
            <p className="text-muted-foreground mb-6">Debes iniciar sesión para acceder a tus favoritos.</p>
            <Link href="/">
              <Button>Volver al inicio</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">Mis Favoritos</h1>

        {!isServiceAvailable && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              El servicio de favoritos está temporalmente no disponible. Algunas funciones pueden estar limitadas.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="restaurants">Restaurantes</TabsTrigger>
            <TabsTrigger value="hotels">Hoteles</TabsTrigger>
            <TabsTrigger value="activities">Actividades</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredFavorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFavorites.map((favorite) => (
                  <Card key={favorite.id} className="overflow-hidden">
                    <div className="relative">
                      <div className="relative h-48">
                        <Image
                          src={favorite.image || "/placeholder.svg"}
                          alt={favorite.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        onClick={() => handleRemoveFavorite(favorite.id)}
                        disabled={!isServiceAvailable}
                      >
                        <Heart className="h-4 w-4 fill-white" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <Link href={`/buscar-plan/${favorite.type}s/${favorite.id}`}>
                        <h3 className="font-semibold text-lg hover:text-primary transition-colors">{favorite.name}</h3>
                      </Link>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-muted-foreground">{favorite.location}</span>
                        <span className="mx-2 text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground capitalize">
                          {favorite.type === "restaurant" && "Restaurante"}
                          {favorite.type === "hotel" && "Hotel"}
                          {favorite.type === "activity" && "Actividad"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Heart className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">No tienes favoritos guardados</h2>
                <p className="text-muted-foreground mb-6">
                  Explora restaurantes, hoteles y actividades y guárdalos como favoritos para acceder rápidamente a
                  ellos.
                </p>
                <Link href="/buscar-plan">
                  <Button>Explorar lugares</Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
