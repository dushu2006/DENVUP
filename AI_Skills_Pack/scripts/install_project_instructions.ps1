$ErrorActionPreference = "Stop"
$packPath = Join-Path (Get-Location) "DENVUP_AI_SKILLS_PACK"
if (-not (Test-Path $packPath)) {
  throw "DENVUP_AI_SKILLS_PACK folder not found in the current project root."
}
$agentsPath = Join-Path (Get-Location) "AGENTS.md"
$begin = "<!-- BEGIN DENVUP AI SKILLS PACK INSTRUCTIONS -->"
$end = "<!-- END DENVUP AI SKILLS PACK INSTRUCTIONS -->"
$block = @"
$begin
Before making changes, read ``DENVUP_AI_SKILLS_PACK/AI_WORKFLOW.md`` and search ``DENVUP_AI_SKILLS_PACK/SKILL-INDEX.md`` for relevant skills. Read the actual ``SKILL.md`` files and any required references before implementation. Verify tool-specific requirements, and report skills consulted, checks performed, results, and limitations. If the pack is inaccessible, say so rather than claiming it was used.
$end
"@
if (Test-Path $agentsPath) {
  $content = Get-Content $agentsPath -Raw
  $pattern = [regex]::Escape($begin) + ".*?" + [regex]::Escape($end)
  if ($content -match $pattern) {
    $content = [regex]::Replace($content, $pattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $block }, [System.Text.RegularExpressions.RegexOptions]::Singleline)
  } else {
    $content = $content.TrimEnd() + "`r`n`r`n" + $block + "`r`n"
  }
} else {
  $content = "# AI Agent Instructions`r`n`r`n" + $block + "`r`n"
}
Set-Content -Path $agentsPath -Value $content -Encoding UTF8
Write-Host "DENVUP skill instructions installed/updated in AGENTS.md"
