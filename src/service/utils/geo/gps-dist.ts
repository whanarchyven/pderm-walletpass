export class GpsDist {
  static getDistanceMeters(latLonStrA: string, latLonStrB: string) {
    const [lat1, lon1] = this.latlonStrToTuple(latLonStrA);
    const [lat2, lon2] = this.latlonStrToTuple(latLonStrB);
    const earthRadiusKm = 6371;
    const latDelta = ((lat2 - lat1) * Math.PI) / 180;
    const lonDelta = ((lon2 - lon1) * Math.PI) / 180;
    const lat1Rad = (lat1 * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;
    const a =
      Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
      Math.sin(lonDelta / 2) *
        Math.sin(lonDelta / 2) *
        Math.cos(lat1Rad) *
        Math.cos(lat2Rad);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distanceM = earthRadiusKm * c * 1000;
    return distanceM;
  }
  static latlonStrToTuple(ll: string) {
    const [lat, lon] = ll.split(", ");
    return [parseFloat(lat), parseFloat(lon)];
  }

  static printDistanceFromMeters(meters: number) {
    if (meters < 100) return `${meters.toFixed(0)}m.`;
    if (meters < 3000) return `${(meters / 1000).toFixed(1)}km.`;
    return `${(meters / 1000).toFixed(0)}km.`;
  }
}
