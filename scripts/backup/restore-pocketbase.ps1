[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$ArchivePath,
    [string]$ProjectRoot = "",
    [string]$BackupRoot = $(if ($env:BACKUP_DIR) { $env:BACKUP_DIR } else { "backups" }),
    [string]$PocketBaseService = $(if ($env:POCKETBASE_SERVICE) { $env:POCKETBASE_SERVICE } else { "pocketbase" }),
    [switch]$ForceRestore,
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
        throw "$Description must stay inside expected directory: $resolvedChild"
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

if (-not $ForceRestore) {
    throw "Restore overwrites current PocketBase data. Re-run with -ForceRestore after checking the archive path."
}

if ([string]::IsNullOrWhiteSpace($ProjectRoot)) {
    $ProjectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..\..")).Path
}

$projectRootPath = [System.IO.Path]::GetFullPath((Resolve-Path -LiteralPath $ProjectRoot).Path)
$backupRootPath = Resolve-PathFromProject -Root $projectRootPath -Path $BackupRoot
$resolvedArchivePath = Resolve-PathFromProject -Root $projectRootPath -Path $ArchivePath
$pbRootPath = Join-Path $projectRootPath "pocketbase"
$pbDataPath = Join-Path $pbRootPath "pb_data"
$pbMigrationsPath = Join-Path $pbRootPath "pb_migrations"

Assert-PathInside -ChildPath $pbDataPath -ParentPath $projectRootPath -Description "PocketBase data directory"
Assert-PathInside -ChildPath $pbMigrationsPath -ParentPath $projectRootPath -Description "PocketBase migrations directory"
Assert-PathInside -ChildPath $backupRootPath -ParentPath $projectRootPath -Description "Backup directory"

if (-not (Test-Path -LiteralPath $resolvedArchivePath -PathType Leaf)) {
    throw "Backup archive was not found: $resolvedArchivePath"
}

New-Item -ItemType Directory -Path $backupRootPath -Force | Out-Null

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$restoreStagingPath = Join-Path $backupRootPath "restore-staging-$timestamp"
$preRestorePath = Join-Path $backupRootPath "pre-restore-$timestamp"

Assert-PathInside -ChildPath $restoreStagingPath -ParentPath $backupRootPath -Description "Restore staging directory"
Assert-PathInside -ChildPath $preRestorePath -ParentPath $backupRootPath -Description "Pre-restore safety copy directory"

$wasRunning = $false

try {
    New-Item -ItemType Directory -Path $restoreStagingPath -Force | Out-Null
    Expand-Archive -LiteralPath $resolvedArchivePath -DestinationPath $restoreStagingPath -Force

    $restoredDataPath = Join-Path $restoreStagingPath "pb_data"
    $restoredMigrationsPath = Join-Path $restoreStagingPath "pb_migrations"

    if (-not (Test-Path -LiteralPath $restoredDataPath -PathType Container)) {
        throw "Backup archive does not contain pb_data."
    }

    if (-not (Test-Path -LiteralPath $restoredMigrationsPath -PathType Container)) {
        throw "Backup archive does not contain pb_migrations."
    }

    if (-not $SkipDockerStop) {
        $wasRunning = Test-DockerServiceRunning -ServiceName $PocketBaseService

        if ($wasRunning) {
            Write-Host "Stopping Docker service '$PocketBaseService' before restore..."
            & docker compose stop $PocketBaseService | Out-Host
        }
    }

    New-Item -ItemType Directory -Path $preRestorePath -Force | Out-Null

    if (Test-Path -LiteralPath $pbDataPath) {
        Copy-Item -LiteralPath $pbDataPath -Destination (Join-Path $preRestorePath "pb_data") -Recurse -Force
        Remove-Item -LiteralPath $pbDataPath -Recurse -Force
    }

    if (Test-Path -LiteralPath $pbMigrationsPath) {
        Copy-Item -LiteralPath $pbMigrationsPath -Destination (Join-Path $preRestorePath "pb_migrations") -Recurse -Force
        Remove-Item -LiteralPath $pbMigrationsPath -Recurse -Force
    }

    Copy-Item -LiteralPath $restoredDataPath -Destination $pbDataPath -Recurse -Force
    Copy-Item -LiteralPath $restoredMigrationsPath -Destination $pbMigrationsPath -Recurse -Force

    Write-Host "PocketBase data restored from: $resolvedArchivePath"
    Write-Host "Previous data safety copy: $preRestorePath"
}
finally {
    if (Test-Path -LiteralPath $restoreStagingPath) {
        Remove-Item -LiteralPath $restoreStagingPath -Recurse -Force
    }

    if ($wasRunning -and -not $SkipDockerStop) {
        Write-Host "Starting Docker service '$PocketBaseService'..."
        & docker compose up -d $PocketBaseService | Out-Host
    }
}
