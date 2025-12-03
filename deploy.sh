#!/bin/bash

# Deploy Script untuk RSQUARE ke Netlify
# Script ini melakukan commit, push, dan memberikan instruksi untuk deploy

set -e

echo "=========================================="
echo "🚀 RSQUARE DEPLOYMENT SCRIPT"
echo "=========================================="
echo ""

# 1. Check git status
echo "📋 Checking git status..."
echo ""
git status
echo ""

# 2. Add changes
echo "📝 Adding changes to staging..."
git add style.css app.js
echo "✅ Added: style.css, app.js"
echo ""

# 3. Commit
echo "💾 Committing changes..."
git commit -m "fix: improve mobile menu UX and logo sizing

- Increase logo header size from 40px to 56px for better visibility
- Increase logo footer size from 48px to 72px for better visibility
- Implement max-height 300px limit on mobile menu to prevent content overlap
- Add smooth animation to mobile menu toggle with proper easing
- Fix CSS mobile menu styling with transition and overflow hidden"
echo "✅ Committed successfully"
echo ""

# 4. Push to main
echo "🔄 Pushing to main branch..."
git push origin main
echo "✅ Pushed to repository"
echo ""

# 5. Show recent commits
echo "📊 Recent commits:"
git log --oneline -5
echo ""

echo "=========================================="
echo "✅ DEPLOYMENT STEPS COMPLETED!"
echo "=========================================="
echo ""
echo "🎯 NEXT STEPS:"
echo "1. Netlify akan otomatis detect perubahan & trigger build"
echo "2. Build akan selesai dalam 2-3 menit"
echo "3. Setelah build selesai, clear cache di:"
echo "   https://app.netlify.com → Site Settings → Clear cache"
echo ""
echo "📌 DEPLOYMENT LINK:"
echo "   https://app.netlify.com/sites/rsquareidea/deploys"
echo ""
echo "🌐 LIVE SITE:"
echo "   https://rsquareidea.my.id/"
echo ""
echo "⏱️  Estimated total time: ~10 minutes"
echo ""
