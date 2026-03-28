import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Bed, Bath, Square, Calendar, Car, Phone, Mail, ArrowLeft, Share2, Heart, Check } from 'lucide-react';
import { getPropertyBySlug, properties } from '@/data/properties';
import { formatPrice } from '@/lib/utils';
import { PropertyCard } from '@/components/properties/PropertyCard';

interface PropertyDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const similarProperties = properties
    .filter((p) => p.id !== property.id && (p.type === property.type || p.city === property.city))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-amber-500 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Properties
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
                <Image
                  src={property.images[0]}
                  alt={property.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {property.images.slice(1, 3).map((image, i) => (
                  <div key={i} className="relative h-36 md:h-[152px] rounded-2xl overflow-hidden">
                    <Image
                      src={image}
                      alt={`${property.title} ${i + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
                <div className="relative h-36 md:h-[152px] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <span className="text-neutral-400">+{property.images.length - 3} more</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-2 text-neutral-500">
                    <MapPin className="w-4 h-4" />
                    <span>{property.address}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-500 hover:text-white transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-3 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-500 hover:text-white transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 py-4 border-y border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-amber-500" />
                  <span className="font-medium">{property.beds} Bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-amber-500" />
                  <span className="font-medium">{property.baths} Bathrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="w-5 h-5 text-amber-500" />
                  <span className="font-medium">{property.sqft.toLocaleString()} sqft</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-500" />
                  <span className="font-medium">Built {property.yearBuilt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-amber-500" />
                  <span className="font-medium">{property.parking} Parking</span>
                </div>
              </div>

              <div className="py-6">
                <h2 className="text-xl font-semibold mb-4">About This Property</h2>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {property.description}
                </p>
              </div>

              <div className="py-6 border-t border-neutral-100 dark:border-neutral-800">
                <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-neutral-600 dark:text-neutral-400">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="py-6 border-t border-neutral-100 dark:border-neutral-800">
                <h2 className="text-xl font-semibold mb-4">Location</h2>
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl h-64 flex items-center justify-center">
                  <p className="text-neutral-500">Map integration coming soon</p>
                </div>
              </div>
            </div>

            {similarProperties.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Similar Properties</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {similarProperties.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-6 mb-6">
                <p className="text-3xl font-bold text-amber-500 mb-1">
                  {formatPrice(property.price)}
                </p>
                <p className="text-neutral-500">{property.status === 'for-sale' ? 'For Sale' : 'For Rent'}</p>

                <div className="mt-6 space-y-3">
                  <button className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors">
                    Schedule Viewing
                  </button>
                  <button className="w-full py-4 bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-semibold rounded-xl transition-colors">
                    Ask AI About This Property
                  </button>
                  <button className="w-full py-4 border border-neutral-300 dark:border-neutral-700 hover:border-amber-500 text-neutral-900 dark:text-white font-medium rounded-xl transition-colors">
                    Call Agent Now
                  </button>
                  <button className="w-full py-4 border border-neutral-300 dark:border-neutral-700 hover:border-amber-500 text-neutral-900 dark:text-white font-medium rounded-xl transition-colors">
                    Email Us Directly
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold mb-4">Listed By</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={property.agent.photo}
                      alt={property.agent.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{property.agent.name}</p>
                    <p className="text-sm text-neutral-500">Property Agent</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <a
                    href={`tel:${property.agent.phone}`}
                    className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-amber-500" />
                    <span>{property.agent.phone}</span>
                  </a>
                  <a
                    href={`mailto:${property.agent.email}`}
                    className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-amber-500" />
                    <span>{property.agent.email}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return properties.map((property) => ({
    slug: property.slug,
  }));
}
