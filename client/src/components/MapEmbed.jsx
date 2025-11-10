import React from "react"

export default function MapEmbed({ location }) {
  const lat = location?.lat || 0
  const lng = location?.lng || 0
  const address = encodeURIComponent(location?.address || "")
  const src = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`

  return (
    <div className="w-full h-48 bg-muted rounded-lg overflow-hidden border border-border">
      <iframe title="map" src={src} className="w-full h-full" />
    </div>
  )
}
