import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

const destinations = [
  { name: "Cali", image: "/placeholder.svg?height=200&width=300", description: "La capital de la salsa" },
  { name: "Medellín", image: "/placeholder.svg?height=200&width=300", description: "La ciudad de la eterna primavera" },
  { name: "Tuluá", image: "/placeholder.svg?height=200&width=300", description: "Corazón del Valle" },
  { name: "Cartagena", image: "/placeholder.svg?height=200&width=300", description: "La heroica" },
  { name: "Bogotá", image: "/placeholder.svg?height=200&width=300", description: "La capital de Colombia" },
  { name: "Santa Marta", image: "/placeholder.svg?height=200&width=300", description: "La perla del Caribe" },
  { name: "Popayán", image: "/placeholder.svg?height=200&width=300", description: "La ciudad blanca" },
  { name: "Bucaramanga", image: "/placeholder.svg?height=200&width=300", description: "La ciudad de los parques" },
  { name: "Pasto", image: "/placeholder.svg?height=200&width=300", description: "Ciudad sorpresa" },
]

export default function Destinations() {
  return (
    <section className="py-12 container">
      <h2 className="text-3xl font-bold text-center mb-8">Planifica tu viaje perfecto</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {destinations.map((destination, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="relative h-48">
              <Image
                src={destination.image || "/placeholder.svg"}
                alt={destination.name}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold">{destination.name}</h3>
              <p className="text-muted-foreground">{destination.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
