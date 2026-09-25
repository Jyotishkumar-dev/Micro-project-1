/**
 * ESLint configuration.
 *
 * Kept as a JS file rather than JSON purely so the rationale for the two
 * disabled rules survives in the repo.
 */
module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    /**
     * The project image preview in the admin project form is a user-supplied
     * Storage path, so its src cannot be statically known. The rule's concern
     * (layout shift from a missing width/height) does not apply to a 20x20
     * thumbnail in a fixed-size container.
     */
    "@next/next/no-img-element": "off",

    /**
     * False positive for the App Router: this project loads Google Fonts with a
     * <link> in the root layout's <head>, which applies to every route. The
     * rule only knows about the Pages Router's `pages/_document.js`.
     */
    "@next/next/no-page-custom-font": "off",
  },
  ignorePatterns: [
    "node_modules/",
    ".next/",
    "out/",
    "build/",
    "next-env.d.ts",
    // Static artefacts of the pre-Next.js version of this project.
    "index.html",
    "particles.js",
    "style.css",
  ],
};
