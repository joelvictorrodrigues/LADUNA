# LADUNA links

Route: /links/ on the existing domain https://ladunastudio.com.br.
The static index directory supports direct navigation and refresh without a new app or routing dependency.

Edit data.js to change banner titles, URLs, imagery, ordering and layout variants.
The ten destinations were extracted from the official Linktree on 2026-11-17.
The old Linktree site link still points at ladunastudio.com; this page deliberately points to the current official .com.br domain.

Identity: Montserrat and Quicksand. All named color values are copied from assets/site.css.
The executive app has additional historical purple values; these are not introduced here.
The official horizontal logo is used as an image, not recreated in text.

Version 3 uses oversized standalone foreground objects, alternating left and right, outside each banner's surface. Social marks come from Simple Icons (https://simpleicons.org, CC0 icon collection; third-party trademarks remain with their owners). The chess piece, email symbol and seal are newly generated transparent renders. Only the official LADUNA emblem and wordmark are inherited from the main site. No homepage photograph is reused.

All banners now display their plum, lilac and ivory colors permanently. Grayscale and scroll-selected color were removed at the user's request. Hover and pressing provide subtle movement and depth. Reduced motion removes animation and transitions.

Cormorant Garamond is used only for editorial banner headings to implement the user's explicit classic/old-school direction. Montserrat and Quicksand remain in supporting copy. The typographic LADUNA logo is never recreated with this typeface.

No analytics or tracking requests are sent. A laduna:link-click CustomEvent exposes only the channel ID for a future consent-aware integration.

Checks: node --test tests/links-page.test.mjs from the repository root.
This folder does not modify the homepage, portal, functions, DNS or hosting configuration.
