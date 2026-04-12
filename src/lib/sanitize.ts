import sanitize from "sanitize-html";

/**
 * Sanitize HTML content to prevent XSS attacks.
 *
 * Server-safe (pure JS, no jsdom): previously used `isomorphic-dompurify`
 * which pulls jsdom transitively and breaks Turbopack on Windows
 * (junction point failures). `sanitize-html` is ~90% smaller and safer
 * to import from server components.
 */
const ALLOWED_TAGS = [
  "b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li",
  "code", "pre", "blockquote", "h1", "h2", "h3", "h4", "h5", "h6",
  "span", "div", "img", "hr",
];

export function sanitizeHtml(dirty: string): string {
  return sanitize(dirty, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["http", "https", "data"] },
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          target: "_blank",
          rel: "nofollow noopener noreferrer",
        },
      }),
    },
    disallowedTagsMode: "discard",
  });
}
