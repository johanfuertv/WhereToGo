"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth/auth-context"
import { useFavorites } from "@/components/favorites-context"
import { useReviewsService } from "@/services/reviews-service"
import { MapPin, Phone, Globe, Star, StarHalf, Loader2, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import CityMap from "@/components/city-map"

const restaurants = [
  {
    id: "peru-cook",
    name: "Peru Cook",
    image: "/placeholder.svg?height=400&width=800&text=Peru%20Cook",
    description:
      "Peru Cook es un restaurante especializado en gastronomía peruana, ofreciendo una experiencia culinaria auténtica con platos como ceviche, lomo saltado, ají de gallina y más. Nuestros chefs utilizan ingredientes frescos y técnicas tradicionales para transportar a nuestros comensales a las diversas regiones de Perú a través de sus sabores.",
    rating: 4.5,
    priceRange: "$$",
    address: "Calle 4 #12-34, Guadalajara de Buga",
    phone: "+57 315 123 4567",
    website: "www.perucook.com",
    hours: {
      monday: "12:00 PM - 10:00 PM",
      tuesday: "12:00 PM - 10:00 PM",
      wednesday: "12:00 PM - 10:00 PM",
      thursday: "12:00 PM - 10:00 PM",
      friday: "12:00 PM - 11:00 PM",
      saturday: "12:00 PM - 11:00 PM",
      sunday: "12:00 PM - 9:00 PM",
    },
    position: [3.9015, -76.2995],
    openNow: true,
  },
  {
    id: "chuleta-don-carlos",
    name: "Chuleta Don Carlos",
    image: "/placeholder.svg?height=400&width=800&text=Chuleta%20Don%20Carlos",
    description:
      "Chuleta Don Carlos es un restaurante tradicional vallecaucano especializado en carnes a la parrilla y la famosa chuleta valluna. Con más de 25 años de experiencia, ofrecemos los mejores cortes de carne, acompañados de patacones, arroz y ensalada fresca. Un lugar ideal para disfrutar de la auténtica gastronomía del Valle del Cauca en un ambiente familiar.",
    rating: 4.7,
    priceRange: "$$",
    address: "Carrera 8 #5-67, Guadalajara de Buga",
    phone: "+57 318 765 4321",
    website: "www.chuletadoncarlos.com",
    hours: {
      monday: "12:00 PM - 9:00 PM",
      tuesday: "12:00 PM - 9:00 PM",
      wednesday: "12:00 PM - 9:00 PM",
      thursday: "12:00 PM - 9:00 PM",
      friday: "12:00 PM - 10:00 PM",
      saturday: "12:00 PM - 10:00 PM",
      sunday: "12:00 PM - 9:00 PM",
    },
    position: [3.9, -76.298],
    openNow: true,
  },
  {
    id: "panaderia-casita-del-pandebono",
    name: "Panadería Casita del Pandebono",
    image: "/placeholder.svg?height=400&width=800&text=Casita%20del%20Pandebono",
    description:
      "La Panadería Casita del Pandebono es un lugar emblemático en Buga donde se elaboran los tradicionales pandebonos, buñuelos y otras delicias de la panadería vallecaucana. Con recetas transmitidas por generaciones, ofrecemos productos frescos horneados diariamente, acompañados de café colombiano de la mejor calidad. Un rincón acogedor para disfrutar de la tradición gastronómica del Valle.",
    rating: 4.8,
    priceRange: "$",
    address: "Calle 7 #9-45, Guadalajara de Buga",
    phone: "+57 312 987 6543",
    website: "www.casitadelpandebono.com",
    hours: {
      monday: "6:00 AM - 8:00 PM",
      tuesday: "6:00 AM - 8:00 PM",
      wednesday: "6:00 AM - 8:00 PM",
      thursday: "6:00 AM - 8:00 PM",
      friday: "6:00 AM - 9:00 PM",
      saturday: "6:00 AM - 9:00 PM",
      sunday: "7:00 AM - 7:00 PM",
    },
    position: [3.902, -76.3005],
    openNow: false,
  },
]

export default function RestaurantDetailPage() {
  const params = useParams()
  const { id } = params
  const { user } = useAuth()
  const [restaurant, setRestaurant] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [otherRestaurants, setOtherRestaurants] = useState<any[]>([])

  // Inicializar el servicio de reseñas y favoritos
  const { reviews, isLoading: reviewsLoading, addReview } = useReviewsService(id as string, "restaurant")
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()

  const [isFav, setIsFav] = useState(false)

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      const foundRestaurant = restaurants.find((r) => r.id === id)
      if (foundRestaurant) {
        setRestaurant(foundRestaurant)
        setOtherRestaurants(restaurants.filter((r) => r.id !== id))
      }
      setLoading(false)
    }, 500)
  }, [id])

  useEffect(() => {
    if (restaurant) {
      setIsFav(isFavorite(restaurant.id))
    }
  }, [restaurant, isFavorite])

  const handleToggleFavorite = async () => {
    if (!user) {
      alert("Debes iniciar sesión para guardar favoritos")
      return
    }

    try {
      if (isFav) {
        await removeFavorite(restaurant.id)
        setIsFav(false)
      } else {
        await addFavorite({
          id: restaurant.id,
          name: restaurant.name,
          type: "restaurant",
          image: restaurant.image,
          location: "Guadalajara de Buga",
        })
        setIsFav(true)
      }
    } catch (error) {
      console.error("Error al gestionar favorito:", error)
    }
  }

  const RatingStars = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
        ))}
        {hasHalfStar && <StarHalf className="h-4 w-4 fill-primary text-primary" />}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={i + fullStars + (hasHalfStar ? 1 : 0)} className="h-4 w-4 text-muted-foreground" />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex justify-center items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Restaurante no encontrado</h1>
            <p className="text-muted-foreground mb-6">
              Lo sentimos, el restaurante que buscas no existe o ha sido eliminado.
            </p>
            <Link href="/buscar-plan/restaurantes">
              <Button>Ver todos los restaurantes</Button>
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
      <main className="flex-1">
        {/* Imagen principal */}
        <div className="relative h-[300px] md:h-[400px]">
          <Image src={restaurant.image || "/placeholder.svg"} alt={restaurant.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="container py-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{restaurant.name}</h1>
              <div className="flex items-center gap-2 text-white">
                <RatingStars rating={restaurant.rating} />
                <span className="text-sm">{restaurant.rating}</span>
                <span className="text-sm">•</span>
                <span className="text-sm">{restaurant.priceRange}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de favoritos */}
        <div className="container relative">
          <Button
            variant={isFav ? "default" : "outline"}
            size="sm"
            className="absolute -top-6 right-6 rounded-full h-12 w-12 p-0 flex items-center justify-center"
            onClick={handleToggleFavorite}
          >
            <Heart className={`h-5 w-5 ${isFav ? "fill-white" : ""}`} />
            <span className="sr-only">{isFav ? "Quitar de favoritos" : "Añadir a favoritos"}</span>
          </Button>
        </div>

        {/* Contenido principal */}
        <div className="container py-8">
          <Tabs defaultValue="info">
            <TabsList className="mb-6">
              <TabsTrigger value="info">Información</TabsTrigger>
              <TabsTrigger value="reviews">Opiniones</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-8">
              {/* Descripción */}
              <div>
                <h2 className="text-xl font-semibold mb-3">Descripción general</h2>
                <p className="text-muted-foreground">{restaurant.description}</p>
              </div>

              {/* Información de contacto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Información de contacto</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{restaurant.address}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-primary" />
                        <span>{restaurant.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-primary" />
                        <a
                          href={`https://${restaurant.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {restaurant.website}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Horario</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Lunes</span>
                        <span>{restaurant.hours.monday}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Martes</span>
                        <span>{restaurant.hours.tuesday}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Miércoles</span>
                        <span>{restaurant.hours.wednesday}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Jueves</span>
                        <span>{restaurant.hours.thursday}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Viernes</span>
                        <span>{restaurant.hours.friday}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sábado</span>
                        <span>{restaurant.hours.saturday}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Domingo</span>
                        <span>{restaurant.hours.sunday}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Ubicación */}
              <div>
                <h2 className="text-xl font-semibold mb-3">Ubicación</h2>
                <div className="h-[400px] relative z-10">
                  <CityMap />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Opiniones sobre {restaurant.name}</h2>

                {/* Componente de reseñas */}
                <div className="space-y-6">
                  {/* Aquí iría el componente de reseñas similar al CityReviews */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-4">Comparte tu opinión sobre {restaurant.name}</h3>
                      <p className="text-muted-foreground mb-4">
                        {user
                          ? "Califica tu experiencia y comparte tu opinión con otros viajeros."
                          : "Inicia sesión para dejar tu opinión sobre este restaurante."}
                      </p>
                      {!user && (
                        <Link href="#">
                          <Button>Iniciar sesión para opinar</Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>

                  {/* Reseñas de ejemplo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-primary/10 rounded-full h-10 w-10 flex items-center justify-center">
                            <span className="font-medium">M</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-2">
                              <div>
                                <h3 className="font-semibold">María González</h3>
                                <p className="text-xs text-muted-foreground">15/04/2023</p>
                              </div>
                              <RatingStars rating={5} />
                            </div>
                            <p className="text-sm">
                              Excelente comida y servicio. Los ceviches son increíbles y el ambiente muy acogedor.
                              Definitivamente volveré.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-primary/10 rounded-full h-10 w-10 flex items-center justify-center">
                            <span className="font-medium">J</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-2">
                              <div>
                                <h3 className="font-semibold">Juan Pérez</h3>
                                <p className="text-xs text-muted-foreground">02/03/2023</p>
                              </div>
                              <RatingStars rating={4.5} />
                            </div>
                            <p className="text-sm">
                              Muy buena experiencia. La comida es auténtica y los precios razonables. El lomo saltado es
                              espectacular.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Restaurantes recomendados */}
        <div className="bg-muted/30 py-8">
          <div className="container">
            <h2 className="text-2xl font-semibold mb-6">Otros restaurantes que te pueden gustar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherRestaurants.map((item) => (
                <Link href={`/buscar-plan/restaurantes/${item.id}`} key={item.id}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">{item.name}</h3>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                          <span className="text-sm">{item.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{item.priceRange}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
