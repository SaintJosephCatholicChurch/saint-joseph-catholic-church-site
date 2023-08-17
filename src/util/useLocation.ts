export default function useLocation(): Partial<Location> {
  if (typeof window === 'undefined') {
    return {};
  }
  return window?.location;
}
