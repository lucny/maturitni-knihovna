# ARCHITECTURE.md

# Architektura projektu

## Název

Maturitní knihovna

Moderní headless znalostní portál postavený na:

* SvelteKit
* TypeScript
* Tailwind CSS
* PocketBase
* Docker

---

# Architektonické principy

Projekt musí dodržovat následující principy:

## Headless přístup

PocketBase je pouze backend.

PocketBase nesmí:

* vykreslovat stránky
* obsahovat vlastní frontend
* řešit prezentační logiku

PocketBase slouží pouze jako:

* databáze
* autentizační server
* API
* souborové úložiště

Veškeré uživatelské rozhraní vytváří SvelteKit.

---

## Oddělení vrstev

Dodržovat čisté oddělení:

Presentation Layer

↓

Application Layer

↓

Domain Layer

↓

Infrastructure Layer

---

# Struktura projektu

```text
project-root/
│
├── docker/
│   ├── nginx/
│   ├── caddy/
│   └── pocketbase/
│
├── pocketbase/
│   ├── pb_data/
│   └── pb_migrations/
│
├── frontend/
│
│   ├── src/
│   │
│   ├── lib/
│   │   ├── api/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── auth/
│   │   ├── models/
│   │   ├── stores/
│   │   ├── validators/
│   │   ├── components/
│   │   └── utils/
│   │
│   ├── routes/
│   │
│   ├── hooks.server.ts
│   └── hooks.client.ts
│
├── docker-compose.yml
│
└── README.md
```

---

# Doménový model

## Author

```typescript
interface Author {
  id: string;
  firstName: string;
  lastName: string;
  birthYear?: number;
  deathYear?: number;
  nationality?: string;
  biography?: string;
  portrait?: string;
}
```

---

## LiteraryPeriod

```typescript
interface LiteraryPeriod {
  id: string;
  title: string;
  slug: string;
  description?: string;
  startYear?: number;
  endYear?: number;
}
```

---

## Genre

```typescript
interface Genre {
  id: string;
  title: string;
  description?: string;
}
```

---

## Book

```typescript
interface Book {
  id: string;
  title: string;
  slug: string;
  authorId: string;
  literaryPeriodId?: string;
  publicationYear?: number;
  annotation?: string;
  interpretation?: string;
}
```

---

## UserNote

```typescript
interface UserNote {
  id: string;
  userId: string;
  bookId: string;
  content: string;
}
```

---

# Repository vrstva

Komponenty nesmí komunikovat přímo s PocketBase.

Používat Repository Pattern.

Příklad:

```typescript
BookRepository
AuthorRepository
GenreRepository
UserRepository
```

---

## Rozhraní

```typescript
export interface BookRepository {
  getAll(): Promise<Book[]>;
  getById(id: string): Promise<Book>;
  getBySlug(slug: string): Promise<Book>;
}
```

---

# Service vrstva

Business logika musí být umístěna zde.

Příklady:

```typescript
BookService
AuthorService
AuthenticationService
UserProfileService
```

---

Příklad:

```typescript
BookService
    ↓
BookRepository
    ↓
PocketBase API
```

---

# API vrstva

Vytvořit jednotné API klienty.

```text
src/lib/api/
```

Příklad:

```typescript
PocketBaseClient
```

Veškerá komunikace s PocketBase musí být soustředěna zde.

---

# Autentizace

## Typy účtů

### Microsoft 365

Primární přihlášení.

Role:

* student
* teacher
* editor

---

### Lokální administrátor

Pouze pro správu systému.

Musí fungovat i při nedostupnosti Microsoftu.

---

# Řízení přístupů

Používat RBAC.

```typescript
enum UserRole {
  STUDENT,
  TEACHER,
  EDITOR,
  ADMIN
}
```

---

## Oprávnění

### Student

Může:

* číst obsah
* ukládat poznámky
* spravovat oblíbené knihy

Nemůže:

* editovat veřejný obsah

---

### Teacher

Může:

* vytvářet materiály
* upravovat materiály

---

### Editor

Může:

* publikovat obsah
* schvalovat změny

---

### Admin

Může vše.

---

# Route Groups

Používat oddělené skupiny tras.

```text
routes/

(public)/
(auth)/
(student)/
(teacher)/
(editor)/
(admin)/
```

---

Příklad:

```text
(public)/books
(public)/authors

(student)/dashboard
(student)/notes

(teacher)/materials

(admin)/users
(admin)/settings
```

---

# Ochrana tras

Kontrolovat v:

```typescript
hooks.server.ts
```

Nikdy nespoléhat pouze na:

```typescript
+page.svelte
```

---

# Komponentová architektura

## Atomy

```text
Button
Input
Badge
Card
```

---

## Molekuly

```text
SearchBar
BookCard
AuthorCard
FilterPanel
```

---

## Organismy

```text
BookCatalog
AuthorList
DashboardOverview
```

---

# Stav aplikace

Používat Svelte Stores.

```typescript
authStore
userStore
themeStore
```

Nevytvářet globální stav bez důvodu.

---

# Validace

Používat:

```typescript
Zod
```

Každý formulář musí mít:

* klientskou validaci
* serverovou validaci

---

# Vyhledávání

První verze:

PocketBase filter API.

Později:

Meilisearch.

Architekturu navrhnout tak, aby bylo možné Meilisearch připojit bez zásadních změn.

---

# Soubory

Přílohy ukládat do PocketBase.

Podporované typy:

```text
pdf
docx
pptx
jpg
png
webp
```

---

# Logování

Vytvořit centralizovaný logger.

```typescript
LoggerService
```

Podporovat:

* info
* warning
* error

---

# Monitoring

Připravit prostor pro:

* health endpoint
* uptime monitoring
* log aggregation

---

# Docker architektura

```text
Internet
    ↓
Reverse Proxy
    ↓
SvelteKit
    ↓
PocketBase
```

PocketBase nesmí být veřejně dostupný.

Pouze reverse proxy.

---

# Prostředí

Používat:

```text
.env
.env.local
.env.production
```

Nikdy neukládat tajné údaje do repozitáře.

---

# Produkční požadavky

Musí fungovat:

* HTTPS
* automatické obnovování certifikátů
* zálohování PocketBase
* restart po pádu kontejneru

---

# Zásady pro AI generovaný kód

Generovaný kód musí:

* používat TypeScript strict mode
* obsahovat typové definice
* obsahovat komentáře pouze tam, kde dávají smysl
* být modulární
* být testovatelný

Vyhnout se:

* monolitickým komponentám
* duplicitní logice
* přímému přístupu k PocketBase z UI komponent
* business logice uvnitř Svelte komponent

---

# Budoucí rozšíření

Architektura musí umožnit:

* více škol
* více jazyků
* AI asistenta
* LMS integraci
* čtenářský deník
* maturitní testy
* školní knihovnu
* mobilní aplikaci

Bez nutnosti zásadního přepisování systému.
