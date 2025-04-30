"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "traveler" | "business" | null
export type BusinessType = "hotel" | "restaurant" | "transport" | "tour" | "other" | null

export interface BusinessDetails {
  name: string
  type: BusinessType
  address: string
  city: string
  description: string
}

export interface PaymentMethod {
  type: "credit_card" | "bank_account"
  lastFour?: string
  bank?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  businessDetails?: BusinessDetails
  paymentMethods?: PaymentMethod[]
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthServiceAvailable: boolean
  login: (email: string, password: string) => Promise<void>
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    businessDetails?: BusinessDetails,
    paymentMethod?: PaymentMethod,
  ) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthServiceAvailable, setIsAuthServiceAvailable] = useState(true)

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)

    // Check if auth service is available
    checkAuthService()
  }, [])

  // Periodically check if auth service is available
  const checkAuthService = async () => {
    try {
      // In a real app, this would be an API call to the auth service health endpoint
      // For demo purposes, we'll simulate a 95% uptime
      const isAvailable = Math.random() > 0.05
      setIsAuthServiceAvailable(isAvailable)
    } catch (error) {
      setIsAuthServiceAvailable(false)
    }
  }

  // Set up periodic health check
  useEffect(() => {
    const interval = setInterval(checkAuthService, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      if (!isAuthServiceAvailable) {
        throw new Error(
          "El servicio de autenticación no está disponible en este momento. Por favor, inténtelo más tarde.",
        )
      }

      // Simulate API call to auth service
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, we'll accept any email/password and create a mock user
      // In a real app, this would validate credentials against the auth service
      const mockUser: User = {
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        name: email.split("@")[0],
        email,
        role: email.includes("business") ? "business" : "traveler",
        ...(email.includes("business") && {
          businessDetails: {
            name: "Negocio Demo",
            type: "hotel",
            address: "Calle Principal 123",
            city: "Bogotá",
            description: "Un negocio de demostración",
          },
          paymentMethods: [
            {
              type: "credit_card",
              lastFour: "4242",
            },
          ],
        }),
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    businessDetails?: BusinessDetails,
    paymentMethod?: PaymentMethod,
  ) => {
    setIsLoading(true)
    try {
      if (!isAuthServiceAvailable) {
        throw new Error(
          "El servicio de autenticación no está disponible en este momento. Por favor, inténtelo más tarde.",
        )
      }

      // Simulate API call to auth service
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, create a mock user
      const mockUser: User = {
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        name,
        email,
        role,
        ...(role === "business" && {
          businessDetails,
          paymentMethods: paymentMethod ? [paymentMethod] : [],
        }),
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthServiceAvailable, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
