"use client"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { LogOut, ShieldAlert } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/enter"
          },
        },
      })
    } catch (error) {
      toast.error("Failed to sign out")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 mt-12 pb-12">
      <div className="flex flex-col gap-1">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Security Access</h3>
        <p className="text-[9px] text-zinc-600 uppercase font-bold italic">Session & Identity Terminal</p>
      </div>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            disabled={isLoading}
            variant="outline" 
            className="w-full h-12 border-white/5 bg-transparent text-white font-black uppercase italic tracking-tighter hover:bg-white hover:text-black hover:border-white transition-all rounded-none group"
          >
            <LogOut className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            Terminating Sessions
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-black border border-white/10 text-white rounded-none">
          <AlertDialogHeader>
            <div className="flex items-center gap-2 mb-2 text-white">
              <ShieldAlert className="h-5 w-5 text-zinc-500" />
              <AlertDialogTitle className="font-black italic uppercase tracking-tighter">Confirm Logout</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest leading-relaxed">
              Are you sure you want to terminate your current authorized session? You will require a new verification code to bypass the terminal again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col md:flex-row gap-2 mt-4">
            <AlertDialogCancel className="bg-transparent border border-white/5 text-zinc-500 hover:text-white hover:bg-zinc-900 font-bold uppercase text-[9px] tracking-widest rounded-none">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSignOut}
              className="bg-zinc-900 border border-white/10 text-white hover:bg-white hover:text-black font-black uppercase italic tracking-tighter rounded-none"
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
