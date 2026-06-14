# Maturitní knihovna

Ukázkový školní headless CMS projekt.

Technologie:
- SvelteKit
- Tailwind CSS
- PocketBase
- Docker
- Microsoft Entra ID

Veškeré specifikace jsou ve složce docs/.

Implementace musí postupovat podle ROADMAP.md.

## Docker reverse proxy

### Lokalni vyvoj

Lokalni rezim pouziva HTTP bez verejne domeny:

```bash
docker compose up -d
```

Dostupne URL:

- frontend: `http://localhost`
- PocketBase: `http://pb.localhost`

PocketBase port `8090` zustava vystaveny pouze na `127.0.0.1` pro lokalni vyvoj.

### Produkcni HTTPS

Produkcni HTTPS rezim pouziva Caddy automaticke TLS. Certifikaty a privatni klice
se ukladaji pouze do Docker volume `caddy_data`, nikdy do repozitare.

Pred spustenim musi DNS zaznamy verejnych domen smerovat na server a porty `80`
a `443` musi byt dostupne z internetu.

Nastavte v produkcnim `.env`:

```env
REVERSE_PROXY_HOST=0.0.0.0
PUBLIC_APP_DOMAIN=library.example.com
PUBLIC_POCKETBASE_DOMAIN=pb.library.example.com
TLS_CONTACT_EMAIL=admin@example.com
REVERSE_PROXY_HTTPS_HOST=0.0.0.0
REVERSE_PROXY_HTTPS_PORT=443
```

Spusteni:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

Produkcni URL:

- frontend: `https://library.example.com`
- PocketBase API a Admin UI: `https://pb.library.example.com`

Caddy automaticky obsluhuje HTTP na portu `80` a pro verejne domeny presmeruje
pozadavky na HTTPS.

Overeni:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml config
curl -I https://library.example.com
curl https://pb.library.example.com/api/health
docker compose logs reverse-proxy
```

## PocketBase zalohy

Zalohy PocketBase se ukladaji do lokalni slozky `backups/`, ktera je ignorovana
Gitem. Archiv obsahuje `pocketbase/pb_data`, `pocketbase/pb_migrations` a
manifest.

Rucni zaloha:

```bash
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\backup\backup-pocketbase.ps1
```

Obnova prepisuje aktualni PocketBase data. Skript pred prepisem vytvori
bezpecnostni kopii aktualniho stavu do `backups/pre-restore-<timestamp>/`.

```bash
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\backup\restore-pocketbase.ps1 -ArchivePath .\backups\pocketbase-backup-YYYYMMDD-HHMMSS.zip -ForceRestore
```

Podrobny postup je v `scripts/backup/README.md`.
