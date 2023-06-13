import { addEffect } from "@react-three/fiber"
import { useRef, useEffect } from "react"

export default function useFPS() {

  const ref = useRef(0)
  useEffect(() => {
    const decimalPlacesRatio = Math.pow(10, 0)
    let timeMeasurements: number[] = []
    let msPassed = 0
    const effect = addEffect(() => {
      timeMeasurements.push(performance.now())
      msPassed = timeMeasurements[timeMeasurements.length - 1] - timeMeasurements[0]
      if (msPassed >= 0.25 * 1000) {
        ref.current = Math.round((timeMeasurements.length / msPassed) * 1000 * decimalPlacesRatio) / decimalPlacesRatio
        timeMeasurements = []
      }
    })
    return () => effect()
  }, [])
  return ref
}
