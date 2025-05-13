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
import { MapPin, Clock, Calendar, Star, StarHalf, Loader2, Heart, AlertCircle, Users } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Image from "next/image"
import Link from "next/link"
import CityMap from "@/components/city-map"

const activities = [
  {
    id: "visita-a-la-basilica",
    name: "Visita a la Basílica",
    image: "/placeholder.svg?height=400&width=800&text=Basílica",
    description:
      "Visita guiada a la famosa Basílica del Señor de los Milagros, el principal atractivo religioso de Buga. Conoce la historia de este importante santuario religioso, su arquitectura y las tradiciones que lo rodean. Un guía experto te llevará por los rincones más importantes de este lugar sagrado, explicando su significado cultural y religioso para Colombia.",
    rating: 4.9,
    priceRange: "$",
    address: "Calle 3 #16-24, Centro Histórico, Guadalajara de Buga",
    duration: "2 horas",
    category: "Cultural",
    schedule: "Lunes a domingo: 8:00 AM - 6:00 PM",
    groupSize: "Hasta 20 personas",
    includes: ["Guía turístico", "Folleto informativo", "Acceso a todas las áreas"],
    position: [3.9027, -76.3011],
    price: "25.000",
  },
  {
    id: "tour-por-el-centro-historico",
    name: "Tour por el Centro Histórico",
    image: "/placeholder.svg?height=400&width=800&text=Centro%20Histórico",
    description:
      "Recorrido por las calles coloniales y los edificios históricos del centro de Guadalajara de Buga. Este tour te llevará a través de la historia de la ciudad, visitando edificios coloniales, plazas históricas y monumentos importantes. Conocerás la evolución de Buga desde sus orígenes hasta la actualidad, mientras disfrutas de la arquitectura y el ambiente de una de las ciudades más antiguas de Colombia.",
    rating: 4.7,
    priceRange: "$",
    address: "Plaza Cabal, Centro, Guadalajara de Buga",
    duration: "3 horas",
    category: "Cultural",
    schedule: "Martes a domingo: 9:00 AM y 2:00 PM",
    groupSize: "Hasta 15 personas",
    includes: ["Guía turístico", "Refrigerio", "Mapa del centro histórico"],
    position: [3.9012, -76.2978],
    price: "30.000",
  },
  {
    id: "reserva-natural-laguna-de-sonso",
    name: "Reserva Natural Laguna de Sonso",
    image: "/placeholder.svg?height=400&width=800&text=Laguna%20de%20Sonso",
    description:
      "Excursión a la reserva natural más importante del Valle del Cauca, hogar de numerosas especies de aves. La Laguna de Sonso es un humedal de gran importancia ecológica donde podrás observar más de 160 especies de aves, tanto residentes como migratorias. El recorrido incluye caminatas por senderos ecológicos, observación de fauna y flora, y un paseo en bote por la laguna para apreciar el ecosistema desde otra perspectiva.",
    rating: 4.8,
    priceRange: "$$",
    address: "Km 8 vía Buga-Mediacanoa, Valle del Cauca",
    duration: "Medio día",
    category: "Naturaleza",
    schedule: "Miércoles a domingo: 7:00 AM - 4:00 PM",
    groupSize: "Hasta 12 personas",
    includes: [
      "Transporte desde Buga",
      "Guía especializado",
      "Equipo de observación de aves",
      "Refrigerio",
      "Paseo en bote",
    ],
    position: [3.865, -76.35],
    price: "85.000",
  },
]

export default function ActivityDetailPage() {
  const params = useParams()
  const { id } = params

  const [activity, setActivity] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [otherActivities, setOtherActivities] = useState<any[]>([])
  const [isFav, setIsFav] = useState(false)
  const [activeTab, setActiveTab] = useState("info")
  const [error, setError] = useState<string | null>(null)

  // Initialize auth and favorites outside of useEffect to avoid hook call issues
  const auth = useAuth() || { user: null }
  const { user } = auth

  const favoritesService = useFavorites() || {
    addFavorite: async () => false,
    removeFavorite: async () => false,
    isFavorite: () => false,
    isServiceAvailable: true,
  }

  const { addFavorite, removeFavorite, isFavorite, isServiceAvailable: isFavoritesAvailable } = favoritesService

  // Inicializar el servicio de reseñas
  const {
    reviews,
    isLoading: reviewsLoading,
    isServiceAvailable: isReviewsAvailable,
    addReview,
    getUserReview,
    updateReview,
  } = useReviewsService(id as string, "activity")

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
      const foundActivity = activities.find((a) => a.id === id)
      if (foundActivity) {
        setActivity(foundActivity)
        setOtherActivities(activities.filter((a) => a.id !== id))
      }
      setLoading(false)
    }, 500)
  }, [id])

  useEffect(() => {
    if (activity) {
      try {
        setIsFav(isFavorite(activity.id))
      } catch (error) {
        console.warn("Error checking favorite status:", error)
      }
    }
  }, [activity, isFavorite])

  const handleToggleFavorite = async () => {
    if (!user) {
      alert("Debes iniciar sesión para guardar favoritos")
      return
    }

    try {
      setError(null)
      if (isFav) {
        await removeFavorite(activity.id)
        setIsFav(false)
      } else {
        await addFavorite({
          id: activity.id,
          name: activity.name,
          type: "activity",
          image: activity.image,
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

  if (!activity) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Actividad no encontrada</h1>
            <p className="text-muted-foreground mb-6">
              Lo sentimos, la actividad que buscas no existe o ha sido eliminada.
            </p>
            <Link href="/buscar-plan/actividades">
              <Button>Ver todas las actividades</Button>
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
          <Image src={activity.image || "/placeholder.svg"} alt={activity.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="container py-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{activity.name}</h1>
              <div className="flex items-center gap-2 text-white">
                <RatingStars rating={activity.rating} />
                <span className="text-sm">{activity.rating}</span>
                <span className="text-sm">•</span>
                <span className="text-sm">{activity.priceRange}</span>
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
              <TabsTrigger value="details">Detalles</TabsTrigger>
              <TabsTrigger value="reviews">Opiniones</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-8">
              {/* Descripción */}
              <div>
                <h2 className="text-xl font-semibold mb-3">Descripción general</h2>
                <p className="text-muted-foreground">{activity.description}</p>
              </div>

              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Información básica</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{activity.address}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <span>Duración: {activity.duration}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span>Horario: {activity.schedule}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-primary" />
                        <span>Tamaño del grupo: {activity.groupSize}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Precio y reserva</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg">Precio por persona:</span>
                        <span className="text-lg font-bold">COP ${activity.price}</span>
                      </div>
                      <Button className="w-full">Reservar ahora</Button>
                      <p className="text-xs text-muted-foreground text-center">
                        Cancelación gratuita hasta 24 horas antes
                      </p>
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

            <TabsContent value="details" className="space-y-8">
              <h2 className="text-xl font-semibold mb-3">Detalles de la actividad</h2>

              {/* Lo que incluye */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Lo que incluye</h3>
                  <ul className="space-y-2">
                    {activity.includes.map((item: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Qué llevar */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Qué llevar</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>Ropa cómoda</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>Calzado adecuado</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>Protector solar</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>Cámara fotográfica</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>Botella de agua</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Información adicional */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Información adicional</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>Esta actividad es apta para todas las edades.</p>
                    <p>Se recomienda reservar con al menos 24 horas de anticipación.</p>
                    <p>En caso de mal tiempo, se ofrecerá una fecha alternativa o reembolso completo.</p>
                    <p>Disponible en español e inglés.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Opiniones sobre {activity.name}</h2>

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
                        {isEditing ? "Editar tu opinión" : `Comparte tu opinión sobre ${activity.name}`}
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
                            placeholder={`Comparte tu experiencia en ${activity.name}...`}
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
                        ? "No hay más opiniones sobre esta actividad."
                        : "No hay opiniones sobre esta actividad. ¡Sé el primero en compartir tu experiencia!"}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Actividades recomendadas */}
        <div className="bg-muted/30 py-8">
          <div className="container">
            <h2 className="text-2xl font-semibold mb-6">Otras actividades que te pueden gustar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherActivities.map((item) => (
                <Link href={`/buscar-plan/actividades/${item.id}`} key={item.id}>
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
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.category} • {item.duration}
                      </p>
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
