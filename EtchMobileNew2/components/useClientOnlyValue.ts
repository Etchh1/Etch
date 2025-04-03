// This function is web-only as native doesn't currently support server (or build-time) rendering.
export function useClientOnlyValue<S, C>(server: S, client: C): S | C {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    return client;
  }
  return server;
}
