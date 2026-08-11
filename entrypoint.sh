#!/bin/sh
set -e

echo "Starting runtime replacement for NEXT_PUBLIC_BASE_API_URL..."

API_PLACEHOLDER="__NEXT_PUBLIC_BASE_API_URL_PLACEHOLDER__"
API_VALUE="${NEXT_PUBLIC_BASE_API_URL}"

if [ -z "$API_VALUE" ]; then
    echo "Warning: NEXT_PUBLIC_BASE_API_URL is not set – skipping replacement."
else
    find .next -type f \( -name "*.js" -o -name "*.html" -o -name "*.css" \) \
        -exec grep -l "$API_PLACEHOLDER" {} \; | while IFS= read -r file; do
        echo "Replacing in $file"
        escaped_value=$(printf '%s' "$API_VALUE" | sed 's/|/\\|/g')
        sed -i "s|$API_PLACEHOLDER|$escaped_value|g" "$file"
    done
    echo "Replacement complete."
fi

echo "Starting Next.js..."
exec "$@"
