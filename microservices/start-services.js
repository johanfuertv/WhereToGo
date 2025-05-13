const { spawn } = require("child_process")
const path = require("path")

// Función para iniciar un servicio
function startService(serviceName, port) {
  const serviceDir = path.join(__dirname, serviceName)

  console.log(`Iniciando ${serviceName} en el puerto ${port}...`)

  const service = spawn("node", ["server.js"], {
    cwd: serviceDir,
    stdio: "inherit",
  })

  service.on("error", (error) => {
    console.error(`Error al iniciar ${serviceName}:`, error)
  })

  service.on("close", (code) => {
    if (code !== 0) {
      console.log(`${serviceName} se cerró con código: ${code}`)
    }
  })

  return service
}

// Iniciar ambos servicios
const favoritesService = startService("favorites-service", 3001)
const reviewsService = startService("reviews-service", 3002)

// Añadir un mensaje para indicar que los servicios están listos
console.log("\n=== Microservicios WhereToGo ===")
console.log("Servicio de Favoritos: http://localhost:3001")
console.log("Servicio de Reseñas: http://localhost:3002")
console.log("Presiona Ctrl+C para detener los servicios\n")

// Manejar señales para cerrar los servicios correctamente
process.on("SIGINT", () => {
  console.log("Cerrando servicios...")
  favoritesService.kill()
  reviewsService.kill()
  process.exit(0)
})
