"use client"

import type React from "react"

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
import { MapPin, Phone, Globe, Star, StarHalf, Loader2, Heart, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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

  const [restaurant, setRestaurant] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [otherRestaurants, setOtherRestaurants] = useState<any[]>([])
  const [isFav, setIsFav] = useState(false)
  const [activeTab, setActiveTab] = useState("info")

  // Añadir estado para manejar errores
  const [error, setError] = useState<string | null>(null)

  // Initialize auth and favorites outside of useEffect to avoid hook call issues
  const auth = useAuth()
  const { user } = auth

  const favoritesService = useFavorites()
  const { addFavorite, removeFavorite, isFavorite, isServiceAvailable: isFavoritesAvailable } = favoritesService

  // Inicializar el servicio de reseñas
  const {
    reviews,
    isLoading: reviewsLoading,
    isServiceAvailable: isReviewsAvailable,
    addReview,
    getUserReview,
    updateReview,
  } = useReviewsService(id as string, "restaurant")

  // Estado para el formulario de reseñas
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState<string | null>(null)
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const userReview = getUserReview()

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
      try {
        setIsFav(isFavorite(restaurant.id))
      } catch (error) {
        console.warn("Error checking favorite status:", error)
      }
    }
  }, [restaurant, isFavorite])

  const handleToggleFavorite = async () => {
    if (!user) {
      alert("Debes iniciar sesión para guardar favoritos")
      return
    }

    try {
      setError(null)
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
      setError(error instanceof Error ? error.message : "Error al gestionar favorito")
    }
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setReviewError(null)
    setReviewSuccess(null)
    setIsSubmitting(true)

    try {
      if (userReview && isEditing) {
        await updateReview(userReview.id, rating, comment)
        setIsEditing(false)
        setReviewSuccess("Tu reseña ha sido actualizada correctamente")
      } else {
        await addReview(rating, comment)
        setReviewSuccess("Tu reseña ha sido publicada correctamente")
      }
      setComment("")
      setRating(5)
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : "Error al enviar la reseña")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditReview = () => {
    if (userReview) {
      setRating(userReview.rating)
      setComment(userReview.comment)
      setIsEditing(true)
      setReviewSuccess(null)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setRating(5)
    setComment("")
    setReviewError(null)
    setReviewSuccess(null)
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

  const SelectableRatingStars = () => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
            <Star className={`h-6 w-6 ${rating >= star ? "fill-primary text-primary" : "text-muted-foreground"}`} />
          </button>
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

        {/* Mensaje de error para favoritos */}
        {error && (
          <div className="container mt-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Contenido principal */}
        <div className="container py-8">
          <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab}>
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

                {!isReviewsAvailable && (
                  <Alert variant="warning" className="bg-amber-50 border-amber-200">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      El servicio de reseñas está temporalmente no disponible. Mostrando datos almacenados localmente.
                    </AlertDescription>
                  </Alert>
                )}

                {reviewError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{reviewError}</AlertDescription>
                  </Alert>
                )}

                {reviewSuccess && (
                  <Alert variant="default" className="bg-green-50 border-green-200">
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{reviewSuccess}</AlertDescription>
                  </Alert>
                )}

                {/* Formulario para dejar reseña */}
                {user && (!userReview || isEditing) && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-4">
                        {isEditing ? "Editar tu opinión" : `Comparte tu opinión sobre ${restaurant.name}`}
                      </h3>
                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">Tu calificación</label>
                          <SelectableRatingStars />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="comment" className="block text-sm font-medium">
                            Tu comentario
                          </label>
                          <Textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder={`Comparte tu experiencia en ${restaurant.name}...`}
                            rows={4}
                            required
                            disabled={isSubmitting || !isReviewsAvailable}
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button type="submit" disabled={isSubmitting || !isReviewsAvailable}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEditing ? "Actualizar opinión" : "Enviar opinión"}
                          </Button>

                          {isEditing && (
                            <Button type="button" variant="outline" onClick={handleCancelEdit} disabled={isSubmitting}>
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                {/* Reseña del usuario actual */}
                {userReview && !isEditing && (
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarFallback>{user?.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <h3 className="font-semibold">
                                {user?.name} <span className="text-xs text-primary">(Tú)</span>
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                {new Date(userReview.date).toLocaleDateString()}
                              </p>
                            </div>
                            <RatingStars rating={userReview.rating} />
                          </div>
                          <p className="text-sm">{userReview.comment}</p>
                          <Button
                            variant="link"
                            className="p-0 h-auto text-xs mt-2"
                            onClick={handleEditReview}
                            disabled={!isReviewsAvailable}
                          >
                            Editar opinión
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Lista de reseñas */}
                {reviewsLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : reviews.filter((review) => !user || review.userId !== user.id).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews
                      .filter((review) => !user || review.userId !== user.id)
                      .map((review) => (
                        <Card key={review.id}>
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <Avatar>
                                <AvatarFallback>{review.userName.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-2">
                                  <div>
                                    <h3 className="font-semibold">{review.userName}</h3>
                                    <p className="text-xs text-muted-foreground">
                                      {new Date(review.date).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <RatingStars rating={review.rating} />
                                </div>
                                <p className="text-sm">{review.comment}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {user && userReview
                        ? "No hay más opiniones sobre este restaurante."
                        : "No hay opiniones sobre este restaurante. ¡Sé el primero en compartir tu experiencia!"}
                    </p>
                  </div>
                )}
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
