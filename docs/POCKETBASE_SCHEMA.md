# POCKETBASE_SCHEMA.md

# PocketBase Schema Specification

## Projekt

Maturitní knihovna

Tento dokument definuje:

* PocketBase kolekce
* relace
* indexy
* autentizaci
* role
* API pravidla

Je implementací CONTENT_MODEL.md.

---

# Zásady návrhu

PocketBase slouží pouze jako:

* databáze
* autentizace
* souborové úložiště
* API

Business logika patří do SvelteKitu.

---

# Přehled kolekcí

```text
users
authors
literary_periods
literary_movements
genres
books
book_characters
quotes
study_materials
maturity_topics
tags
collections
pages
news
user_notes
favorites
reading_progress
```

---

# AUTH COLLECTION

## users

Typ:

```text
Auth Collection
```

---

## Pole

### name

```text
Text
Required
```

---

### surname

```text
Text
Required
```

---

### role

```text
Select
```

Možnosti:

```text
student
teacher
editor
admin
```

Výchozí:

```text
student
```

---

### avatar

```text
File
```

---

### provider

```text
Text
```

Příklady:

```text
microsoft
local
```

---

### active

```text
Bool
```

Výchozí:

```text
true
```

---

## Indexy

```sql
CREATE INDEX idx_users_role
ON users(role);
```

---

# AUTHORS

## authors

---

### Pole

```text
first_name
last_name
slug
portrait
birth_date
death_date
nationality
occupation
biography
interesting_facts
website
```

---

## Indexy

```sql
CREATE UNIQUE INDEX idx_authors_slug
ON authors(slug);
```

---

# LITERARY PERIODS

## literary_periods

---

### Pole

```text
title
slug
description
start_year
end_year
historical_context
characteristics
```

---

## Indexy

```sql
CREATE UNIQUE INDEX idx_period_slug
ON literary_periods(slug);
```

---

# LITERARY MOVEMENTS

## literary_movements

---

### Pole

```text
title
slug
description
characteristics
```

---

## Indexy

```sql
CREATE UNIQUE INDEX idx_movement_slug
ON literary_movements(slug);
```

---

# GENRES

## genres

---

### Pole

```text
title
slug
description
```

---

## Indexy

```sql
CREATE UNIQUE INDEX idx_genre_slug
ON genres(slug);
```

---

# BOOKS

## books

Hlavní kolekce systému.

---

### Základní metadata

```text
title
slug
original_title
publication_year
original_language
isbn
```

---

### Relace

author

```text
Relation
authors
maxSelect=1
```

---

literary_period

```text
Relation
literary_periods
maxSelect=1
```

---

literary_movements

```text
Relation
literary_movements
multiple
```

---

genres

```text
Relation
genres
multiple
```

---

related_books

```text
Relation
books
multiple
```

---

### Obsah

```text
annotation
content_summary
interpretation
historical_context
themes
motifs
composition
narrator
time_space
language_features
literary_features
```

Použít:

```text
Editor Field
```

---

### Maturitní příprava

```text
importance
exam_notes
exam_questions
connections
```

---

### Média

cover

```text
File
single
```

---

gallery

```text
File
multiple
```

---

attachments

```text
File
multiple
```

---

### Publikace

published

```text
Bool
```

---

published_at

```text
Date
```

---

## Indexy

```sql
CREATE UNIQUE INDEX idx_book_slug
ON books(slug);
```

---

```sql
CREATE INDEX idx_book_title
ON books(title);
```

---

```sql
CREATE INDEX idx_book_year
ON books(publication_year);
```

---

# BOOK CHARACTERS

## book_characters

---

### Pole

```text
name
description
development
```

---

### Relace

book

```text
Relation
books
maxSelect=1
```

---

# QUOTES

## quotes

---

### Pole

```text
quote_text
source_reference
comment
```

---

### Relace

book

```text
Relation
books
maxSelect=1
```

---

# STUDY MATERIALS

## study_materials

---

### Pole

```text
title
slug
description
material_type
content
attachment
published
```

---

### Material Type

```text
worksheet
presentation
analysis
video
link
```

---

### Relace

book

```text
Relation
books
maxSelect=1
```

---

author

```text
Relation
authors
maxSelect=1
```

---

# MATURITY TOPICS

## maturity_topics

---

### Pole

```text
title
slug
description
order_index
```

---

### Relace

books

```text
Relation
books
multiple
```

---

# TAGS

## tags

---

### Pole

```text
title
slug
```

---

# COLLECTIONS

## collections

---

### Pole

```text
title
slug
description
cover
```

---

### Relace

books

```text
Relation
books
multiple
```

---

# NEWS

## news

---

### Pole

```text
title
slug
perex
content
cover
published
published_at
```

---

# PAGES

## pages

---

### Pole

```text
title
slug
content
seo_title
seo_description
```

---

# USER NOTES

## user_notes

Soukromé poznámky.

---

### Pole

```text
title
content
```

---

### Relace

user

```text
Relation
users
maxSelect=1
```

---

book

```text
Relation
books
maxSelect=1
```

---

# FAVORITES

## favorites

---

### Relace

user

```text
Relation
users
maxSelect=1
```

---

book

```text
Relation
books
maxSelect=1
```

---

# READING PROGRESS

## reading_progress

---

### Pole

status

```text
not_started
reading
completed
reviewed
ready_for_exam
```

---

progress_percent

```text
Number
0-100
```

---

started_at

completed_at

---

### Relace

user

book

---

# ACCESS RULES

## Public Collections

Čtení povoleno všem.

```text
authors
literary_periods
literary_movements
genres
books
quotes
pages
news
maturity_topics
collections
```

---

List Rule

```javascript
published = true
```

---

View Rule

```javascript
published = true
```

---

# Study Materials

Veřejné:

```javascript
published = true
```

---

# User Notes

Pouze vlastník.

List Rule

```javascript
user = @request.auth.id
```

---

View Rule

```javascript
user = @request.auth.id
```

---

Create Rule

```javascript
@request.auth.id != ""
```

---

Update Rule

```javascript
user = @request.auth.id
```

---

Delete Rule

```javascript
user = @request.auth.id
```

---

# Favorites

Pouze vlastník.

```javascript
user = @request.auth.id
```

---

# Reading Progress

Pouze vlastník.

```javascript
user = @request.auth.id
```

---

# Teacher Collections

Úpravy obsahu.

```javascript
@request.auth.role = "teacher"
||
@request.auth.role = "editor"
||
@request.auth.role = "admin"
```

---

# Admin Collections

Pouze admin.

```javascript
@request.auth.role = "admin"
```

---

# OAuth Providers

Primární:

```text
Microsoft Entra ID
```

---

Mapování:

```text
name
surname
email
avatar
```

---

Výchozí role:

```text
student
```

---

# Souborové limity

Obálka knihy

```text
5 MB
jpg
png
webp
```

---

Přílohy

```text
25 MB
pdf
docx
pptx
```

---

# Doporučené migrace

Pořadí vytvoření:

```text
users

authors
literary_periods
literary_movements
genres

books

book_characters
quotes
study_materials

maturity_topics
tags
collections

pages
news

user_notes
favorites
reading_progress
```

---

# Pravidlo pro AI asistenta

Při vytváření PocketBase migrací:

1. Dodržovat CONTENT_MODEL.md.
2. Dodržovat ARCHITECTURE.md.
3. Dodržovat toto schéma.
4. Nevytvářet nové kolekce bez zdůvodnění.
5. Nevkládat business logiku do PocketBase.
6. Veškerou aplikační logiku implementovat v SvelteKitu.
