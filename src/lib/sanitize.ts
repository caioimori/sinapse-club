import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize HTML content to prevent XSS attacks.
 * Allows safe formatting tags but strips scripts and event handlers.
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li",
      "code", "pre", "blockquote", "h1", "h2", "h3", "h4", "h5", "h6",
      "span", "div", "img", "hr",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "class"],
    ALLOW_DATA_ATTR: false,
  });
}
