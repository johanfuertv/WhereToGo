import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import CityReviews from "@/components/city-reviews"
import CityMap from "@/components/city-map"
import BusinessPromotion from "@/components/business-promotion"

export default function BuscarPlan() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Botones de categorías */}
        <div className="container py-6">
          <div className="flex justify-center gap-4">
            <Link href="/buscar-plan/restaurantes">
              <Button variant="outline" className="flex items-center gap-2">
                Restaurantes
              </Button>
            </Link>
            <Link href="/buscar-plan/actividades">
              <Button variant="outline" className="flex items-center gap-2">
                Actividades
              </Button>
            </Link>
            <Link href="/buscar-plan/hoteles">
              <Button variant="outline" className="flex items-center gap-2">
                Hoteles
              </Button>
            </Link>
          </div>
        </div>

        {/* Información de la ciudad */}
        <div className="container py-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <div className="relative h-[300px] rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=600"
                  alt="Guadalajara de Buga"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="md:w-1/2">
              <h1 className="text-3xl font-bold mb-4">Guadalajara de Buga</h1>
              <p className="text-muted-foreground mb-4">
                Guadalajara de Buga, conocida simplemente como Buga, es una ciudad histórica ubicada en el Valle del
                Cauca, Colombia. Famosa por su Basílica del Señor de los Milagros, que atrae a miles de peregrinos cada
                año, Buga combina perfectamente el turismo religioso con su rica historia colonial, hermosos paisajes
                naturales y una gastronomía deliciosa.
              </p>
              <p className="text-muted-foreground mb-4">
                La ciudad ofrece una experiencia auténtica colombiana con su arquitectura colonial bien preservada,
                calles empedradas y una atmósfera tranquila. Es un destino ideal para quienes buscan conocer la cultura
                vallecaucana y disfrutar de la hospitalidad de sus habitantes.
              </p>
            </div>
          </div>
        </div>

        {/* Secciones de lugares */}
        <div className="bg-muted/30 py-8">
          <div className="container">
            <h2 className="text-2xl font-bold mb-6">Hoteles destacados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["Hotel Guadalajara", "Hotel El Faro", "Hotel Chrisban"].map((hotel, index) => (
                <Link href={`/buscar-plan/hoteles/${hotel.toLowerCase().replace(/\s+/g, "-")}`} key={index}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src={`/placeholder.svg?height=200&width=300&text=${encodeURIComponent(hotel)}`}
                        alt={hotel}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">{hotel}</h3>
                      <p className="text-sm text-muted-foreground">Guadalajara de Buga</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="py-8">
          <div className="container">
            <h2 className="text-2xl font-bold mb-6">Restaurantes recomendados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["Peru Cook", "Chuleta Don Carlos", "Panadería Casita del Pandebono"].map((restaurant, index) => (
                <Link href={`/buscar-plan/restaurantes/${restaurant.toLowerCase().replace(/\s+/g, "-")}`} key={index}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src={`/placeholder.svg?height=200&width=300&text=${encodeURIComponent(restaurant)}`}
                        alt={restaurant}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">{restaurant}</h3>
                      <p className="text-sm text-muted-foreground">Guadalajara de Buga</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-muted/30 py-8">
          <div className="container">
            <h2 className="text-2xl font-bold mb-6">Actividades populares</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["Visita a la Basílica", "Tour por el Centro Histórico", "Reserva Natural Laguna de Sonso"].map(
                (activity, index) => (
                  <Link href={`/buscar-plan/actividades/${activity.toLowerCase().replace(/\s+/g, "-")}`} key={index}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48">
                        <Image
                          src={`/placeholder.svg?height=200&width=300&text=${encodeURIComponent(activity)}`}
                          alt={activity}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg">{activity}</h3>
                        <p className="text-sm text-muted-foreground">Guadalajara de Buga</p>
                      </CardContent>
                    </Card>
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Mapa de la ciudad */}
        <div className="py-8">
          <div className="container">
            <h2 className="text-2xl font-bold mb-6">Ubicación</h2>
            <CityMap />
          </div>
        </div>

        {/* Opiniones sobre la ciudad */}
        <div className="bg-muted/30 py-8">
          <div className="container">
            <h2 className="text-2xl font-bold mb-6">Opiniones sobre Guadalajara de Buga</h2>
            <CityReviews cityId="buga" />
          </div>
        </div>

        {/* Promoción de negocios */}
        <BusinessPromotion />
      </main>
      <Footer />
    </div>
  )
}
