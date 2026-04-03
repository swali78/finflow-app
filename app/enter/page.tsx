"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, ArrowRight, ShieldCheck } from "lucide-react"
import Image from "next/image"

export default function EnterPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await authClient.signIn.emailOtp({
        email,
      })

      if (error) {
        toast.error(error.message || "Failed to send code")
        return
      }

      setIsSent(true)
      toast.success("Verification code sent to your email")
    } catch (err) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const [otp, setOtp] = useState("")
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await authClient.signIn.emailOtp({
        email,
        otp,
      })

      if (error) {
        toast.error(error.message || "Invalid code")
        return
      }

      window.location.href = "/dashboard"
    } catch (err) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 antialiased">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
            <Image 
              src="/logo.png" 
              alt="FinFlow" 
              width={32} 
              height={32} 
              className="invert brightness-200"
            />
          </div>
          <div className="text-center group">
            <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white group-hover:scale-105 transition-transform">
              FinFlow Terminal
            </h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-1">
              Secure Intelligence Access
            </p>
          </div>
        </div>

        <Card className="bg-transparent border-white/5 shadow-none">
          {!isSent ? (
            <form onSubmit={handleSignIn}>
              <CardHeader className="text-center px-0">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-white">Identity Verification</CardTitle>
                <CardDescription className="text-[10px] uppercase tracking-wider text-zinc-500">Enter your authorized email to proceed</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 px-0">
                <div className="relative group">
                  <Input 
                    type="email" 
                    placeholder="EMAIL@ACCESS.APP" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toUpperCase())}
                    className="bg-zinc-900/50 border-white/5 h-12 uppercase font-mono text-xs tracking-widest text-white placeholder:text-zinc-700 focus-visible:ring-white/10 transition-all"
                    required
                  />
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-focus-within:opacity-10 pointer-events-none transition-opacity" />
                </div>
                <Button 
                  disabled={isLoading} 
                  className="h-12 bg-white text-black font-black uppercase italic tracking-tighter hover:bg-zinc-200 transition-all rounded-none"
                >
                  {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                  Request Code
                </Button>
              </CardContent>
            </form>
          ) : (
            <form onSubmit={handleVerify}>
              <CardHeader className="text-center px-0">
                <div className="flex justify-center mb-4">
                  <ShieldCheck className="text-emerald-500 h-8 w-8 animate-pulse" />
                </div>
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-white">Auth Code Sent</CardTitle>
                <CardDescription className="text-[10px] uppercase tracking-wider text-zinc-500 italic">Valid for 10 minutes</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 px-0">
                <Input 
                  type="text" 
                  placeholder="000000" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="bg-zinc-900/50 border-white/5 h-12 text-center text-2xl font-mono tracking-[0.5em] text-white placeholder:text-zinc-700 focus-visible:ring-white/10"
                  maxLength={6}
                  required
                />
                <Button 
                  disabled={isLoading} 
                  className="h-12 bg-white text-black font-black uppercase italic tracking-tighter hover:bg-zinc-200"
                >
                  {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Verify Access"}
                </Button>
                <button 
                  type="button"
                  onClick={() => setIsSent(false)}
                  className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 hover:text-white transition-colors"
                >
                  Wrong address? Try again.
                </button>
              </CardContent>
            </form>
          )}
        </Card>

        <footer className="text-center flex flex-col gap-2">
          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
            Level 3 Encryption Active
          </p>
          <div className="flex items-center justify-center gap-4 opacity-20">
            <div className="h-0.5 w-12 bg-white" />
            <div className="h-1 w-1 bg-white rounded-full" />
            <div className="h-0.5 w-12 bg-white" />
          </div>
        </footer>
      </div>
    </div>
  )
}
