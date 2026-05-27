/**
 * Worker de redirection www.sapiro.app -> sapiro.app (301).
 * Attache via la route www.sapiro.app/* dans wrangler.toml.
 */
export default {
  fetch(request) {
    const url = new URL(request.url);
    url.hostname = 'sapiro.app';
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 301);
  },
};
