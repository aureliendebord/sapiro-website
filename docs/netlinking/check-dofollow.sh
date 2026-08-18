#!/usr/bin/env bash
# Vérifie si les liens sortants d'une page sont dofollow ou nofollow.
# Usage :
#   ./check-dofollow.sh <url-de-la-page> [filtre]
# Exemples :
#   ./check-dofollow.sh "https://alternativeto.net/software/seterra/about/"
#   ./check-dofollow.sh "https://www.educaciontrespuntocero.com/recursos/apps-trivial-evaluar-conocimientos/" "play.google"
#
# Le [filtre] optionnel restreint aux liens contenant cette chaîne
# (ex. "play.google", "apps.apple", ou le domaine d'une app listée).
# Verdict : si les liens sortants vers les apps/sites listés n'ont PAS de
# rel="nofollow"/"sponsored"/"ugc", la page transmet du jus SEO (dofollow).

set -euo pipefail
url="${1:?Usage: $0 <url> [filtre]}"
filtre="${2:-}"

html="$(curl -sL --max-time 30 -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" "$url")"

echo "== Liens sortants de $url =="
echo "$html" \
  | grep -oiE '<a[^>]+href="https?://[^"]+"[^>]*>' \
  | grep -viE 'href="https?://[^"]*('"$(echo "$url" | sed -E 's#https?://([^/]+).*#\1#' | sed 's/\./\\./g')"')' \
  | { [ -n "$filtre" ] && grep -i "$filtre" || cat; } \
  | while IFS= read -r a; do
      href=$(echo "$a" | grep -oE 'href="[^"]+"' | head -1)
      rel=$(echo "$a" | grep -oiE 'rel="[^"]*"' | head -1)
      if echo "$rel" | grep -qiE 'nofollow|sponsored|ugc'; then
        echo "NOFOLLOW  $href  ($rel)"
      else
        echo "dofollow  $href  ${rel:-"(pas d'attribut rel)"}"
      fi
    done | sort | uniq -c | sort -rn

echo
echo "Rappel : certains sites rendent les liens en JavaScript ; si la liste est"
echo "vide, vérifier dans le navigateur (inspecteur, chercher rel= sur le lien)."
