//ABOUTME: SvelteKit API route that provides CORS proxy for metadata extraction
//ABOUTME: Enables PWA to fetch content from external URLs without CORS restrictions

import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import type { UrlMetadata } from "$lib/utils/metadata";
import { isValidHttpUrl } from "$lib/utils/url-validation";

const MAX_RESPONSE_SIZE = 1024 * 1024; // 1MB limit

function extractMetadata(html: string, url: string): UrlMetadata {
  // Limit HTML size for regex processing to prevent ReDoS
  const maxHtmlSize = 50000; // 50KB should be enough for meta tags
  const processableHtml =
    html.length > maxHtmlSize ? html.substring(0, maxHtmlSize) : html;

  // More secure regex patterns with length limits
  const titleMatch = processableHtml.match(
    /<title[^>]{0,200}>([^<]{1,500})<\/title>/i,
  );
  const ogTitleMatch = processableHtml.match(
    /<meta[^>]{0,200}property=["']og:title["'][^>]{0,200}content=["']([^"']{1,500})["']/i,
  );
  const twitterTitleMatch = processableHtml.match(
    /<meta[^>]{0,200}name=["']twitter:title["'][^>]{0,200}content=["']([^"']{1,500})["']/i,
  );

  const descriptionMatch = processableHtml.match(
    /<meta[^>]{0,200}name=["']description["'][^>]{0,200}content=["']([^"']{1,1000})["']/i,
  );
  const ogDescriptionMatch = processableHtml.match(
    /<meta[^>]{0,200}property=["']og:description["'][^>]{0,200}content=["']([^"']{1,1000})["']/i,
  );
  const twitterDescriptionMatch = processableHtml.match(
    /<meta[^>]{0,200}name=["']twitter:description["'][^>]{0,200}content=["']([^"']{1,1000})["']/i,
  );

  const keywordsMatch = processableHtml.match(
    /<meta[^>]{0,200}name=["']keywords["'][^>]{0,200}content=["']([^"']{1,500})["']/i,
  );

  const title = (
    titleMatch?.[1] ||
    ogTitleMatch?.[1] ||
    twitterTitleMatch?.[1] ||
    ""
  ).trim();
  const description = (
    descriptionMatch?.[1] ||
    ogDescriptionMatch?.[1] ||
    twitterDescriptionMatch?.[1] ||
    ""
  ).trim();
  const keywordsString = keywordsMatch?.[1] || "";
  const keywords = keywordsString
    .split(",")
    .map((k) => k.trim())
    .filter((k) => k.length > 0 && k.length < 50); // Limit individual keyword length

  return {
    title: decodeHtmlEntities(title).substring(0, 500), // Limit title length
    description: decodeHtmlEntities(description).substring(0, 1000), // Limit description length
    keywords: keywords.slice(0, 20), // Limit number of keywords
    url,
  };
}

function decodeHtmlEntities(text: string): string {
  // Common named entities
  const namedEntities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
    "&nbsp;": " ",
    "&copy;": "©",
    "&reg;": "®",
    "&trade;": "™",
    "&hellip;": "…",
    "&ndash;": "–",
    "&mdash;": "—",
    "&lsquo;": "\u2018",
    "&rsquo;": "\u2019",
    "&ldquo;": "\u201C",
    "&rdquo;": "\u201D",
  };

  return (
    text
      // Replace named entities
      .replace(
        /&[a-zA-Z][a-zA-Z0-9]*;/g,
        (entity) => namedEntities[entity] || entity,
      )
      // Replace numeric entities (&#123;)
      .replace(/&#(\d+);/g, (match, num) => {
        const code = parseInt(num, 10);
        // Validate reasonable character codes to prevent issues
        if (code > 0 && code < 1114112) {
          return String.fromCharCode(code);
        }
        return match;
      })
      // Replace hex entities (&#xAB;)
      .replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => {
        const code = parseInt(hex, 16);
        // Validate reasonable character codes to prevent issues
        if (code > 0 && code < 1114112) {
          return String.fromCharCode(code);
        }
        return match;
      })
  );
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

export const OPTIONS: RequestHandler = async () => {
  return new Response(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
};

export const POST: RequestHandler = async ({ request }) => {
  const { id: bookmarkId, url: targetUrl } = await request.json();

  if (!targetUrl) {
    return error(400, "URL parameter is required");
  }

  // Validate URL and check for SSRF vulnerabilities
  if (!isValidHttpUrl(targetUrl)) {
    return error(400, "Invalid or unsafe URL");
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Breader/1.0 (Bookmark Reader)",
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      // Sanitize error messages to prevent information leakage
      if (response.status >= 400 && response.status < 500) {
        return error(400, "Unable to access the requested URL");
      } else {
        return error(500, "External server error occurred");
      }
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("text/html")) {
      return error(400, "URL must return HTML content");
    }

    // Check response size to prevent DoS
    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_RESPONSE_SIZE) {
      return error(400, "Response too large");
    }

    // Read response with size limit
    let html = "";
    const reader = response.body?.getReader();
    if (!reader) {
      return error(500, "Unable to read response");
    }

    let totalSize = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        totalSize += value.length;
        if (totalSize > MAX_RESPONSE_SIZE) {
          reader.releaseLock();
          return error(400, "Response too large");
        }

        html += new TextDecoder().decode(value);
      }
    } finally {
      reader.releaseLock();
    }

    const metadata = extractMetadata(html, targetUrl);
    metadata.bookmarkId = bookmarkId;

    return json(metadata, {
      headers: {
        ...CORS_HEADERS,
        "Content-Security-Policy": "default-src 'none'",
      },
    });
  } catch (err) {
    console.error("Fetch error:", err);
    // Don't expose internal error details
    return error(500, "Unable to fetch metadata");
  }
};
