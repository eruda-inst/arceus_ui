#!/bin/sh
set -e

replace_placeholder() {
    placeholder="$1"
    value="$2"
    [ -z "$value" ] && return 0   # skip if empty

    # Escape characters that are special in sed's replacement part when using '#' as delimiter:
    #   #, &, \ (and also newline, but URLs don't contain them)
    escaped_value=$(printf '%s' "$value" | sed -e 's/[#&\]/\\&/g')

    echo "Replacing $placeholder with runtime value..."

    # Find all .js, .html, .css files, and run sed only on those containing the placeholder.
    # Using xargs with -0 ensures spaces in filenames are handled.
    find .next -type f \( -name "*.js" -o -name "*.html" -o -name "*.css" \) -print0 |
    while IFS= read -r -d '' file; do
        if grep -q "$placeholder" "$file"; then
            echo "  -> $file"
            sed -i "s#$placeholder#$escaped_value#g" "$file"
        fi
    done
}

# Replace HTTP API placeholder
replace_placeholder "__NEXT_PUBLIC_BASE_API_URL_PLACEHOLDER__" "$NEXT_PUBLIC_BASE_API_URL"

# Replace WebSocket API placeholder
replace_placeholder "__NEXT_PUBLIC_BASE_WS_API_URL_PLACEHOLDER__" "$NEXT_PUBLIC_BASE_WS_API_URL"

echo "Replacement complete."
echo "Starting Next.js..."
exec "$@"
