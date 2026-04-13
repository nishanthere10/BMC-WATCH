/**
 * Calculate the Haversine distance between two lat/lng coordinates.
 * @returns Distance in kilometres.
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Filter an array of objects that have latitude/longitude by distance
 * from a reference point.
 */
export function filterByRadius<
  T extends { latitude?: number | null; longitude?: number | null }
>(items: T[], userLat: number, userLon: number, radiusKm: number): T[] {
  return items.filter((item) => {
    if (item.latitude == null || item.longitude == null) return false;
    return haversineDistance(userLat, userLon, item.latitude, item.longitude) <= radiusKm;
  });
}
