#!/bin/bash
# ============================================================
# Deploy Script — Skripsi Wiki (Quartz)
#
# Cara pakai:
#   1. Edit notes di Obsidian
#   2. Buka git-bash di folder D:\Skripsi_Wiki\quartz\
#   3. Jalankan: ./deploy.sh
# ============================================================

set -e

echo "🔄 Building Skripsi Wiki..."
npx quartz build

echo ""
echo "📤 Deploying to GitHub Pages..."
echo ""

# Save current branch
CURRENT_BRANCH=$(git branch --show-current)

# Build to gh-pages branch
git checkout gh-pages
rm -rf concepts/ models/ outlines/ preparation/ research_notes/ todo/
rm -f 404.html index.html index.css index.xml log.html sitemap.xml
rm -f favicon.ico postscript.js prescript.js .nojekyll
cp -r public/* .
cp public/.* . 2>/dev/null || true
touch .nojekyll
rm -rf public/

git add -A
git commit --allow-empty -m "Deploy: $(date +'%Y-%m-%d %H:%M')"
git push origin gh-pages

# Back to main
git checkout "$CURRENT_BRANCH"

echo ""
echo "✅ Selesai! Website diupdate:"
echo "   https://asdikaputra.github.io/skripsi-wiki/"
echo ""
echo "⏳ Tunggu 1-2 menit sampai perubahan live."
