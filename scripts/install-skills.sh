#!/usr/bin/env bash
set -euo pipefail

# Install the four GitHub-hosted Claude Code SEO skills the agents lean on.
# Run from repo root: bash scripts/install-skills.sh

echo "Installing Huamei SEO agent skill dependencies..."

# Install via Claude Code plugin marketplace (preferred path)
# The site-engineer agent uses these heavily.
claude plugin marketplace add aaron-he-zhu/seo-geo-claude-skills 2>/dev/null || \
  echo "  ⚠ aaron-he-zhu/seo-geo-claude-skills — install manually via 'claude plugin marketplace add aaron-he-zhu/seo-geo-claude-skills' in an interactive session"

claude plugin install superseo-skills 2>/dev/null || \
  echo "  ⚠ superseo-skills — install manually via 'claude plugin install superseo-skills'"

claude plugin marketplace add ivankuznetsov/claude-seo 2>/dev/null || \
  echo "  ⚠ ivankuznetsov/claude-seo — install manually"

# AndreasH96/seo-geo-consultant — clone into local skills directory
if [ ! -d ".claude/skills/seo-geo-consultant" ]; then
  echo "Cloning AndreasH96/seo-geo-consultant..."
  mkdir -p .claude/skills
  git clone --depth 1 https://github.com/AndreasH96/seo-geo-consultant .claude/skills/seo-geo-consultant 2>/dev/null || \
    echo "  ⚠ Could not clone seo-geo-consultant — install manually"
fi

# zubair-trabzada/geo-seo-claude — clone for Analyst's GEO scoring runs
if [ ! -d ".claude/skills/geo-seo-claude" ]; then
  echo "Cloning zubair-trabzada/geo-seo-claude..."
  git clone --depth 1 https://github.com/zubair-trabzada/geo-seo-claude .claude/skills/geo-seo-claude 2>/dev/null || \
    echo "  ⚠ Could not clone geo-seo-claude — install manually"
fi

echo ""
echo "Done. Verify with:"
echo "  claude plugin list"
echo "  ls .claude/skills/"
