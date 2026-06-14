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

## Zakladni monitoring

SvelteKit poskytuje health endpoint:

```bash
curl http://localhost/health
```

Odpoved obsahuje `status`, `timestamp`, `app`, `version` a stav dostupnosti
PocketBase. Pokud PocketBase neni dostupny, endpoint vrati stav `degraded`
a HTTP status `503`.

Docker Compose obsahuje healthchecky pro:

- `frontend` pres `http://127.0.0.1:5173/health`
- `pocketbase` pres `http://127.0.0.1:8090/api/health`
- `reverse-proxy` pres `http://localhost/health`

Overeni:

```bash
docker compose config
docker compose ps
curl http://localhost/health
curl http://127.0.0.1:8090/api/health
```

## Automatizovane testy

Frontend pouziva Vitest pro izolovane unit testy aplikacni logiky. Testy
nevyzaduji produkcni secrets, Microsoft Entra ID ani realna PocketBase data.

Spusteni:

```bash
cd frontend
npm run test
```

Zakladni overeni pred commitem:

```bash
cd frontend
npm run check
npm run lint
npm run test
npm run build
```

## Produkcni build

SvelteKit produkcni build pouziva `@sveltejs/adapter-node`, aby SSR aplikace mela
stabilni Node runtime vhodny pro Docker. Produkcni frontend image se sestavuje z
`frontend/Dockerfile` a spousti `node build/index.js` na portu `5173`.

Lokalni vyvoj zustava beze zmen:

```bash
docker compose up -d
```

Velikost buildu ověřite po sestaveni frontendu:

```bash
cd frontend
npm run build
Get-ChildItem .svelte-kit/output -Recurse | Measure-Object Length -Sum
```

Produkci v Dockeru ověřite pres produkcni compose override:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml config
docker compose -f docker-compose.yml -f docker-compose.prod.yml build frontend
```

Pro skutecne HTTPS spusteni nastavte produkcni domeny podle sekce Produkcni HTTPS
a pote spustte:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```
