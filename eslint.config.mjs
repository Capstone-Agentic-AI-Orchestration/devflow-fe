import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default [
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
  {
    rules: {
      // Codebase intentionally uses @ts-nocheck throughout pre-typed view files
      "@typescript-eslint/ban-ts-comment": "off",
      // setState-in-effect pattern is used for default-selection initialisation; downgrade to warn
      "react-hooks/set-state-in-effect": "warn",
      // Empty interface used as a named placeholder type
      "@typescript-eslint/no-empty-object-type": "warn",
    },
  },
];
