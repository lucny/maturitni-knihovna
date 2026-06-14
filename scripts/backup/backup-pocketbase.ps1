[CmdletBinding()]
param(
    [string]$ProjectRoot = "",
    [string]$BackupRoot = $(if ($env:BACKUP_DIR) { $env:BACKUP_DIR } else { "backups" }),
    [string]$PocketBaseService = $(if ($env:POCKETBASE_SERVICE) { $env:POCKETBASE_SERVICE } else { "pocketbase" }),
    [switch]$SkipDockerStop
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Resolve-PathFromProject {
    param(
        [string]$Root,
        [string]$Path
    )

    if ([System.IO.Path]::IsPathRooted($Path)) {
        return [System.IO.Path]::GetFullPath($Path)
    }

    return [System.IO.Path]::GetFullPath((Join-Path $Root $Path))
}

function Assert-PathInside {
    param(
        [string]$ChildPath,
        [string]$ParentPath,
        [string]$Description
    )

    $resolvedChild = [System.IO.Path]::GetFullPath($ChildPath).TrimEnd([System.IO.Path]::DirectorySeparatorChar, [System.IO.Path]::AltDirectorySeparatorChar)
    $resolvedParent = [System.IO.Path]::GetFullPath($ParentPath).TrimEnd([System.IO.Path]::DirectorySeparatorChar, [System.IO.Path]::AltDirectorySeparatorChar)

    if (-not ($resolvedChild.Equals($resolvedParent, [System.StringComparison]::OrdinalIgnoreCase) -or $resolvedChild.StartsWith("$resolvedParent$([System.IO.Path]::DirectorySeparatorChar)", [System.StringComparison]::OrdinalIgnoreCase))) {
        throw "$Description must stay inside project root: $resolvedChild"
    }
}

function Test-DockerServiceRunning {
    param([string]$ServiceName)

    try {
        $runningServices = & docker compose ps --status running --services 2>$null
    }
    catch {
        return $false
    }

    return $runningServices -contains $ServiceName
}

if ([string]::IsNullOrWhiteSpace($ProjectRoot)) {
    $ProjectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..\..")).Path
}

$projectRootPath = [System.IO.Path]::GetFullPath((Resolve-Path -LiteralPath $ProjectRoot).Path)
$backupRootPath = Resolve-PathFromProject -Root $projectRootPath -Path $BackupRoot
$pbDataPath = Join-Path $projectRootPath "pocketbase\pb_data"
$pbMigrationsPath = Join-Path $projectRootPath "pocketbase\pb_migrations"

Assert-PathInside -ChildPath $backupRootPath -ParentPath $projectRootPath -Description "Backup directory"

if (-not (Test-Path -LiteralPath $pbDataPath -PathType Container)) {
    throw "PocketBase data directory was not found: $pbDataPath"
}

if (-not (Test-Path -LiteralPath $pbMigrationsPath -PathType Container)) {
    throw "PocketBase migrations directory was not found: $pbMigrationsPath"
}

New-Item -ItemType Directory -Path $backupRootPath -Force | Out-Null

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$archivePath = Join-Path $backupRootPath "pocketbase-backup-$timestamp.zip"
$stagingPath = Join-Path $backupRootPath "staging-$timestamp"

Assert-PathInside -ChildPath $stagingPath -ParentPath $backupRootPath -Description "Backup staging directory"

if (Test-Path -LiteralPath $archivePath) {
    throw "Backup archive already exists and will not be overwritten: $archivePath"
}

$wasRunning = $false

try {
    if (-not $SkipDockerStop) {
        $wasRunning = Test-DockerServiceRunning -ServiceName $PocketBaseService

        if ($wasRunning) {
            Write-Host "Stopping Docker service '$PocketBaseService' for a consistent SQLite backup..."
            & docker compose stop $PocketBaseService | Out-Host
        }
    }

    New-Item -ItemType Directory -Path $stagingPath -Force | Out-Null
    Copy-Item -LiteralPath $pbDataPath -Destination (Join-Path $stagingPath "pb_data") -Recurse -Force
    Copy-Item -LiteralPath $pbMigrationsPath -Destination (Join-Path $stagingPath "pb_migrations") -Recurse -Force

    $manifestPath = Join-Path $stagingPath "manifest.txt"
    @(
        "created_at=$((Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ"))"
        "project_root=$projectRootPath"
        "pocketbase_data=pocketbase/pb_data"
        "pocketbase_migrations=pocketbase/pb_migrations"
    ) | Set-Content -LiteralPath $manifestPath -Encoding UTF8

    Compress-Archive -Path (Join-Path $stagingPath "*") -DestinationPath $archivePath -CompressionLevel Optimal

    $archive = Get-Item -LiteralPath $archivePath
    Write-Host "Backup created: $($archive.FullName)"
    Write-Host "Backup size: $($archive.Length) bytes"
}
finally {
    if (Test-Path -LiteralPath $stagingPath) {
        Remove-Item -LiteralPath $stagingPath -Recurse -Force
    }

    if ($wasRunning -and -not $SkipDockerStop) {
        Write-Host "Starting Docker service '$PocketBaseService'..."
        & docker compose up -d $PocketBaseService | Out-Host
    }
}
