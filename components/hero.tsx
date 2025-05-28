"use client"
import dynamic from "next/dynamic"

// Importar el mapa dinámicamente para evitar errores de SSR
const MapWithNoSSR = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-200 animate-pulse flex items-center justify-center">
      <p className="text-gray-500">Cargando mapa...</p>
    </div>
  ),
})

export default function Hero() {
  return (
    <section className="w-full">
      <div className="w-full h-[400px] relative z-10">
        <MapWithNoSSR />
      </div>
    </section>
  )
}
