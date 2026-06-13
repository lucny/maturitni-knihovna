# PAGES.md

# Informační architektura a stránky systému

## Projekt

Maturitní knihovna

Moderní školní znalostní portál zaměřený na literaturu a přípravu k maturitní zkoušce.

Tento dokument popisuje:

* jednotlivé stránky
* jejich účel
* hlavní obsahové bloky
* navigaci
* přístupová práva

Neřeší grafický design.

Ten je definován v UI_GUIDELINES.md.

---

# Hlavní navigace

Veřejná část obsahuje:

```text
Domů
Knihy
Autoři
Období
Směry
Maturitní okruhy
Studijní materiály
O projektu
```

Pravá část:

```text
Vyhledávání
Přihlášení
Profil
```

---

# Veřejná část

## HOME PAGE

URL:

```text
/
```

---

### Účel

Představit projekt a umožnit rychlý přístup k obsahu.

---

### Obsahové bloky

#### Hero sekce

Obsahuje:

```text
Název projektu
Stručný popis
Vyhledávací pole
```

---

#### Doporučené knihy

Výpis:

```text
6 knih
```

---

#### Literární období

Přehled:

```text
karty období
```

---

#### Nejčtenější knihy

Výpis:

```text
8 knih
```

---

#### Nejvýznamnější autoři

Výpis:

```text
8 autorů
```

---

#### Statistiky

Zobrazit:

```text
Počet knih
Počet autorů
Počet období
Počet materiálů
```

---

# BOOK CATALOG

URL:

```text
/books
```

---

### Účel

Centrální katalog literárních děl.

---

### Obsah

#### Filtry

Levá část:

```text
Autor
Období
Směr
Žánr
Jazyk
Rok vydání
```

---

#### Výsledky

Grid knih.

Každá karta obsahuje:

```text
Obálka
Název
Autor
Období
```

---

#### Stránkování

Ve spodní části.

---

# BOOK DETAIL

URL:

```text
/books/[slug]
```

---

### Účel

Kompletní rozbor díla.

---

### Horní sekce

Levý sloupec:

```text
Obálka
Metadata
```

---

Pravý sloupec:

```text
Název
Autor
Anotace
```

---

### Sekce

#### Základní informace

```text
Autor
Rok vydání
Žánr
Směr
Období
```

---

#### Obsah díla

---

#### Interpretace

---

#### Literární kontext

---

#### Témata a motivy

---

#### Kompozice

---

#### Jazykové prostředky

---

#### Postavy

---

#### Citace

---

#### Maturitní příprava

Obsahuje:

```text
Důležité body
Časté otázky
Souvislosti
```

---

#### Studijní materiály

Výpis příloh.

---

#### Související knihy

Výpis podobných knih.

---

# AUTHORS PAGE

URL:

```text
/authors
```

---

### Účel

Katalog autorů.

---

### Obsah

Vyhledávání.

Grid autorů.

Karta:

```text
Fotografie
Jméno
Období
```

---

# AUTHOR DETAIL

URL:

```text
/authors/[slug]
```

---

### Horní sekce

```text
Fotografie
Jméno
Životopis
```

---

### Další části

#### Život a dílo

#### Literární zařazení

#### Významná díla

#### Citace

#### Související autoři

---

# LITERARY PERIODS

URL:

```text
/periods
```

---

### Obsah

Výpis období.

Karty:

```text
Název
Časové vymezení
Stručný popis
```

---

# PERIOD DETAIL

URL:

```text
/periods/[slug]
```

---

### Obsah

#### Historický kontext

#### Charakteristika období

#### Typické znaky

#### Významní autoři

#### Významná díla

---

# LITERARY MOVEMENTS

URL:

```text
/movements
```

---

### Obsah

Přehled literárních směrů.

---

# MOVEMENT DETAIL

URL:

```text
/movements/[slug]
```

---

### Obsah

```text
Popis
Znaky
Autoři
Díla
```

---

# MATURITY TOPICS

URL:

```text
/topics
```

---

### Obsah

Přehled maturitních okruhů.

---

# TOPIC DETAIL

URL:

```text
/topics/[slug]
```

---

### Obsah

```text
Popis okruhu
Související knihy
Související autoři
Doporučené materiály
```

---

# STUDY MATERIALS

URL:

```text
/materials
```

---

### Obsah

Katalog materiálů.

---

### Filtry

```text
Typ
Autor
Kniha
```

---

### Karta

```text
Název
Typ
Popis
```

---

# SEARCH PAGE

URL:

```text
/search
```

---

### Obsah

Vyhledávací pole.

---

### Výsledky rozdělit na

```text
Knihy
Autoři
Období
Směry
Materiály
Citace
```

---

# ABOUT PAGE

URL:

```text
/about
```

---

### Obsah

```text
O projektu
Jak systém používat
Technologie
Autoři projektu
```

---

# LOGIN PAGE

URL:

```text
/login
```

---

### Obsah

Tlačítka:

```text
Microsoft 365
Lokální administrátor
```

---

# USER PROFILE

URL:

```text
/profile
```

---

### Obsah

```text
Avatar
Jméno
Email
Role
```

---

# Studentská část

Pouze přihlášený student.

---

# STUDENT DASHBOARD

URL:

```text
/student
```

---

### Dashboard

Obsahuje:

```text
Počet oblíbených knih
Počet poznámek
Nedávná aktivita
```

---

### Rychlé odkazy

```text
Moje knihy
Moje poznámky
Profil
```

---

# MY BOOKS

URL:

```text
/student/books
```

---

### Obsah

Oblíbené knihy.

---

### Funkce

```text
Přidat
Odebrat
Filtrovat
```

---

# MY NOTES

URL:

```text
/ student/notes
```

---

### Obsah

Seznam poznámek.

---

### Funkce

```text
Vytvořit
Editovat
Smazat
```

---

# NOTE DETAIL

URL:

```text
/student/notes/[id]
```

---

### Obsah

Editor poznámky.

---

# Teacher Portal

Pouze role Teacher.

---

# TEACHER DASHBOARD

URL:

```text
/teacher
```

---

### Obsah

```text
Moje materiály
Nedávné změny
Statistiky
```

---

# MATERIAL MANAGEMENT

URL:

```text
/teacher/materials
```

---

### Funkce

```text
Vytvořit
Editovat
Publikovat
Archivovat
```

---

# Editor Portal

Pouze role Editor.

---

# EDITOR DASHBOARD

URL:

```text
/editor
```

---

### Obsah

```text
Čekající změny
Publikované položky
Statistiky
```

---

# CONTENT MANAGEMENT

URL:

```text
/editor/content
```

---

### Funkce

Správa:

```text
Knih
Autorů
Období
Směrů
Materiálů
```

---

# Admin Portal

Pouze role Admin.

---

# ADMIN DASHBOARD

URL:

```text
/admin
```

---

### Obsah

```text
Uživatelé
Role
Obsah
Systém
Logy
```

---

# USER MANAGEMENT

URL:

```text
/admin/users
```

---

### Funkce

```text
Vytvořit
Zakázat
Změnit roli
Resetovat účet
```

---

# SYSTEM SETTINGS

URL:

```text
/admin/settings
```

---

### Obsah

```text
Integrace
Autentizace
SEO
Monitoring
```

---

# ERROR PAGES

## 404

URL:

```text
/404
```

Obsah:

```text
Stránka nenalezena
Vyhledávání
Návrat na domovskou stránku
```

---

## 403

Obsah:

```text
Nemáte oprávnění
```

---

## 500

Obsah:

```text
Došlo k chybě systému
```

---

# Sitemap

```text
/
├── books
│   └── book-detail
│
├── authors
│   └── author-detail
│
├── periods
│   └── period-detail
│
├── movements
│   └── movement-detail
│
├── topics
│   └── topic-detail
│
├── materials
│
├── search
│
├── about
│
├── login
│
├── profile
│
├── student
│   ├── books
│   └── notes
│
├── teacher
│
├── editor
│
└── admin
```

---

# Pravidlo pro AI asistenta

Při vytváření nových stránek:

1. Nejprve zkontroluj tento dokument.
2. Nevytvářej nové stránky bez uvedení důvodu.
3. Dodržuj definovanou navigaci.
4. Dodržuj definovanou URL strukturu.
5. Dodržuj role a oprávnění.
6. Dodržuj UI_GUIDELINES.md.
7. Dodržuj ARCHITECTURE.md.

Každá nová stránka musí být konzistentní s touto specifikací.
