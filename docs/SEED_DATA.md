# SEED_DATA.md

# Seed Data Specification

## Projekt

Maturitní knihovna

Účelem tohoto dokumentu je definovat ukázková data pro vývoj, testování a demonstraci systému.

Data musí připomínat skutečný školní znalostní portál.

Nepoužívat generické položky typu:

* Test Author
* Example Book
* Demo Record

Používat realistická data.

---

# Literární období

Vytvořit následující období.

## Antika

```json
{
  "title": "Antika",
  "startYear": -800,
  "endYear": 476
}
```

---

## Středověk

```json
{
  "title": "Středověk",
  "startYear": 476,
  "endYear": 1492
}
```

---

## Renesance a humanismus

```json
{
  "title": "Renesance a humanismus",
  "startYear": 1492,
  "endYear": 1600
}
```

---

## Baroko

```json
{
  "title": "Baroko",
  "startYear": 1600,
  "endYear": 1780
}
```

---

## Klasicismus

```json
{
  "title": "Klasicismus",
  "startYear": 1780,
  "endYear": 1830
}
```

---

## Romantismus

```json
{
  "title": "Romantismus",
  "startYear": 1800,
  "endYear": 1880
}
```

---

## Realismus

```json
{
  "title": "Realismus",
  "startYear": 1850,
  "endYear": 1900
}
```

---

## Moderní směry přelomu století

```json
{
  "title": "Moderní směry přelomu století",
  "startYear": 1890,
  "endYear": 1918
}
```

---

## Meziválečná literatura

```json
{
  "title": "Meziválečná literatura",
  "startYear": 1918,
  "endYear": 1945
}
```

---

## Literatura po roce 1945

```json
{
  "title": "Literatura po roce 1945",
  "startYear": 1945,
  "endYear": 1989
}
```

---

## Současná literatura

```json
{
  "title": "Současná literatura",
  "startYear": 1989,
  "endYear": null
}
```

---

# Žánry

Vytvořit minimálně:

```json
[
  "Román",
  "Novela",
  "Povídka",
  "Drama",
  "Tragédie",
  "Komedie",
  "Epos",
  "Báseň",
  "Sonet",
  "Fejeton",
  "Reportáž",
  "Deník",
  "Memoáry",
  "Sci-fi",
  "Detektivka"
]
```

---

# Autoři

Vytvořit minimálně 30 autorů.

## Povinní čeští autoři

```text
Karel Hynek Mácha
Božena Němcová
Jan Neruda
Alois Jirásek
Karel Čapek
Jaroslav Hašek
Vítězslav Nezval
Franz Kafka
Bohumil Hrabal
Milan Kundera
Ota Pavel
Arnošt Lustig
Josef Škvorecký
Ladislav Fuks
```

---

## Světoví autoři

```text
Homér
Dante Alighieri
William Shakespeare
Miguel de Cervantes
Molière
Johann Wolfgang Goethe
Victor Hugo
Honoré de Balzac
Charles Dickens
Lev Nikolajevič Tolstoj
Fjodor Michajlovič Dostojevskij
Émile Zola
Ernest Hemingway
George Orwell
John Steinbeck
Albert Camus
Gabriel García Márquez
Umberto Eco
```

---

# Knihy

Vytvořit minimálně 50 knih.

Každá kniha musí mít:

```json
{
  "title": "",
  "author": "",
  "publicationYear": 0,
  "annotation": "",
  "interpretation": "",
  "themes": [],
  "characters": []
}
```

---

# Doporučený seznam knih

## Česká literatura

```text
Máj
Babička
Povídky malostranské
Staré pověsti české
R.U.R.
Bílá nemoc
Válka s mloky
Osudy dobrého vojáka Švejka
Spalovač mrtvol
Obsluhoval jsem anglického krále
Postřižiny
Smrt krásných srnců
Žert
```

---

## Světová literatura

```text
Ilias
Odysseia
Božská komedie
Hamlet
Romeo a Julie
Don Quijote
Utrpení mladého Werthera
Bídníci
Otec Goriot
Oliver Twist
Anna Karenina
Zločin a trest
Na západní frontě klid
Stařec a moře
1984
Farma zvířat
O myších a lidech
Cizinec
Sto roků samoty
Jméno růže
```

---

# Uživatelé

Vytvořit testovací účty.

## Administrátor

```json
{
  "email": "admin@example.local",
  "role": "admin"
}
```

---

## Učitel

```json
{
  "email": "teacher@example.local",
  "role": "teacher"
}
```

---

## Editor

```json
{
  "email": "editor@example.local",
  "role": "editor"
}
```

---

## Student

```json
{
  "email": "student@example.local",
  "role": "student"
}
```

---

# Poznámky

Každý student musí mít:

* 3 až 10 poznámek

Příklad:

```text
Zajímavé srovnání Hamleta a Raskolnikova.
```

---

# Oblíbené knihy

Každý student:

* 5 až 15 oblíbených knih

Náhodně vybraných.

---

# Přílohy

Ke knihám vytvořit ukázkové soubory:

```text
working-sheet.pdf
analysis.pdf
presentation.pptx
```

Používat pouze demonstrační obsah.

---

# Obrázky

Autoři:

* portrét

Knihy:

* obálka

Používat:

```text
https://picsum.photos/
```

nebo lokální placeholdery.

Nikdy nepoužívat nelegálně převzaté obálky.

---

# Generování testovacích dat

Při generování dalších dat dodržovat:

* reálné názvy
* reálné autory
* reálná období
* reálné žánry

Nevytvářet smyšlené autory, pokud není výslovně požadováno.

---

# Doporučený rozsah seed databáze

Vývojové prostředí:

```text
11 literárních období
15 žánrů
30 autorů
50 knih
20 studijních materiálů
10 uživatelů
50 poznámek
50 oblíbených položek
```

---

# Rozšířená demonstrační databáze

Pro prezentace a výuku:

```text
50 autorů
100 knih
50 studijních materiálů
100 citací
30 uživatelů
200 poznámek
```

Tato velikost umožňuje realistické testování:

* vyhledávání
* filtrování
* stránkování
* oprávnění
* dashboardů
* výkonu aplikace

```
```
