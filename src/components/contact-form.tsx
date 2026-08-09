"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod/v4"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .max(100, "Email must be at most 100 characters"),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(100, "Subject must be at most 100 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be at most 5000 characters"),
  honeypot: z.string().max(0).optional(),
})

type FormValues = z.infer<typeof formSchema>

interface ApiErrorResponse {
  success: false
  error: string
  details?: Array<{ field: string; message: string }>
}

interface ApiSuccessResponse {
  success: true
}

type ApiResponse = ApiErrorResponse | ApiSuccessResponse

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
      honeypot: "",
    },
  })

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const json: ApiResponse = await response.json()

      if (!response.ok || !json.success) {
        const errorMessage =
          "error" in json
            ? json.error
            : "Something went wrong. Please try again."
        toast.error("Failed to send message", {
          description: errorMessage,
        })
        // Form data is preserved — user does not need to retype
        return
      }

      // Success — clear form and show toast
      toast.success("Message Sent!", {
        description: "Thanks for reaching out. I'll get back to you soon.",
      })
      form.reset()
    } catch {
      toast.error("Network error", {
        description: "Could not reach the server. Please check your connection and try again.",
      })
      // Form data is preserved on network error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-card md:bg-muted/10 border border-border/50 rounded-2xl p-6 md:p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Honeypot field — hidden from humans, traps bots */}
          <div className="absolute overflow-hidden" style={{ left: "-9999px", top: "-9999px" }} aria-hidden="true">
            <FormField
              control={form.control}
              name="honeypot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Do not fill this out</FormLabel>
                  <FormControl>
                    <Input tabIndex={-1} autoComplete="off" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input className="placeholder:text-muted-foreground/70" placeholder="e.g. Sarah Jenkins" disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input className="placeholder:text-muted-foreground/70" type="email" placeholder="sarah@techcorp.io" disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input className="placeholder:text-muted-foreground/70" placeholder="e.g. Custom PCB Layout & LoRaWAN Project" disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Briefly describe your hardware requirements, target microcontrollers, or telemetry scope..."
                    className="min-h-35 resize-y placeholder:text-muted-foreground/70"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full h-11 text-base dark:bg-white dark:text-black dark:hover:bg-gray-200 font-semibold transition-colors"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
