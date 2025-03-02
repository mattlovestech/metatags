## SpecStory

## Next.js Image Configuration Error Fix (3/2/2025, 4:03:38 PM)

_**User**_

 ⨯ Error: Invalid src prop (https://metatags.io/images/meta-tags.png) on `next/image`, hostname "metatags.io" is not configured under images in your `next.config.js`
See more info: https://nextjs.org/docs/messages/next-image-unconfigured-host
    at Array.map (<anonymous>)
digest: "522674244"
 GET / 500 in 1634ms
 ✓ Compiled in 113ms (328 modules)

---

_**Assistant**_

To resolve the error regarding the invalid `src` prop for the `next/image` component, you need to configure the hostname "metatags.io" in your `next.config.js` file. Here’s how you can do that:

1. Open your `next.config.js` file.
2. Add the `images` configuration to include the hostname.

Here’s the code snippet to add:

```language:my-app/next.config.js
// ... existing code ...
module.exports = {
  images: {
    domains: ['metatags.io'], // Add this line
  },
}
// ... existing code ...
```

### Explanation of the Update:
- The `images` configuration allows you to specify which external domains are allowed to serve images. By adding `metatags.io` to the `domains` array, you will resolve the error related to the `next/image` component.

Make sure to restart your development server after making this change for it to take effect.

---



---

