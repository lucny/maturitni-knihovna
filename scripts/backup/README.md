# PocketBase backups

Backup scripts store PocketBase data in timestamped ZIP archives under `backups/`.
The `backups/` directory is intentionally ignored by Git.

## What is backed up

Each archive contains:

- `pb_data/` - PocketBase SQLite database and uploaded files managed by PocketBase
- `pb_migrations/` - PocketBase migration files
- `manifest.txt` - timestamp and source paths

In this project PocketBase uses bind mounts:

- `./pocketbase/pb_data:/pb/pb_data`
- `./pocketbase/pb_migrations:/pb/pb_migrations`

## Manual backup

Run from the project root:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\backup\backup-pocketbase.ps1
```

By default, the script stops the `pocketbase` Docker Compose service before copying
data and starts it again afterwards. This avoids copying a live SQLite database.

For development-only checks, when you accept that the database may be copied while
running, use:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\backup\backup-pocketbase.ps1 -SkipDockerStop
```

The resulting archive is named like:

```text
backups/pocketbase-backup-20260614-183000.zip
```

## Restore

Restore overwrites current PocketBase data in:

- `pocketbase/pb_data`
- `pocketbase/pb_migrations`

Before restoring, the script creates a safety copy of the current data in
`backups/pre-restore-<timestamp>/`.

Run from the project root:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\backup\restore-pocketbase.ps1 -ArchivePath .\backups\pocketbase-backup-YYYYMMDD-HHMMSS.zip -ForceRestore
```

The `-ForceRestore` flag is required so that overwriting existing data is explicit.
By default, the script stops the `pocketbase` Docker Compose service before restore
and starts it again afterwards.

## Configuration

Optional environment variables:

```env
BACKUP_DIR=backups
POCKETBASE_SERVICE=pocketbase
```

`BACKUP_DIR` must stay inside the project directory.

## Verification

List created backups:

```powershell
Get-ChildItem .\backups\pocketbase-backup-*.zip
```

Inspect archive contents:

```powershell
$archive = Get-ChildItem .\backups\pocketbase-backup-*.zip | Sort-Object LastWriteTime -Descending | Select-Object -First 1
$temp = New-Item -ItemType Directory -Path (Join-Path $env:TEMP "pb-backup-check")
Expand-Archive -LiteralPath $archive.FullName -DestinationPath $temp.FullName -Force
Get-ChildItem $temp.FullName
```
