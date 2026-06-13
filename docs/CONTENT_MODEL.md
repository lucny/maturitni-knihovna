# CONTENT_MODEL.md

# Obsahový model systému

## Projekt

Maturitní knihovna

Moderní školní znalostní portál zaměřený na českou i světovou literaturu a přípravu k maturitní zkoušce.

Tento dokument popisuje všechny typy obsahu používané v systému.

Nejde o databázový návrh.

Jde o logický model obsahu.

Databázová struktura musí z tohoto modelu vycházet.

---

# Základní principy

Obsah musí být:

* znovupoužitelný
* propojitelný
* snadno filtrovatelný
* nezávislý na konkrétním vzhledu webu

---

# ENTITY: AUTHOR

Autor literárního díla.

## Povinná pole

```text
Jméno
Příjmení
Slug
```

---

## Doporučená pole

```text
Celé jméno
Fotografie
Datum narození
Datum úmrtí
Národnost
Povolání
Životopis
Zajímavosti
Externí odkazy
```

---

## Vazby

Autor může mít:

```text
1:N Books
N:M LiteraryMovements
```

---

# ENTITY: BOOK

Nejdůležitější obsahový typ.

Představuje jedno literární dílo.

---

## Základní metadata

```text
Název
Slug
Autor
Rok vydání
Originální název
Jazyk originálu
ISBN (volitelné)
```

---

## Literární zařazení

```text
Literární období
Literární směr
Literární druh
Literární žánr
```

---

## Obsah

```text
Anotace
Obsah díla
Interpretace
Literárněhistorický kontext
```

---

## Analýza díla

```text
Témata
Motivy
Kompozice
Vypravěč
Časoprostor
Jazykové prostředky
Literární prostředky
```

---

## Postavy

Seznam hlavních postav.

Každá postava obsahuje:

```text
Jméno
Charakteristika
Role v příběhu
```

---

## Citace

Kniha může obsahovat:

```text
0..N citací
```

---

## Maturitní příprava

```text
Proč je dílo důležité
Na co se zaměřit u maturity
Možné otázky
Doporučené souvislosti
```

---

## Média

```text
Obálka
Galerie obrázků
PDF přílohy
Prezentace
Pracovní listy
```

---

## Vazby

```text
N:1 Author
N:1 LiteraryPeriod
N:M Genre
N:M LiteraryMovement
N:M RelatedBooks
1:N Quotes
1:N StudyMaterials
```

---

# ENTITY: CHARACTER

Literární postava.

V první verzi může být součástí knihy.

Později může být samostatnou entitou.

---

## Pole

```text
Jméno
Popis
Charakteristika
Vývoj postavy
Citace
```

---

# ENTITY: QUOTE

Citace z literárního díla.

---

## Pole

```text
Text citace
Zdroj
Strana (volitelně)
Komentář
```

---

## Vazby

```text
N:1 Book
```

---

# ENTITY: GENRE

Literární druh nebo žánr.

---

## Pole

```text
Název
Slug
Popis
```

---

## Příklady

```text
Román
Novela
Povídka
Drama
Tragédie
Komedie
Epos
Sonet
```

---

# ENTITY: LITERARY_PERIOD

Literární období.

---

## Pole

```text
Název
Slug
Popis
Začátek období
Konec období
```

---

## Obsah

```text
Historický kontext
Charakteristika
Významní autoři
Typické znaky
```

---

# ENTITY: LITERARY_MOVEMENT

Literární směr.

---

## Příklady

```text
Humanismus
Renesance
Baroko
Klasicismus
Romantismus
Realismus
Naturalismus
Symbolismus
Impresionismus
Expresionismus
Existencialismus
Postmodernismus
```

---

## Pole

```text
Název
Slug
Popis
Typické znaky
```

---

# ENTITY: STUDY_MATERIAL

Studijní materiál.

---

## Typy

```text
Pracovní list
Prezentace
Výklad
Rozbor
Video
Odkaz
```

---

## Pole

```text
Název
Typ
Popis
Soubor
Obsah
```

---

## Vazby

```text
N:1 Book
N:1 Author
```

Materiál může být svázán s knihou nebo autorem.

---

# ENTITY: MATURITY_TOPIC

Maturitní otázka.

---

## Pole

```text
Název
Popis
Pořadí
```

---

## Vazby

```text
N:M Books
```

---

# ENTITY: USER

Přihlášený uživatel.

---

## Pole

```text
Jméno
Příjmení
Email
Role
Avatar
```

---

## Role

```text
Student
Teacher
Editor
Admin
```

---

# ENTITY: USER_NOTE

Soukromá poznámka studenta.

---

## Pole

```text
Název
Obsah
Datum vytvoření
Datum změny
```

---

## Vazby

```text
N:1 User
N:1 Book
```

---

# ENTITY: FAVORITE

Oblíbená položka.

---

## Vazby

```text
N:1 User
N:1 Book
```

---

# ENTITY: READING_PROGRESS

Průběh studia.

Volitelné pro budoucí verze.

---

## Pole

```text
Stav
Datum zahájení
Datum dokončení
Procenta dokončení
```

---

## Stavy

```text
Nezačato
Rozpracováno
Přečteno
Zopakováno
Připraveno k maturitě
```

---

# ENTITY: TAG

Obecné štítky.

---

## Příklady

```text
Maturita
Povinná četba
Česká literatura
Světová literatura
20. století
Drama
```

---

# ENTITY: COLLECTION

Tematická kolekce knih.

---

## Příklady

```text
20 nejčastějších maturitních knih
Český realismus
Antická literatura
Dystopické romány
```

---

## Pole

```text
Název
Popis
Obrázek
```

---

# ENTITY: NEWS

Novinky systému.

Volitelné.

---

## Pole

```text
Titulek
Slug
Perex
Obsah
Publikováno
```

---

# ENTITY: PAGE

Statická stránka.

---

## Příklady

```text
O projektu
Jak pracovat se systémem
Kontakt
Podmínky použití
```

---

## Pole

```text
Název
Slug
Obsah
SEO popis
```

---

# SEO metadata

Každý veřejný obsahový typ musí podporovat:

```text
SEO title
SEO description
Open Graph image
Canonical URL
```

---

# Fulltextové vyhledávání

Vyhledávání musí být možné minimálně nad:

```text
Knihy
Autoři
Literární období
Literární směry
Citace
Studijní materiály
```

---

# Budoucí rozšíření

Model musí umožnit přidání:

```text
Audioknih
Videolekcí
AI asistenta
Čtenářského deníku
Testů
Kvízů
Více škol
Více jazyků
```

bez zásadního přepracování existující struktury.

---

# Pravidlo pro AI asistenta

Při návrhu databáze, PocketBase kolekcí, API endpointů nebo formulářů vždy nejprve vycházej z tohoto dokumentu.

Databázový model je implementací tohoto obsahového modelu, nikoliv naopak.
