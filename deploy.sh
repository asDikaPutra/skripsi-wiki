#!/bin/bash
# ============================================================
# Deploy Script — Skripsi Wiki (Quartz)
#
# Cara pakai:
#   1. Buka git-bash di folder D:\Skripsi_Wiki\quartz\
#   2. Jalankan: ./deploy.sh
#
# Yang dilakukan:
#   - Build static site dari wiki/ (via junction)
#   - Deploy ke GitHub Pages (atau hosting tujuan)
# ============================================================

set -e

echo "🔄 Building Skripsi Wiki..."
npx quartz build

echo ""
echo "✅ Build selesai! File siap deploy di: public/"
echo ""
echo "📤 Untuk deploy ke GitHub Pages:"
echo "   npx quartz sync"
echo ""
echo "📤 Atau upload folder public/ ke Netlify/Vercel manual"
echo ""
echo "📝 Local preview:"
echo "   npx quartz build --serve --port 8080"
