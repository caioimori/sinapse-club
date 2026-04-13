import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Tooling scripts outside the app — not application code.
    ".claude/**",
    ".sinapse-ai/**",
    "supabase/functions/**",
    "scripts/**",
  ]),
  // Pre-existing tech debt — keep as warnings so new code still gets nudged
  // but CI doesn't block on ~200 historical occurrences. Targeted cleanup
  // should happen in a dedicated debt-paydown PR, not all at once.
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@next/next/no-img-element": "warn",
      // React 19 compiler rules — aggressive on our current patterns.
      // Keep as warnings until the whole codebase migrates to
      // useCallback / declare-before-use. Offenders are targeted in
      // dedicated cleanup PRs, not all at once.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/invariant": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/no-deriving-state-in-effects": "warn",
      "react/no-unescaped-entities": "warn",
    },
  },
]);

export default eslintConfig;
