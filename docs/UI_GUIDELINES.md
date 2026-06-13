# UI_GUIDELINES.md

# Design System

## Projekt

Maturitní knihovna

Moderní školní znalostní portál zaměřený na literaturu a přípravu k maturitě.

Cílem není vytvořit komerční e-shop ani korporátní aplikaci.

Vizuální styl musí působit:

* moderně
* akademicky
* přehledně
* důvěryhodně
* čitelně
* nadčasově

Inspirace:

* Notion
* Linear
* GitHub
* Vercel
* Stripe Documentation
* moderní univerzitní portály

---

# Design principy

## Minimalismus

Preferovat:

* dostatek prostoru
* jednoduché rozvržení
* jasnou hierarchii

Vyhnout se:

* přeplácanosti
* agresivním efektům
* velkým animacím

---

## Obsah na prvním místě

Primární funkcí systému je práce s textem.

Rozhraní musí podporovat:

* čtení
* studium
* vyhledávání
* orientaci v obsahu

Grafika nesmí odvádět pozornost od obsahu.

---

# Barevná paleta

## Primární barva

```css
#1e40af
```

Tmavší akademická modrá.

Používat pro:

* tlačítka
* odkazy
* zvýraznění

---

## Sekundární barva

```css
#0f172a
```

Tmavě břidlicová.

Používat pro:

* nadpisy
* navigaci

---

## Pozadí

```css
#ffffff
```

a

```css
#f8fafc
```

---

## Úspěch

```css
#16a34a
```

---

## Varování

```css
#d97706
```

---

## Chyba

```css
#dc2626
```

---

# Typografie

Používat:

```css
font-family:
Inter,
system-ui,
sans-serif;
```

---

# Velikosti nadpisů

H1

```css
text-4xl
font-bold
```

---

H2

```css
text-3xl
font-semibold
```

---

H3

```css
text-2xl
font-semibold
```

---

H4

```css
text-xl
font-medium
```

---

# Text

Běžný text:

```css
text-base
leading-7
```

Maximální šířka:

```css
max-w-4xl
```

---

# Layout

## Maximální šířka

Používat:

```css
max-w-7xl
mx-auto
```

---

## Odsazení

Desktop:

```css
px-8
```

Mobil:

```css
px-4
```

---

# Navigace

Výška:

```css
72px
```

Obsah:

* logo
* hlavní menu
* vyhledávání
* přihlášení

Navigace musí být:

* sticky
* světlá
* jednoduchá

---

# Footer

Obsahuje:

* informace o projektu
* kontakty
* licence
* GitHub odkaz

Tmavé pozadí.

---

# Komponenty

## Button

Varianty:

### Primary

Modré tlačítko.

Používat pro hlavní akce.

---

### Secondary

Světlé tlačítko s rámečkem.

---

### Danger

Červené tlačítko.

Pouze pro mazání.

---

# Card

Používat:

```css
rounded-xl
border
shadow-sm
```

Nikdy:

```css
shadow-2xl
```

nebo výrazné efekty.

---

# Badge

Používat pro:

* literární období
* žánry
* štítky

Zaoblené.

Malé.

Nenápadné.

---

# Input

Styl:

```css
rounded-lg
border
```

Při focus:

```css
ring-2
ring-primary
```

---

# Stránka knih

## Rozvržení

Dva sloupce.

### Levý

* obálka knihy
* základní metadata

---

### Pravý

* název
* autor
* anotace
* interpretace
* témata

---

# Obálka

Poměr:

```css
2:3
```

Nikdy nedeformovat.

---

# Stránka autora

Horní část:

* portrét
* jméno
* životopis

Pod tím:

* seznam knih

---

# Katalog knih

Používat grid.

Desktop:

```css
grid-cols-4
```

Tablet:

```css
grid-cols-2
```

Mobil:

```css
grid-cols-1
```

---

# Karta knihy

Obsah:

* obálka
* název
* autor
* období

Kliknutelná celá karta.

Hover:

* lehké zvýraznění
* žádné výrazné animace

---

# Vyhledávání

Musí být dostupné:

* v navigaci
* na úvodní stránce

Preferovat:

* okamžité filtrování
* debounce

---

# Dashboard studenta

Sekce:

## Přehled

Obsahuje:

* počet oblíbených knih
* počet poznámek
* poslední aktivitu

---

## Moje knihy

Přehled oblíbených knih.

---

## Poznámky

Seznam poznámek.

---

# Redakční rozhraní

Styl podobný:

* PocketBase
* GitHub
* Vercel

Ne podobný:

* WordPress Classic
* staré administrační systémy

---

# Tabulky

Používat:

* zebra rows
* sticky header

Musí být dobře čitelné.

---

# Formuláře

Šířka:

```css
max-w-3xl
```

Nevytvářet příliš široké formuláře.

---

# Ikony

Používat:

```text
lucide-svelte
```

Preferovat:

* Book
* Library
* User
* Search
* Notebook
* GraduationCap
* FileText
* Settings

---

# Tmavý režim

Implementovat od začátku.

Používat:

```css
class="dark"
```

Nikdy nevytvářet samostatnou druhou sadu komponent.

---

# Animace

Používat střídmě.

Preferovat:

```css
transition-colors
transition-opacity
```

Vyhnout se:

* parallax
* složitým animacím
* přehnaným transformacím

---

# Přístupnost

Dodržovat WCAG.

Každý formulář musí mít:

* label
* focus state
* keyboard navigation

---

# Responsivita

Podporovat:

* mobil
* tablet
* desktop

Mobile-first přístup.

---

# AI pravidla

Při generování nových komponent:

1. Používej existující komponenty.
2. Nevytvářej nové barevné varianty bez důvodu.
3. Dodržuj definovanou typografii.
4. Dodržuj definované rozestupy.
5. Dodržuj definovaný design systém.
6. Preferuj jednoduchost před efektností.
7. Obsah má vždy přednost před grafikou.

Každá nová stránka musí působit jako přirozená součást zbytku systému.
