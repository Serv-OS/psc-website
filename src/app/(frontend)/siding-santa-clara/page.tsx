import type { Metadata } from 'next'
import { CityRoute, cityMetadata } from '@/components/city/CityRoute'

export const revalidate = 300
export const generateMetadata = (): Promise<Metadata> => cityMetadata('santa-clara')

export default function Page() {
  return <CityRoute slug="santa-clara" />
}
