//ABOUTME: Utility functions for fetching URL metadata from external websites
//ABOUTME: Provides clean interface for bookmark form to get title, description, and keywords

import { validateUrl } from "./url-validation";

export interface UrlMetadata {
  title: string;
  description: string;
  keywords: string[];
  url: string;
}

export class MetadataFetchError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly isNetworkError: boolean = false,
  ) {
    super(message);
    this.name = "MetadataFetchError";
  }
}

export class NetworkUnavailableError extends MetadataFetchError {
  constructor() {
    super("No internet connection available", undefined, true);
    this.name = "NetworkUnavailableError";
  }
}

export async function fetchUrlMetadata(
  id: string,
  url: string,
): Promise<UrlMetadata> {
  // Check if we're offline first
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    throw new NetworkUnavailableError();
  }

  // Use shared validation logic
  try {
    validateUrl(url);
  } catch (error) {
    if (error instanceof Error) {
      throw new MetadataFetchError(error.message);
    }
    throw new MetadataFetchError("Invalid URL");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const response = await fetch(`/api/fetch-metadata`, {
      method: "POST",
      body: JSON.stringify({ id, url }),
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    if (response.ok) return response.json();

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      throw new MetadataFetchError(
        `Failed to fetch metadata: ${errorText}`,
        response.status,
      );
    }
  } catch (error) {
    if (error instanceof MetadataFetchError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new MetadataFetchError(
          "Request timeout - URL took too long to respond",
          undefined,
          true,
        );
      }
      // More specific network error detection
      if (error.name === "TypeError" && error.message === "Failed to fetch") {
        throw new NetworkUnavailableError();
      }
      if (
        error.message.includes("NetworkError") ||
        error.message.includes("ERR_NETWORK") ||
        error.message.includes("ERR_INTERNET_DISCONNECTED")
      ) {
        throw new NetworkUnavailableError();
      }
      throw new MetadataFetchError(
        `Network error: ${error.message}`,
        undefined,
        true,
      );
    }

    throw new MetadataFetchError(
      "Unknown error occurred while fetching metadata",
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
