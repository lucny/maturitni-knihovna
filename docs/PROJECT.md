# PROJECT.md

## Název projektu

Maturitní knihovna – školní headless znalostní portál

## Cíl projektu

Vytvořit moderní webovou aplikaci sloužící jako znalostní portál ke knihám doporučeným k maturitní zkoušce z českého jazyka a literatury.

Projekt bude současně sloužit jako výuková ukázka moderní webové architektury založené na:

* SvelteKit
* Tailwind CSS
* PocketBase
* Docker
* Microsoft Entra ID (Microsoft 365)

Aplikace bude rozdělena na:

1. veřejný web
2. interní studentský portál
3. redakční část pro učitele
4. administrační rozhraní PocketBase

Architektura musí být navržena jako headless CMS.

---

# Technologický stack

## Frontend

* SvelteKit
* TypeScript
* Tailwind CSS
* případně Shadcn-Svelte
* SSR + CSR
* responzivní design

## Backend

PocketBase:

* databáze
* autentizace
* role uživatelů
* souborové úložiště
* REST API
* administrační rozhraní

PocketBase nesmí sloužit pro vykreslování webu.

Veškerý frontend musí být realizován v SvelteKitu.

## Nasazení

Docker Compose.

Služby:

* nginx nebo Caddy
* sveltekit
* pocketbase

Veškerá komunikace přes HTTPS.

---

# Uživatelské role

## Veřejný návštěvník

Může:

* procházet knihy
* procházet autory
* vyhledávat
* filtrovat obsah

Nemůže:

* editovat obsah
* přistupovat k interním materiálům

## Student

Může:

* přihlásit se pomocí Microsoft 365
* vytvářet seznam oblíbených knih
* ukládat vlastní poznámky
* sledovat průběh přípravy k maturitě

## Učitel

Může:

* vytvářet obsah
* upravovat obsah
* publikovat materiály
* spravovat pracovní listy

## Editor

Může:

* spravovat všechny články
* schvalovat publikaci

## Administrátor

Může:

* spravovat celý systém
* spravovat uživatele
* měnit konfiguraci

---

# Autentizace

Primární autentizace:

Microsoft Entra ID (Microsoft 365).

Požadavky:

* OAuth2 / OpenID Connect
* automatické vytvoření uživatele při prvním přihlášení
* ukládání jména, emailu a role

Musí existovat také:

* lokální PocketBase administrátor
* lokální nouzový účet

Aplikace nesmí být závislá pouze na Microsoftu.

---

# Datový model

## Authors

Autor.

Pole:

* first_name
* last_name
* birth_year
* death_year
* nationality
* biography
* portrait
* website

---

## LiteraryPeriods

Literární období.

Pole:

* title
* slug
* description
* start_year
* end_year

---

## Genres

Literární druhy a žánry.

Pole:

* title
* description

---

## Books

Kniha.

Pole:

* title
* slug
* author
* literary_period
* publication_year
* genre
* cover
* annotation
* interpretation
* themes
* characters
* literary_features
* historical_context
* recommended_for_maturity
* attachments

---

## StudyMaterials

Studijní materiály.

Pole:

* title
* book
* content
* attachments
* published

---

## Quotes

Citace.

Pole:

* book
* text
* page_reference

---

## UserNotes

Soukromé poznámky studenta.

Pole:

* user
* book
* content

---

## Favorites

Oblíbené knihy.

Pole:

* user
* book

---

# Funkce veřejného webu

## Domovská stránka

Obsahuje:

* představení projektu
* vyhledávání
* poslední přidané knihy
* náhodnou knihu
* přehled literárních období

## Katalog knih

Funkce:

* stránkování
* fulltext
* filtrování
* řazení

Filtry:

* autor
* období
* žánr
* rok vydání

## Detail knihy

Obsahuje:

* obálku
* autora
* anotaci
* interpretaci
* témata
* postavy
* citace
* přílohy

## Autoři

Seznam autorů.

Detail autora obsahuje:

* životopis
* fotografie
* seznam knih

## Literární období

Přehled období.

Každé období obsahuje:

* charakteristiku
* významné autory
* knihy

---

# Interní studentský portál

Student po přihlášení získá:

* vlastní profil
* oblíbené knihy
* vlastní poznámky
* přehled přečtených knih

---

# Redakční rozhraní

Nejprve používat PocketBase Admin UI.

Později vytvořit vlastní editor v SvelteKitu.

Požadované funkce:

* vytváření knih
* editace knih
* správa autorů
* nahrávání příloh
* publikace obsahu

---

# API vrstva

Veškerá komunikace probíhá přes PocketBase API.

Vytvořit samostatnou vrstvu:

src/lib/server/api/

Nikde v komponentách nevolat PocketBase přímo.

Používat:

* repository pattern
* service layer

---

# Bezpečnost

Implementovat:

* HTTPS
* CSRF ochranu
* XSS ochranu
* bezpečné cookies
* validaci vstupů
* role based access control

Veškeré chráněné stránky kontrolovat na serveru.

Nepoužívat pouze klientské kontroly.

---

# Docker

Vytvořit:

docker-compose.yml

Služby:

* reverse-proxy
* sveltekit
* pocketbase

Persistovat:

* PocketBase data
* PocketBase uploads

---

# Kódovací standardy

Používat:

* TypeScript strict mode
* ESLint
* Prettier

Architektura:

* modulární
* čitelná
* snadno rozšiřitelná

Vyhnout se:

* duplicitám
* business logice v komponentách
* přímým databázovým voláním ve view vrstvách

---

# Budoucí rozšíření

Možná rozšíření:

* čtenářský deník
* maturitní testy
* generování PDF výpisků
* export do EPUB
* AI asistent pro rozbor knih
* doporučování podobných knih
* školní knihovna
* propojení s LMS

---

# Priorita implementace

Fáze 1:

* PocketBase
* Docker
* autentizace
* katalog knih

Fáze 2:

* autoři
* období
* vyhledávání
* filtrace

Fáze 3:

* studentský portál
* poznámky
* oblíbené knihy

Fáze 4:

* redakční rozhraní

Fáze 5:

* produkční nasazení
* monitoring
* zálohování

Kvalita architektury je důležitější než rychlost implementace.
