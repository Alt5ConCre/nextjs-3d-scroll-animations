#!/usr/bin/env bash
set -euo pipefail

SOURCE="public/house/media/luxury-house-master-4k.mp4"
WEB_FRAMES="public/house/frames"
MOBILE_DIR="public/house/mobile"
STILLS_DIR="public/house/stills"
MASTER_DIR="public/house/generated-4k"

if [[ ! -f "$SOURCE" ]]; then
  echo "Missing source video: $SOURCE" >&2
  exit 1
fi

DURATION="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SOURCE")"
DURATION="$(printf "%.6f" "$DURATION")"
FPS="$(awk -v d="$DURATION" 'BEGIN { printf "%.8f", 360/d }')"

rm -rf "$WEB_FRAMES" "$MOBILE_DIR" "$STILLS_DIR" "$MASTER_DIR"
mkdir -p "$WEB_FRAMES" "$MOBILE_DIR" "$STILLS_DIR" "$MASTER_DIR"

echo "Source duration: ${DURATION}s"
echo "Sampling 360 desktop frames at ${FPS} fps"

# Desktop: web-optimized 1920x1080 WebP sequence.
# The original 4K video remains the visual master; this derivative is intentionally
# smaller so the scroll experience does not require hundreds of 4K bitmaps.
ffmpeg -hide_banner -loglevel error -y \
  -i "$SOURCE" \
  -vf "fps=${FPS},scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black" \
  -frames:v 360 \
  -c:v libwebp -q:v 78 -compression_level 6 \
  "$WEB_FRAMES/frame_%04d.webp"

NAMES=(
  "01-arrival"
  "02-foyer"
  "03-living"
  "04-kitchen"
  "05-dining-patio"
  "06-primary-suite"
  "07-bath-terrace"
  "08-private-tour"
)

for i in "${!NAMES[@]}"; do
  START="$(awk -v d="$DURATION" -v i="$i" 'BEGIN { printf "%.6f", d*(i+0.5)/8 }')"

  ffmpeg -hide_banner -loglevel error -y \
    -ss "$START" -i "$SOURCE" -frames:v 1 \
    -vf "scale=3840:2160:force_original_aspect_ratio=decrease,pad=3840:2160:(ow-iw)/2:(oh-ih)/2:color=black" \
    -c:v libwebp -q:v 90 -compression_level 6 \
    "$MASTER_DIR/${NAMES[$i]}-4k.webp"

  ffmpeg -hide_banner -loglevel error -y \
    -ss "$START" -i "$SOURCE" -frames:v 1 \
    -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black" \
    -c:v libwebp -q:v 82 -compression_level 6 \
    "$STILLS_DIR/${NAMES[$i]}.webp"
done

for i in "${!NAMES[@]}"; do
  START="$(awk -v d="$DURATION" -v i="$i" 'BEGIN { printf "%.6f", d*i/8 }')"
  END="$(awk -v d="$DURATION" -v i="$i" 'BEGIN { printf "%.6f", d*(i+1)/8 }')"
  LENGTH="$(awk -v s="$START" -v e="$END" 'BEGIN { printf "%.6f", e-s }')"

  ffmpeg -hide_banner -loglevel error -y \
    -ss "$START" -i "$SOURCE" -t "$LENGTH" \
    -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" \
    -an \
    -c:v libx264 -preset medium -crf 24 -pix_fmt yuv420p \
    -movflags +faststart \
    "$MOBILE_DIR/${NAMES[$i]}.mp4"
done

cp "$STILLS_DIR/01-arrival.webp" public/house/poster.webp

echo "Rendered:"
find "$WEB_FRAMES" -type f | wc -l | xargs echo "desktop frames:"
find "$STILLS_DIR" -type f | wc -l | xargs echo "web stills:"
find "$MOBILE_DIR" -type f | wc -l | xargs echo "mobile clips:"
find "$MASTER_DIR" -type f | wc -l | xargs echo "4K still masters:"
