"use client"

import * as React from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ProjectMedia } from "@/lib/data/projects"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

interface MediaCarouselProps {
  media: ProjectMedia[]
}

function CarouselVideo({
  item,
}: {
  item: ProjectMedia
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div 
          role="button"
          aria-label={`Play ${item.alt ?? "video clip"}`}
          className="relative w-full aspect-video cursor-pointer overflow-hidden rounded-xl bg-surface-container-low border border-surface-variant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {/* We use a static cover for the trigger to prevent autoplay issues inside the small view, or just let it play in the small view. 
              The user requested "Do the same wrapper logic for the video placeholder (ensure it doesn't trigger the modal if you click 'Play', or just let the modal handle the full video player)." 
              Let's let the modal handle the full video player to keep it simple and clean. */}
          <div className="w-full h-full relative group">
            <video
              src={item.url}
              className="w-full h-full object-cover"
              controls={false}
              muted
              playsInline
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center">
                <Play className="w-7 h-7 text-emerald-400 fill-emerald-400 ml-0.5" />
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-full p-1 border-none bg-transparent shadow-none" aria-describedby={undefined}>
        <div className="relative w-full h-[80vh] flex items-center justify-center bg-black/95 rounded-2xl overflow-hidden">
          <video
            src={item.url}
            controls
            autoPlay
            className="w-full h-full object-contain"
            playsInline
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function MediaCarousel({ media }: MediaCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [activeIndex, setActiveIndex] = React.useState(0)
  
  const plugin = React.useMemo(
    () => Autoplay({ delay: 5000, stopOnInteraction: true }),
    []
  )

  const totalSlides = media.length

  React.useEffect(() => {
    if (!api) return

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveIndex(api.selectedScrollSnap())

    api.on("select", () => {
      setActiveIndex(api.selectedScrollSnap())
    })
  }, [api])

  if (totalSlides === 0) return null

  const activeItem = media[activeIndex]

  return (
    <div className="w-full max-w-5xl mx-auto px-16 mb-24" aria-label="Project media gallery">
      <Carousel
        setApi={setApi}
        plugins={[plugin]}
        className="relative w-full"
        onMouseEnter={() => plugin.stop()}
        onMouseLeave={() => plugin.play()}
      >
        <div className="relative rounded-xl overflow-hidden aspect-video border border-surface-variant bg-surface-container-low">
          <CarouselContent>
            {media.map((item) => (
              <CarouselItem key={item.id}>
                {item.type === "video" ? (
                  <CarouselVideo item={item} />
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div 
                        role="button"
                        aria-label={`View ${item.alt ?? "image"}`}
                        className="relative w-full aspect-video cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Image
                          src={item.url}
                          alt={item.alt ?? "Media"}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 1024px"
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-7xl w-full p-1 border-none bg-transparent shadow-none" aria-describedby={undefined}>
                      <div className="relative w-full h-[80vh] bg-black/95 rounded-2xl overflow-hidden flex items-center justify-center">
                        <Image
                          src={item.url}
                          alt={item.alt ?? "Media Expanded"}
                          fill
                          className="object-contain"
                          sizes="100vw"
                          priority
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
          
        {totalSlides > 1 && (
          <>
            <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 bg-black/50 backdrop-blur-sm border-0 text-white/80 hover:bg-black/70 hover:text-white" />
            <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 bg-black/50 backdrop-blur-sm border-0 text-white/80 hover:bg-black/70 hover:text-white" />
          </>
        )}

        {/* DOTS & CAPTION - Absolutely positioned at the bottom so they don't push the arrows down */}
        {totalSlides > 1 && (
          <div className="absolute -bottom-16 left-0 right-0 flex flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-1.5" role="tablist" aria-label="Slide indicators">
                {media.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={index === activeIndex}
                    aria-label={`Go to slide ${index + 1}`}
                    onClick={() => api?.scrollTo(index)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      index === activeIndex
                        ? "w-6 bg-foreground"
                        : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    )}
                  />
                ))}
              </div>
              <span className="font-jetbrains text-xs text-muted-foreground ml-2">
                {activeIndex + 1}/{totalSlides}
              </span>
            </div>
            {/* Caption */}
            {activeItem?.alt && (
              <span className="text-sm text-muted-foreground text-center font-jetbrains">
                {activeItem.alt}
              </span>
            )}
          </div>
        )}
      </Carousel>
    </div>
  )
}
