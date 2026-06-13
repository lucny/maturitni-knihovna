# CODING_STANDARDS.md

# Coding Standards

## Projekt

Maturitní knihovna

Tento dokument definuje pravidla pro psaní kódu v projektu založeném na:

* SvelteKit
* TypeScript
* Tailwind CSS
* PocketBase
* Docker

Cílem je, aby byl kód:

* čitelný
* konzistentní
* testovatelný
* bezpečný
* dlouhodobě udržitelný

---

# Obecné zásady

## Kód musí být jednoduchý

Preferovat srozumitelné řešení před chytrým řešením.

Vyhnout se:

* zbytečné abstrakci
* příliš hlubokému dědění
* složitým utilitám bez jasného důvodu
* monolitickým souborům

---

## Jeden soubor, jedna odpovědnost

Každý soubor má mít jasný účel.

Příklad:

```text
book.repository.ts
book.service.ts
book.schema.ts
book.types.ts
BookCard.svelte
```

Nevytvářet soubory typu:

```text
helpers.ts
utils.ts
misc.ts
common.ts
```

pokud obsahují nesouvisející logiku.

---

# TypeScript

Používat TypeScript strict mode.

Zakázáno:

```typescript
any
```

Použít pouze výjimečně a vždy s komentářem vysvětlujícím důvod.

Preferovat:

```typescript
unknown
```

před:

```typescript
any
```

---

# Pojmenování

## Soubory

Používat kebab-case:

```text
book-card.svelte
book.repository.ts
book.service.ts
auth.guard.ts
```

---

## Komponenty

Používat PascalCase:

```text
BookCard
AuthorCard
SearchBar
FilterPanel
```

---

## Proměnné a funkce

Používat camelCase:

```typescript
const bookTitle = "Máj";

function getBookBySlug(slug: string) {}
```

---

## Typy a rozhraní

Používat PascalCase:

```typescript
interface Book {}
type UserRole = "student" | "teacher" | "editor" | "admin";
```

---

## Konstanty

Používat UPPER_SNAKE_CASE:

```typescript
const MAX_UPLOAD_SIZE = 10_000_000;
const DEFAULT_PAGE_SIZE = 20;
```

---

# Struktura frontend kódu

Doporučená struktura:

```text
src/lib/
├── api/
├── auth/
├── components/
├── config/
├── models/
├── repositories/
├── schemas/
├── services/
├── stores/
├── types/
├── utils/
└── validators/
```

---

# Svelte komponenty

Komponenta má obsahovat pouze prezentační logiku.

Nepatří do ní:

* volání PocketBase
* složitá business logika
* validace práv
* složité transformace dat

Správně:

```svelte
<script lang="ts">
  import type { Book } from "$lib/types/book";

  export let book: Book;
</script>

<article>
  <h2>{book.title}</h2>
</article>
```

Špatně:

```svelte
<script lang="ts">
  import PocketBase from "pocketbase";

  const pb = new PocketBase("http://localhost:8090");
  const books = await pb.collection("books").getFullList();
</script>
```

---

# SvelteKit routes

Datové načítání provádět v:

```text
+page.server.ts
+layout.server.ts
```

Používat server-side kontrolu práv.

Nepřenášet tajné údaje do klienta.

---

# PocketBase

Veškerý přístup k PocketBase musí procházet přes API/repository vrstvu.

Zakázáno:

```typescript
pb.collection("books").getFullList()
```

přímo v komponentách.

Správně:

```typescript
const books = await bookService.getPublishedBooks();
```

---

# Repository Pattern

Repository řeší pouze přístup k datům.

Příklad:

```typescript
export interface BookRepository {
  getAll(): Promise<Book[]>;
  getBySlug(slug: string): Promise<Book | null>;
  create(data: CreateBookInput): Promise<Book>;
  update(id: string, data: UpdateBookInput): Promise<Book>;
  delete(id: string): Promise<void>;
}
```

Repository nesmí obsahovat prezentační logiku.

---

# Service Layer

Service obsahuje business logiku.

Příklad:

```typescript
export class BookService {
  constructor(private readonly repository: BookRepository) {}

  async getPublishedBooks(): Promise<Book[]> {
    return this.repository.getAllPublished();
  }
}
```

Service může:

* kombinovat více repository
* kontrolovat oprávnění
* připravovat data pro aplikaci
* řešit doménová pravidla

---

# Validace

Používat Zod.

Každý vstup z formuláře validovat:

* na klientovi
* na serveru

Příklad:

```typescript
import { z } from "zod";

export const createBookSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  annotation: z.string().optional()
});

export type CreateBookInput = z.infer<typeof createBookSchema>;
```

---

# Error handling

Nepoužívat tiché chyby.

Špatně:

```typescript
try {
  await saveBook(data);
} catch {}
```

Správně:

```typescript
try {
  await saveBook(data);
} catch (error) {
  logger.error("Failed to save book", error);
  throw new AppError("BOOK_SAVE_FAILED", "Knihu se nepodařilo uložit.");
}
```

---

# Vlastní chyby

Používat jednotný typ aplikační chyby.

```typescript
export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status = 500
  ) {
    super(message);
  }
}
```

---

# Logování

Používat centralizovaný logger.

```typescript
logger.info("Book created", { bookId });
logger.warn("Unauthorized access attempt", { userId });
logger.error("PocketBase request failed", error);
```

Neloggovat:

* hesla
* tokeny
* session cookies
* osobní údaje bez důvodu

---

# Autentizace

Autentizaci řešit serverově.

Používat:

```text
hooks.server.ts
```

Kontrolovat:

* existenci session
* platnost uživatele
* roli uživatele
* přístup k chráněné trase

---

# Role a oprávnění

Role definovat centrálně.

```typescript
export const USER_ROLES = {
  STUDENT: "student",
  TEACHER: "teacher",
  EDITOR: "editor",
  ADMIN: "admin"
} as const;
```

Nikdy nepoužívat řetězce rolí náhodně v kódu.

Špatně:

```typescript
if (user.role === "teacher") {}
```

Správně:

```typescript
if (user.role === USER_ROLES.TEACHER) {}
```

---

# Tailwind CSS

Používat utility classes konzistentně.

Opakující se UI přesunout do komponent.

Špatně:

```svelte
<button class="px-4 py-2 rounded bg-blue-700 text-white">
```

opakované na mnoha místech.

Správně:

```svelte
<Button variant="primary">Uložit</Button>
```

---

# Komponenty UI

Základní komponenty udržovat v:

```text
src/lib/components/ui/
```

Příklady:

```text
button.svelte
input.svelte
card.svelte
badge.svelte
modal.svelte
table.svelte
```

Doménové komponenty udržovat v:

```text
src/lib/components/domain/
```

Příklady:

```text
book-card.svelte
author-card.svelte
period-badge.svelte
```

---

# Formuláře

Každý formulář musí mít:

* label
* validaci
* chybové hlášení
* loading stav
* disabled stav při odesílání

Nepoužívat formuláře bez serverové kontroly.

---

# API odpovědi

Používat jednotný tvar.

```typescript
type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };
```

---

# Práce s daty

Nepřenášet PocketBase record přímo do UI.

Používat mappery.

```typescript
function mapBookRecord(record: RecordModel): Book {
  return {
    id: record.id,
    title: record.title,
    slug: record.slug
  };
}
```

---

# Testování

Minimálně testovat:

* repository
* service layer
* validace
* auth guards
* utility funkce

Testy pojmenovávat:

```text
book.service.test.ts
auth.guard.test.ts
create-book.schema.test.ts
```

---

# Commit pravidla

Používat Conventional Commits.

Příklady:

```text
feat: add book catalog
fix: repair auth redirect
refactor: simplify book repository
test: add book service tests
docs: update architecture notes
chore: update dependencies
```

---

# Komentáře

Komentovat pouze tam, kde komentář vysvětluje důvod.

Nekomentovat samozřejmý kód.

Špatně:

```typescript
// increment counter by one
counter++;
```

Správně:

```typescript
// PocketBase returns relation fields under expand, so we normalize them here.
```

---

# Bezpečnost

Nikdy neukládat do repozitáře:

* hesla
* tokeny
* client secrets
* certifikáty
* produkční .env soubory

Všechny tajné údaje patří do prostředí.

---

# Upload souborů

Kontrolovat:

* velikost
* MIME typ
* příponu
* oprávnění uživatele

Povolené typy:

```text
pdf
docx
pptx
jpg
png
webp
```

---

# Přístupnost

Každá interaktivní komponenta musí být ovladatelná klávesnicí.

Každý formulářový prvek musí mít label.

Každý obrázek musí mít smysluplný alt text nebo prázdný alt, pokud je dekorativní.

---

# Výkon

Neposílat zbytečně velká data.

Používat:

* stránkování
* lazy loading
* optimalizované obrázky
* server-side načítání tam, kde dává smysl

---

# Zakázané postupy

Nepoužívat:

* business logiku v komponentách
* přímé volání PocketBase z UI
* globální store pro všechno
* any bez důvodu
* inline styly bez důvodu
* duplicitní validace psané ručně místo Zodu
* hardcoded URL v kódu
* tajné údaje v repozitáři

---

# Pravidlo pro AI asistenta

Při generování kódu vždy:

1. Zkontroluj `PROJECT.md`.
2. Zkontroluj `ARCHITECTURE.md`.
3. Zkontroluj `ROADMAP.md`.
4. Zkontroluj `UI_GUIDELINES.md`.
5. Zkontroluj `SEED_DATA.md`.
6. Dodrž tento soubor `CODING_STANDARDS.md`.

Nikdy nepřeskakuj fáze roadmapy.

Nikdy neměň architekturu bez výslovného důvodu.

Nikdy negeneruj rozsáhlý kód napříč mnoha nesouvisejícími částmi projektu současně.
