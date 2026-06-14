# ROADMAP.md

# Implementační roadmapa

## Projekt

Maturitní knihovna

Headless školní znalostní portál postavený na:

* SvelteKit
* Tailwind CSS
* PocketBase
* Docker
* Microsoft Entra ID

---

# Zásady implementace

Projekt implementovat postupně.

Každá fáze musí:

* být samostatně funkční
* být otestovatelná
* být commitnutelná

Nikdy negenerovat více fází současně.

Každý commit musí:

* projít buildem
* projít lintem
* zachovat funkčnost předchozích částí

---

# FÁZE 0

## Inicializace repozitáře

### Cíl

Vytvořit základ projektu.

### Úkoly

* vytvořit Git repozitář
* vytvořit README.md
* vytvořit PROJECT.md
* vytvořit ARCHITECTURE.md
* vytvořit ROADMAP.md
* vytvořit .gitignore

### Výstup

Prázdný připravený repozitář.

### Commit

```text
chore: initialize repository
```

---

# FÁZE 1

## Docker infrastruktura

### Cíl

Spustit základní kontejnery.

### Úkoly

Vytvořit:

```text
docker-compose.yml
```

Služby:

* frontend
* pocketbase

Vytvořit:

```text
.env.example
```

### Ověření

Musí fungovat:

```bash
docker compose up
```

### Commit

```text
chore: add docker infrastructure
```

---

# FÁZE 2

## PocketBase

### Cíl

Spustit PocketBase.

### Úkoly

Přidat:

* PocketBase image
* persistentní data
* uploads

Vytvořit:

```text
pocketbase/
```

adresář.

### Ověření

Administrace dostupná.

### Commit

```text
feat: setup pocketbase
```

---

# FÁZE 3

## SvelteKit

### Cíl

Spustit frontend.

### Úkoly

Vytvořit projekt:

```bash
npm create svelte@latest
```

Přidat:

* TypeScript
* ESLint
* Prettier

### Ověření

Zobrazuje se výchozí stránka.

### Commit

```text
feat: setup sveltekit
```

---

# FÁZE 4

## Tailwind CSS

### Cíl

Přidat design systém.

### Úkoly

Instalace:

* Tailwind CSS
* PostCSS

Vytvořit:

* základní layout
* typografii

### Ověření

Tailwind funguje.

### Commit

```text
feat: integrate tailwind
```

---

# FÁZE 5

## PocketBase klient

### Cíl

Napojení SvelteKitu na PocketBase.

### Úkoly

Vytvořit:

```text
src/lib/api/
```

Implementovat:

```text
PocketBaseClient
```

### Ověření

Frontend komunikuje s PocketBase.

### Commit

```text
feat: create pocketbase client
```

---

# FÁZE 6

## Datový model

### Cíl

Vytvořit základní kolekce.

### Kolekce

Authors

LiteraryPeriods

Genres

Books

### Ověření

Lze zakládat záznamy.

### Commit

```text
feat: create core collections
```

---

# FÁZE 7

## Repository vrstva

### Cíl

Oddělit přístup k datům.

### Úkoly

Implementovat:

```text
AuthorRepository
BookRepository
GenreRepository
LiteraryPeriodRepository
```

### Ověření

Komponenty nepřistupují přímo k API.

### Commit

```text
refactor: introduce repositories
```

---

# FÁZE 8

## Veřejný layout

### Cíl

Připravit strukturu webu.

### Stránky

Home

Books

Authors

Periods

About

### Ověření

Navigace funguje.

### Commit

```text
feat: create public layout
```

---

# FÁZE 9

## Katalog knih

### Cíl

První skutečná funkcionalita.

### Funkce

Výpis knih.

Karta knihy obsahuje:

* obálku
* název
* autora

### Commit

```text
feat: add book catalog
```

---

# FÁZE 10

## Detail knihy

### Funkce

* anotace
* interpretace
* literární období
* autor

### Commit

```text
feat: add book detail
```

---

# FÁZE 11

## Autoři

### Funkce

Seznam autorů.

Detail autora.

### Commit

```text
feat: add authors section
```

---

# FÁZE 12

## Literární období

### Funkce

Výpis období.

Detail období.

### Commit

```text
feat: add literary periods
```

---

# FÁZE 13

## Vyhledávání

### Funkce

Fulltext:

* knihy
* autoři

### Commit

```text
feat: add search
```

---

# FÁZE 14

## Filtrování

### Funkce

Filtrovat:

* autora
* období
* žánr

### Commit

```text
feat: add filters
```

---

# FÁZE 15

## Microsoft Entra ID

### Cíl

Přihlášení uživatelů.

### Funkce

OAuth2

OIDC

Automatické vytvoření účtu.

### Commit

```text
feat: add microsoft authentication
```

---

# FÁZE 16

## Uživatelské role

### Role

Student

Teacher

Editor

Admin

### Commit

```text
feat: implement roles
```

---

# FÁZE 17

## Ochrana tras

### Úkoly

Implementovat:

```text
hooks.server.ts
```

### Commit

```text
feat: secure application routes
```

---

# FÁZE 18

## Studentský portál

### Stránky

Dashboard

Profil

Moje knihy

### Commit

```text
feat: create student portal
```

---

# FÁZE 19

## Poznámky

### Kolekce

UserNotes

### Funkce

Student může:

* vytvářet poznámky
* editovat poznámky
* mazat poznámky

### Commit

```text
feat: add personal notes
```

---

# FÁZE 20

## Oblíbené knihy

### Kolekce

Favorites

### Commit

```text
feat: add favorites
```

---

# FÁZE 21

## Učitelská část

### Funkce

Správa studijních materiálů.

### Commit

```text
feat: add teacher section
```

---

# FÁZE 22

## Upload souborů

### Podporované typy

* PDF
* DOCX
* PPTX
* JPG
* PNG
* WEBP

### Commit

```text
feat: add file uploads
```

---

# FÁZE 23

## Vlastní redakční rozhraní

### Funkce

CRUD:

* knihy
* autoři
* období

### Commit

```text
feat: add custom editor
```

---

# FÁZE 24

## Reverse proxy

### Varianty

Caddy (preferováno)

nebo

Nginx

### Commit

```text
feat: add reverse proxy
```

---

# FÁZE 25

## HTTPS

### Funkce

* TLS
* automatická obnova certifikátů

### Commit

```text
feat: enable https
```

---

# FÁZE 26

## Zálohování

### Cíl

Automatické zálohy.

### Zahrnout

* databázi
* uploads

### Commit

```text
feat: add backup strategy
```

---

# FÁZE 27

## Monitoring

### Funkce

Health endpoint.

### Commit

```text
feat: add monitoring
```

---

# FÁZE 28

## Testování

### Testy

Unit tests

Repository tests

Authentication tests

### Commit

```text
test: add automated tests
```

---

# FÁZE 29

## Produkční optimalizace

### Úkoly

* optimalizace bundle
* lazy loading
* image optimization
* caching

### Commit

```text
perf: optimize production build
```

---

# FÁZE 30

## Verze 1.0

### Kontrolní seznam

* veřejný web
* knihy
* autoři
* období
* vyhledávání
* filtrace
* Microsoft login
* studentský portál
* poznámky
* role
* HTTPS
* zálohování

### Commit

```text
release: version 1.0
```

---

# Verze 2.0

Plánovaná rozšíření:

* čtenářský deník
* maturitní testy
* AI asistent
* doporučování knih
* export PDF
* export EPUB
* mobilní aplikace
* LMS integrace

Tyto funkce neimplementovat před dokončením verze .0.