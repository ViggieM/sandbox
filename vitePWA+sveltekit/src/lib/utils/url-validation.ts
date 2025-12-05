//ABOUTME: URL validation utilities to prevent SSRF and ensure safe external requests
//ABOUTME: Blocks private IP ranges, localhost, and validates URL format for security

export class UrlValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UrlValidationError";
  }
}

const PRIVATE_IP_RANGES = [
  /^127\./, // 127.0.0.0/8 - Loopback
  /^10\./, // 10.0.0.0/8 - Private Class A
  /^172\.(1[6-9]|2\d|3[01])\./, // 172.16.0.0/12 - Private Class B
  /^192\.168\./, // 192.168.0.0/16 - Private Class C
  /^169\.254\./, // 169.254.0.0/16 - Link-local
  /^::1$/, // IPv6 loopback
  /^fe80:/, // IPv6 link-local
  /^fc00:/, // IPv6 unique local
  /^fd00:/, // IPv6 unique local
];

const BLOCKED_HOSTNAMES = ["localhost", "0.0.0.0", "[::]", "::1"];

export function validateUrl(urlString: string): URL {
  if (!urlString || typeof urlString !== "string") {
    throw new UrlValidationError("URL is required and must be a string");
  }

  // Basic URL parsing
  let url: URL;
  try {
    url = new URL(urlString);
  } catch {
    throw new UrlValidationError("Invalid URL format");
  }

  // Only allow HTTP/HTTPS
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new UrlValidationError("Only HTTP and HTTPS URLs are supported");
  }

  // Block well-known private hostnames
  const hostname = url.hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.includes(hostname)) {
    throw new UrlValidationError(
      "Access to localhost/private addresses is not allowed",
    );
  }

  // Block private IP ranges
  for (const pattern of PRIVATE_IP_RANGES) {
    if (pattern.test(hostname)) {
      throw new UrlValidationError(
        "Access to private IP addresses is not allowed",
      );
    }
  }

  // Only allow specific safe ports for HTTP/HTTPS
  if (url.port) {
    const portNum = parseInt(url.port, 10);
    const allowedPorts = [80, 443, 8080, 8443, 3000, 3001, 5000, 8000];

    if (!allowedPorts.includes(portNum)) {
      throw new UrlValidationError("Access to this port is not allowed");
    }
  }

  return url;
}

export function isValidHttpUrl(urlString: string): boolean {
  try {
    validateUrl(urlString);
    return true;
  } catch {
    return false;
  }
}
