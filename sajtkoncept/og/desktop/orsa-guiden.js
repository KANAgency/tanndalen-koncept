/* Orsaguiden (platshållarnamn, motsvarar TD:s Fjällguiden): frågekälla, svar och startvy.
   ALLT innehåll här är påhittat demoinnehåll. Fakta, tider, priser och namn i [hakparentes] ska bytas mot riktiga uppgifter.
   Svaren utgår från demovistelsen i demo-stay.js: [Anna], 2 vuxna + 2 barn (6 och 9 år), [Grönklitt Stugby] 15–22 feb 2027. */

const IMG = "./assets/img/";

/* En källa för frågeförslag (motsvarar window.TD_FRAGOR): huvudmenyns fråga-vy, Just nu-guiden (tre första) och Vanliga frågor-blocket.
   Nyckel = läge (general | booking | onsite) + säsong (Summer). */
export const OG_FRAGOR = {
  general: ["Hur mycket snö är det?", "Passar Orsa Grönklitt för små barn?", "Hur lång tid tar det från Stockholm?", "Vad finns att göra förutom skidåkning?", "Hur långa är längdspåren?", "Hur bokar jag?"],
  generalSummer: ["Vad gör vi med barnen idag?", "Är Rovdjursparken öppen idag?", "Hur lång tid tar det från Stockholm?", "Var kan vi bada idag?", "Kan vi cykla i backen?", "Hur bokar jag?"],
  booking: ["Var hämtar vi hyrskidorna?", "Hur funkar skidskolan för barnen?", "Hur långt är det från stugan till backen?", "Hur tidigt kan vi checka in?", "Vilka liftkort behöver vi?", "Kan jag ändra min bokning?"],
  bookingSummer: ["Vad finns att göra under vår vecka?", "Hur tidigt kan vi checka in?", "Kan vi cykla i backen?", "Behöver vi myggmedel?", "Är Rovdjursparken öppen idag?", "Kan jag ändra min bokning?"],
  onsite: ["Vilka backar passar barnen idag?", "Var äter vi lunch i backen?", "Vad gör vi om det regnar?", "Vad händer för barn idag?", "När stänger barnbacken?", "Var hyr vi pulka?"],
  onsiteSummer: ["Vad gör vi med barnen idag?", "Är Rovdjursparken öppen idag?", "Var kan vi bada idag?", "Vad gör vi om det regnar?", "Vilken led passar barnen?", "Kan vi cykla i backen?"]
};

export function ogFragor() {
  const d = document.documentElement.dataset;
  const base = d.mode === "booking" || d.mode === "onsite" ? d.mode : "general";
  return OG_FRAGOR[base + (d.season === "summer" ? "Summer" : "")];
}

export const RAIN = "Det regnar, vad kan vi göra idag?";
export const RAIN_ANSWER = "Regn är ingen katastrof här. [Grönklitt Äventyrsbad] har bassäng och bastu, i [lekladan] kan barnen klättra medan ni fikar, och Orsa Rovdjurspark är öppen i alla väder. Blir det uppehåll är backarna ofta tomma.";
export const GENERIC = "Det här är en demo – den här frågan har inget förinspelat svar än.";
export const FOLLOW = "Det här är en demo – fler svar kommer";
export const SUGGEST = ["Hur mycket snö är det?", "Passar Orsa Grönklitt för små barn?", "Hur lång tid tar det från Stockholm?", "Vad gör vi om det regnar?"];

const card = (kicker, title, line, image) => ({ kicker, title, line, image: IMG + image });
const src = (...links) => `Källor: ${links.map(([href, label]) => `<a href="${href}">${label}</a>`).join(" · ")}`;

export const QA = {};
export const qaFor = (q) => {
  const e = QA[q];
  return e && e.summer && document.documentElement.dataset.season === "summer" ? e.summer : e;
};

QA[RAIN] = QA["Vad gör vi om det regnar?"] = {
  answer: RAIN_ANSWER,
  sources: src(["#aktiviteter", "Aktiviteter"], ["#service", "Mat och service"]),
  cards: [
    card("Aktivitet", "[Grönklitt Äventyrsbad]", "[Öppet 10–20], bassäng och bastu", "fraga-bastu.jpg"),
    card("Aktivitet", "Orsa Rovdjurspark", "Öppen i alla väder, [10 min] bort", "platshallare.svg"),
    card("Aktivitet", "[Klätterväggen]", "Från [5] år, boka på plats", "fraga-klatter.jpg")
  ],
  chips: ["Vad händer för barn idag?", "Är Rovdjursparken öppen idag?"],
  summer: {
    answer: "Ta Rovdjursparken, den är öppen i regn och björnarna bryr sig inte. [Orsa Bibliotek] har sagostund [lördagar 11], och i Orsa centrum finns [Kulturhuset] med utställning om Dalarnas historia. Uppehåll brukar komma efter lunch.",
    sources: src(["#aktiviteter", "Aktiviteter"]),
    cards: [
      card("Aktivitet", "Orsa Rovdjurspark", "Björn, varg, lodjur och järv", "platshallare.svg"),
      card("Plats", "[Kulturhuset i Orsa]", "Dalarnas historia, [fri entré]", "platshallare.svg"),
      card("Aktivitet", "[Grönklitt Äventyrsbad]", "Bassäng och bastu", "fraga-bastu.jpg")
    ],
    chips: ["Var kan vi bada idag?", "Vad gör vi med barnen idag?"]
  }
};

QA["Hur mycket snö är det?"] = {
  answer: "[78 cm] uppe på toppen och [52 cm] nere vid stugorna. Det kom [6 cm] i natt och [15 cm] till är utlovat fram till helgen. Alla [14] nedfarter och [142 av 180 km] längdspår är öppna.",
  sources: src(["#just-nu", "Just nu"]),
  cards: [
    card("Just nu", "Längdspåren", "[142 av 180 km] preparerade", "langd.jpg"),
    card("Just nu", "Backarna", "[14 av 14] nedfarter öppna", "og-hero-winter.jpg")
  ],
  chips: ["Hur långa är längdspåren?", "Passar Orsa Grönklitt för små barn?"]
};

QA["Passar Orsa Grönklitt för små barn?"] = {
  answer: "Ja, det är det vi är bäst på. Barnområdet ligger [vid stugbyn] med egen knapplift och rullband, skidskolan tar barn från [4 år], och de flesta backar är gröna och blå. De som inte vill åka skidor kan träffa björnarna i Rovdjursparken.",
  sources: src(["#skidskola", "Skidskola"], ["#aktiviteter", "För barn"]),
  cards: [
    card("Plats", "Barnområdet", "Knapplift och rullband, [10–15]", "teaser-skola-b.png"),
    card("Aktivitet", "Skidskola för barn", "Från [4] år, [halvdag eller heldag]", "platshallare.svg")
  ],
  chips: ["Hur funkar skidskolan för barnen?", "Vad finns att göra förutom skidåkning?"],
  summer: {
    answer: "Ja. På sommaren är det Rovdjursparken, bad i [Skattungen], [lekplatsen vid toppstugan] och korta leder i skogen som barnen orkar. Liften går upp till toppen [10–17] så de minsta slipper gå uppför.",
    sources: src(["#aktiviteter", "För barn"]),
    cards: [
      card("Aktivitet", "Orsa Rovdjurspark", "[10 min] från stugorna", "platshallare.svg"),
      card("Plats", "[Skattungen]", "Badplats med grund strand", "platshallare.svg")
    ],
    chips: ["Vad gör vi med barnen idag?", "Var kan vi bada idag?"]
  }
};

QA["Hur lång tid tar det från Stockholm?"] = {
  answer: "Ungefär fyra timmar med bil, [E18/E4 och sedan väg 45 via Mora]. Tåget går till [Mora] och därifrån är det [30 minuter] med buss eller taxi. Från Göteborg och Malmö är det längre, men ett stopp på vägen räcker oftast.",
  sources: src(["#hitta-hit", "Hitta hit"]),
  cards: [
    card("Resa", "Med bil", "Cirka 4 h från Stockholm", "banner-vinter.jpg"),
    card("Resa", "Med tåg", "Till [Mora], sedan [30 min]", "fjalltagen.jpg")
  ],
  chips: ["Hur tidigt kan vi checka in?", "Hur bokar jag?"]
};

QA["Vad finns att göra förutom skidåkning?"] = {
  answer: "Mycket. Orsa Rovdjurspark ligger [tio minuter] bort, det finns [hundspann], [pulkabacke] och [skridskor på Orsasjön]. I Orsa och Mora kan ni se hur dalahästar och kurbits görs. Och kvällarna är för bastu.",
  sources: src(["#aktiviteter", "Aktiviteter"]),
  cards: [
    card("Aktivitet", "Orsa Rovdjurspark", "Björn, varg, lodjur och järv", "platshallare.svg"),
    card("Aktivitet", "[Hundspann]", "Från [4] år, boka i förväg", "snow.jpg"),
    card("Aktivitet", "Bastu", "[I stugbyn], öppen till [21]", "fraga-bastu.jpg")
  ],
  chips: ["Vad händer för barn idag?", "Vad gör vi om det regnar?"]
};

QA["Hur långa är längdspåren?"] = {
  answer: "Totalt [180 km], från [2,5 km] barnslinga vid stugbyn till [långturen mot Fryksås]. [62 km] preparerades i natt och elljusspåret är tänt till [21]. Längdåkningen är det vi gör mest av här.",
  sources: src(["#just-nu", "Spårkarta"]),
  cards: [
    card("Spår", "[Barnslingan]", "[2,5 km], flackt och upplyst", "langd.jpg"),
    card("Spår", "[Fryksåsturen]", "[25 km], för vana åkare", "og-hero-winter.jpg")
  ],
  chips: ["Vilka spår är nypreparerade?", "Var hyr vi längdskidor?"]
};

QA["Hur bokar jag?"] = {
  answer: "Välj datum och boende i sökrutan högst upp. Liftkort, skidhyra och skidskola lägger du till i samma bokning, nu eller senare. Vill du hellre prata med någon svarar gästservice [08–20].",
  sources: src(["#booking", "Boka"]),
  cards: [card("Boka", "Boende", "Stugor och lägenheter", "meny-boende.jpg")],
  chips: ["Kan jag ändra min bokning?", "Vilka liftkort behöver vi?"],
  summer: {
    answer: "Välj datum och boende i sökrutan högst upp. Aktiviteter som Rovdjursparken och cykelhyra lägger du till i samma bokning. Vill du hellre prata med någon svarar gästservice [08–20].",
    sources: src(["#booking", "Boka"]),
    cards: [card("Boka", "Boende", "Stugor och lägenheter", "meny-boende.jpg")],
    chips: ["Kan jag ändra min bokning?", "Vad gör vi med barnen idag?"]
  }
};

QA["Var hämtar vi hyrskidorna?"] = {
  answer: "I [skiduthyrningen vid liftstationen], [50 m] från er stuga. Utrustningen är förberedd i era storlekar från [16:00] på ankomstdagen, så ni kan hämta direkt efter incheckning.",
  sources: src(["#skidhyra", "Skidhyra"], ["#bokning", "Din bokning"]),
  cards: [card("Plats", "[Skiduthyrningen]", "Öppet [09–17], redo från [16:00]", "teaser-paket-b.png")],
  chips: ["Hur långt är det från stugan till backen?", "Hur funkar skidskolan för barnen?"]
};

QA["Hur funkar skidskolan för barnen?"] = {
  answer: "Barn från [4 år] kan gå i [Grönklitts skidskola]. Första passet är [måndag 10:00] vid barnområdet, [två timmar] med paus för varm choklad. För era barn på 6 och 9 år passar [Blå grupp] respektive [Röd grupp] om de åkt förut.",
  sources: src(["#skidskola", "Skidskola"]),
  cards: [
    card("Aktivitet", "Skidskola för barn", "[Mån–fre 10–12], från [4] år", "teaser-skola-b.png"),
    card("Plats", "Barnområdet", "Samling vid [flaggan]", "platshallare.svg")
  ],
  chips: ["När stänger barnbacken?", "Vilka liftkort behöver vi?"]
};

QA["Hur långt är det från stugan till backen?"] = {
  answer: "[Grönklitt Stugby] ligger [ski in/ski out], ni har [cirka 100 m] till närmaste lift och längdspåren börjar [bakom stugbyn]. Bilen kan stå kvar hela veckan.",
  sources: src(["#boende", "Boende"]),
  cards: [card("Boende", "[Grönklitt Stugby]", "[100 m] till liften", "meny-boende.jpg")],
  chips: ["Var hämtar vi hyrskidorna?", "Hur tidigt kan vi checka in?"]
};

QA["Hur tidigt kan vi checka in?"] = {
  answer: "Stugan är klar från [15:00]. Kommer ni tidigare kan ni hämta nyckeln i [receptionen] från [12:00] och åka direkt, bagaget kan stå kvar där. Utcheckning är [11:00].",
  sources: src(["#bokning", "Din bokning"]),
  cards: [card("Plats", "[Receptionen]", "Öppet [08–20]", "teaser-boende-b.jpeg")],
  chips: ["Var hämtar vi hyrskidorna?", "Kan jag ändra min bokning?"]
};

QA["Vilka liftkort behöver vi?"] = {
  answer: "För er fyra passar [familjekortet för 6 dagar], fr. [1 290 kr per person]. Barn under [7 år] åker [gratis] med hjälm. Lägg till liftkorten i bokningen så ligger de i telefonen när ni kommer.",
  sources: src(["#liftkort", "Liftkort"]),
  cards: [card("Boka", "Liftkort för hela veckan", "fr. [1 290] kr", "og-hero-winter.jpg")],
  chips: ["Hur funkar skidskolan för barnen?", "Kan vi köpa spårkort på plats?"]
};

QA["Kan jag ändra min bokning?"] = {
  answer: "Ja, under [Min bokning] kan du ändra datum, lägga till liftkort eller skidhyra, eller avboka enligt [villkoren]. Ändringar fram till [14 dagar] före ankomst är [kostnadsfria].",
  sources: src(["#bokning", "Din bokning"]),
  cards: [],
  chips: ["Vilka liftkort behöver vi?", "Hur tidigt kan vi checka in?"]
};

QA["Vad finns att göra under vår vecka?"] = {
  answer: "Under er vecka finns [barnens skidskola måndag], [visning i Rovdjursparken onsdag 11:00] och [fackeltåg i barnbacken onsdag 18:00]. Längdspåren är tända varje kväll till [21].",
  sources: src(["#aktiviteter", "Veckoprogram"]),
  cards: [
    card("[Ons 17 feb] · 11:00", "[Visning i Rovdjursparken]", "Djurvårdarna berättar", "platshallare.svg"),
    card("[Ons 17 feb] · 18:00", "[Fackeltåg i barnbacken]", "Gratis, varm saft efteråt", "sprakande-nyar.jpg")
  ],
  chips: ["Vad händer för barn idag?", "Hur funkar skidskolan för barnen?"],
  summer: {
    answer: "Under er vecka finns [guidad tur i Rovdjursparken tisdag], [cykelskola för barn onsdag] och [musik vid Skattungen fredag]. Liften går upp till toppen varje dag [10–17].",
    sources: src(["#aktiviteter", "Veckoprogram"]),
    cards: [
      card("[Tis] · 10:00", "[Guidad tur i Rovdjursparken]", "Från [5] år", "platshallare.svg"),
      card("[Fre] · 19:00", "[Musik vid Skattungen]", "Ta med filt", "platshallare.svg")
    ],
    chips: ["Kan vi cykla i backen?", "Var kan vi bada idag?"]
  }
};

QA["Vilka backar passar barnen idag?"] = {
  answer: "[Familjebacken] och [Björnbacken] är nypreparerade och mjuka i morse. Sexåringen trivs i barnområdet, niåringen klarar [Björnbacken] hela vägen från toppen. Solen ligger på västsidan efter lunch.",
  sources: src(["#just-nu", "Just nu"]),
  cards: [
    card("Backe", "[Familjebacken]", "Grön, nypreparerad [05:30]", "platshallare.svg"),
    card("Backe", "[Björnbacken]", "Blå, från toppen", "og-hero-winter.jpg")
  ],
  chips: ["Var äter vi lunch i backen?", "När stänger barnbacken?"]
};

QA["Var äter vi lunch i backen?"] = {
  answer: "[Toppstugan] har [dagens lunch 11–14:30] och utsikt över Orsasjön. Vill ni sitta nere är [Grönklittsgården] närmast barnområdet. Egen matsäck går bra i [vindskyddet vid barnbacken].",
  sources: src(["#service", "Mat och service"]),
  cards: [
    card("Plats", "[Toppstugan]", "[11–14:30], utsikt över Orsasjön", "platshallare.svg"),
    card("Plats", "[Grönklittsgården]", "Vid barnområdet", "teaser-boende-b.jpeg")
  ],
  chips: ["Vad händer för barn idag?", "Vilka backar passar barnen idag?"]
};

QA["Vad händer för barn idag?"] = {
  answer: "[11:00] är det [björnjakt i barnbacken] med skattkarta, och [14:00] [pulkarace] vid stugbyn. Rovdjursparken har [matning av björnarna 13:00]. Allt utom parken är gratis.",
  sources: src(["#aktiviteter", "Veckoprogram"]),
  cards: [
    card("Idag · [11:00]", "[Björnjakt i barnbacken]", "Skattkarta i receptionen", "platshallare.svg"),
    card("Idag · [13:00]", "[Matning av björnarna]", "Orsa Rovdjurspark", "platshallare.svg")
  ],
  chips: ["Var hyr vi pulka?", "När stänger barnbacken?"]
};

QA["När stänger barnbacken?"] = {
  answer: "Barnområdet med knappliften och rullbandet är öppet [10–15] idag. Stora liftarna går till [16:00] och elljusspåret är tänt till [21].",
  sources: src(["#just-nu", "Öppet nu"]),
  cards: [card("Plats", "Barnområdet", "[10–15] idag", "teaser-skola-b.png")],
  chips: ["Vad händer för barn idag?", "Var äter vi lunch i backen?"]
};

QA["Var hyr vi pulka?"] = {
  answer: "Pulkor och snörejsare lånas [gratis] i [receptionen] mot [legitimation]. Pulkabacken ligger [bakom stugbyn], belyst till [20].",
  sources: src(["#aktiviteter", "För barn"]),
  cards: [card("Plats", "[Pulkabacken]", "Belyst till [20]", "snow.jpg")],
  chips: ["Vad händer för barn idag?"]
};

QA["Vilka spår är nypreparerade?"] = {
  answer: "[62 km] preparerades i natt: [barnslingan], [5 km-slingan] och [Fryksåsturen]. Skatespåret på [Grönklittsrundan] kördes [04:30]. Elljusspåret är tänt till [21].",
  sources: src(["#just-nu", "Spårkarta"]),
  cards: [
    card("Spår", "[Barnslingan]", "[2,5 km], preparerad [04:30]", "langd.jpg"),
    card("Spår", "[Fryksåsturen]", "[25 km], preparerad [05:00]", "og-hero-winter.jpg")
  ],
  chips: ["Vilken valla ska vi ha idag?", "Var kan vi fika vid spåret?"]
};

QA["Vilken valla ska vi ha idag?"] = {
  answer: "Ny och finkornig snö och runt [−6°] i spåret. [Violett fästvalla] och [violett glid] fungerar hela förmiddagen, efter lunch kan det bli mjukare i solen.",
  sources: src(["#just-nu", "Dagens vallatips"]),
  cards: [card("Tips", "Dagens vallatips", "[Violett], uppdaterat [21:20]", "langd.jpg")],
  chips: ["Var hyr vi längdskidor?", "Vilka spår är nypreparerade?"]
};
QA["Det är minus 6 grader. Vilken valla ska jag ha?"] = QA["Vilken valla ska vi ha idag?"];

QA["Var kan vi fika vid spåret?"] = {
  answer: "[Fiket vid spårstarten] har kaffe och bullar [10–15]. Ute i spåret finns [rastkojan vid 5 km] med eldstad, ta med egen termos dit.",
  sources: src(["#service", "Mat och service"]),
  cards: [
    card("Plats", "[Fiket vid spårstarten]", "[10–15], kort och Swish", "platshallare.svg"),
    card("Plats", "[Rastkojan]", "Eldstad vid [5 km]", "langd.jpg")
  ],
  chips: ["Vilka spår är nypreparerade?"]
};

QA["Var hyr vi längdskidor?"] = {
  answer: "I [skiduthyrningen vid spårstarten]. Klassiskt och skate, även barnstorlekar från [100 cm]. Hyr i förväg i bokningen så är paketet klart när ni kommer.",
  sources: src(["#skidhyra", "Skidhyra"]),
  cards: [card("Plats", "[Skiduthyrningen]", "Öppet [09–16]", "teaser-paket-b.png")],
  chips: ["Vilket spår passar barnen första dagen?", "Kan vi köpa spårkort på plats?"]
};

QA["Vilket spår passar barnen första dagen?"] = {
  answer: "[Barnslingan] på [2,5 km], flack och upplyst, med [bamseskylt] var halvkilometer. Orkar de mer kan ni fortsätta på [5 km-slingan], som går tillbaka till starten.",
  sources: src(["#just-nu", "Spårkarta"]),
  cards: [card("Spår", "[Barnslingan]", "[2,5 km], flackt", "langd.jpg")],
  chips: ["Var kan vi fika vid spåret?", "Var hyr vi längdskidor?"]
};

QA["Kan vi köpa spårkort på plats?"] = {
  answer: "Ja, i receptionen eller i appen. [Veckokort fr. 395 kr], barn under [16] åker [gratis]. Köper ni i bokningen ligger kortet i telefonen redan vid ankomst.",
  sources: src(["#liftkort", "Spårkort"]),
  cards: [card("Boka", "Spårkort för hela veckan", "fr. [395] kr", "langd.jpg")],
  chips: ["Var hyr vi längdskidor?"]
};

/* Sommar */
QA["Vad gör vi med barnen idag?"] = {
  answer: "Börja i Rovdjursparken när den öppnar [10:00], björnarna är piggast då. Efter lunch: liften upp till toppen och [trollstigen] ner, [1,5 km]. Avsluta med bad i [Skattungen], vattnet är [19°].",
  sources: src(["#aktiviteter", "För barn"]),
  cards: [
    card("Aktivitet", "Orsa Rovdjurspark", "[10–17] idag", "platshallare.svg"),
    card("Led", "[Trollstigen]", "[1,5 km] ner från toppen", "platshallare.svg"),
    card("Bad", "[Skattungen]", "Vattnet [19°]", "platshallare.svg")
  ],
  chips: ["Är Rovdjursparken öppen idag?", "Var kan vi bada idag?"]
};

QA["Är Rovdjursparken öppen idag?"] = {
  answer: "Ja, [10–17] idag. [Matning av björnarna 13:00] och [guidad tur 11:00]. Entrén köper ni i receptionen eller i bokningen, barn under [3 år] går in gratis.",
  sources: src(["#aktiviteter", "Orsa Rovdjurspark"]),
  cards: [card("Aktivitet", "Orsa Rovdjurspark", "[10–17], björn, varg, lodjur, järv", "platshallare.svg")],
  chips: ["Vad gör vi med barnen idag?"]
};

QA["Var kan vi bada idag?"] = {
  answer: "[Skattungen] är [19°] och har grund sandstrand, [15 minuter] med bil. Närmast är [tjärnen vid stugbyn], lite kallare men med brygga. Regnet kommer inte förrän efter [16].",
  sources: src(["#aktiviteter", "Bad"]),
  cards: [
    card("Bad", "[Skattungen]", "[19°], sandstrand", "platshallare.svg"),
    card("Bad", "[Tjärnen vid stugbyn]", "Brygga, [5 min] promenad", "platshallare.svg")
  ],
  chips: ["Vad gör vi med barnen idag?", "Vad gör vi om det regnar?"]
};

QA["Kan vi cykla i backen?"] = {
  answer: "Ja, [Grönklitt Bike Park] har [8 leder] och liften tar cyklar [10–17]. För barnen finns [en grön flowled] och cykelskola [onsdagar]. Cykel och hjälm hyr ni vid liften.",
  sources: src(["#aktiviteter", "Cykel"]),
  cards: [card("Aktivitet", "[Grönklitt Bike Park]", "[8 leder], liften [10–17]", "platshallare.svg")],
  chips: ["Vilken led passar barnen?"]
};

QA["Vilken led passar barnen?"] = {
  answer: "[Trollstigen] från toppen, [1,5 km] med utsiktsplats över Orsasjön halvvägs. Ta liften upp så går det bara nedför. Lederna är torra idag.",
  sources: src(["#aktiviteter", "Leder"]),
  cards: [card("Led", "[Trollstigen]", "[1,5 km], utsikt över Orsasjön", "platshallare.svg")],
  chips: ["Kan vi cykla i backen?", "Var kan vi bada idag?"]
};
QA["Är lederna blöta idag?"] = QA["Vilken led passar barnen?"];

QA["Behöver vi myggmedel?"] = {
  answer: "I skogen och vid tjärnarna, ja, särskilt kvällar i [juli]. På toppen blåser det oftast bort. [Receptionen] säljer myggmedel.",
  sources: src(["#service", "Mat och service"]),
  cards: [],
  chips: ["Vilken led passar barnen?"]
};

/* Startvyn (ingen fråga ställd), fyra varianter: vinter ny/återkommande, påbörjad bokning, på plats, sommar. */
export const WELCOME_TILES = {
  winter: [
    { title: "Längdspår", number: "142", unit: "km", caption: "preparerade" },
    { title: "Liftar", number: "6", slash: "7", caption: "i drift" },
    { title: "Snödjup", number: "78", unit: "cm", caption: "på toppen" }
  ],
  summer: [
    { title: "Lederna", number: "11", slash: "14", caption: "öppna" },
    { title: "Rovdjursparken", number: "10–17", degree: true, caption: "öppen idag" },
    { title: "Temperatur", number: "17°", degree: true, caption: "i Orsa" }
  ]
};

export const WELCOME = {
  general: {
    title: "Vad undrar du?",
    lead: "Orsaguiden svarar med det vi vet om spår, backar, aktiviteter och boende i Orsa Grönklitt. Personalen tar över när det behövs.",
    nowLabel: "Läget i Orsa Grönklitt just nu",
    tiles: "winter",
    label: "Andra brukar fråga"
  },
  summer: {
    title: "Vad undrar du?",
    lead: "Orsaguiden svarar med det vi vet om leder, bad, Rovdjursparken och boende i Orsa Grönklitt. Personalen tar över när det behövs.",
    nowLabel: "Läget i Orsa Grönklitt just nu",
    tiles: "summer",
    label: "Andra brukar fråga"
  },
  booking: {
    title: "Hej [Anna]! Vad undrar ni inför resan?",
    lead: "Svaren utgår från er bokning, så fråga gärna om stugan, vad ni behöver ha med eller vad barnen kan hitta på.",
    booking: true,
    label: "Om er resa"
  },
  onsite: {
    title: "Hej [Anna], vad vill ni hitta på idag?",
    lead: "Ni är på plats, så svaren utgår från dagens läge och att ni är fyra med barn på 6 och 9 år.",
    events: true,
    nowLabel: "Läget i Orsa Grönklitt just nu",
    tiles: "winter",
    label: "Bra att veta idag"
  }
};

export const WELCOME_BOOKING = {
  title: "[Grönklitt Stugby]",
  line: "[15–22 feb 2027] · 2 vuxna, 2 barn · Incheckning från 15:00",
  next: "<strong>Nästa steg: liftkort.</strong> Lägg till dem i bokningen så har ni dem i telefonen när ni kommer.",
  nextAsk: "Vilka liftkort behöver vi?",
  week: [
    { kicker: "[Ons 17 feb] · 11:00", title: "[Visning i Rovdjursparken]", line: "Djurvårdarna berättar", image: IMG + "platshallare.svg", ask: "Vad finns att göra under vår vecka?" },
    { kicker: "[Ons 17 feb] · 18:00", title: "[Fackeltåg i barnbacken]", line: "Gratis, varm saft efteråt", image: IMG + "sprakande-nyar.jpg", ask: "Vad finns att göra under vår vecka?" }
  ]
};

export const WELCOME_TODAY = [
  { kicker: "Idag · [11:00]", title: "[Björnjakt i barnbacken]", line: "Skattkarta i receptionen", image: IMG + "platshallare.svg", ask: "Vad händer för barn idag?" },
  { kicker: "Idag · [13:00]", title: "[Matning av björnarna]", line: "Orsa Rovdjurspark", image: IMG + "platshallare.svg", ask: "Vad händer för barn idag?" }
];
