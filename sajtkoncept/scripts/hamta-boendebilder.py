#!/usr/bin/env python3
"""Hämtar alla bilder och fakta för boenden ur R360 (TD: hamra, OG: orsagronklitt).

Ingen webbläsare, inga AI-anrop. Ett anrop mot R360:s publika katalogsökning
(samma som bokningssidans områdessidor använder, checkavail=false) ger alla
boenden oavsett om de är lediga, inklusive bilder och beskrivning.
Därefter laddas originalbilderna (_org.jpg) ner.

Körning (från sajtkoncept/):
    python3 scripts/hamta-boendebilder.py                  # listan BOENDEN nedan
    python3 scripts/hamta-boendebilder.py --omrade 33295   # alla boenden i ett område
    python3 scripts/hamta-boendebilder.py --ut ../../assets/boenden
    python3 scripts/hamta-boendebilder.py --sajt og --ut ../../assets/boenden/orsa   # listan BOENDEN_OG

Områdets nummer (grouppoollid) står i R360-adressen:
    /client/product/boende-1007/<område>-<grouppoollid>

Utdata per boende: <ut>/<område>/<boende>/NN-<hash>.jpg + fakta.json
(beskrivning, kriterier, alt-texter, länk). Katalogen har inga priser.
Boenden som inte finns i R360 (t.ex. privata som Fjällsippan 4) rapporteras
som "hittades inte" – de bilderna kommer från kund.
"""
import argparse
import datetime as dt
import json
import pathlib
import re
import sys
import urllib.request

# R360-värd och bokningstyp för boende per sajt (OG: 1000, TD: 1007).
SAJTER = {
    "td": ("https://hamra.r360online.se", 1007),
    "og": ("https://orsagronklitt.r360online.se", 1000),
}
HOST, RESVTYPE = SAJTER["td"]
API = f"{HOST}/sv/v3/api"

# Början på boendets namn i R360 (unitdesc4). Lägg till/ta bort här.
BOENDEN = [
    "Fjällsippan 4",  # privat, finns inte i R360
    "Ski Lodge Premium 203",
    "Skarljus 7 A",
    "Brunkullan 23",
    "Fjällstugan Järven",
]

# OG: 8 boenden i olika stil, valda på bild och inredning (nov 2026).
BOENDEN_OG = [
    "Limbygården",            # gård/lodge, stenspis, grön panel
    "Lönnstigen 6",           # Skogsbyn, nybyggt, stora fönster, blå köksö
    "Aspstigen 2B",           # Skogsbyn, skandinaviskt stylat, braskamin, tapet
    "Rönnbärsstigen 1",       # Blåbärsbyn, timmerstuga i snö
    "Norra Stugvägen 10",     # Centrumbyn, klassisk furustuga, kvällsbild
    "Illerstigen 4B",         # Toppbyn, liten rustik stuga, vintage
    "Hallonstigen 9B",        # Blåbärsbyn, varm retro, rutig tapet
    "Uttern 7",               # Rovdjursbyn, röd stuga, mörk och mysig
]


def get_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": "td-sajtkoncept/1.0"})
    with urllib.request.urlopen(req, timeout=180) as r:
        return json.load(r)


def slug(s):
    s = s.lower().translate(str.maketrans("åäöé", "aaoe"))
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def katalog():
    start = dt.date.today()
    slut = start + dt.timedelta(days=365)
    url = (f"{API}/search?resvtype={RESVTYPE}&startdate={start}&enddate={slut}"
           f"&filterOnDays=true&checkprice=false&checkavail=false")
    groups = get_json(url)["payload"]["groups"]
    groups = groups.values() if isinstance(groups, dict) else groups
    return [it for g in groups for it in g["items"]]


def spara(it, mapp, kriterier):
    namn = it["unitdesc4"]
    mapp.mkdir(parents=True, exist_ok=True)
    bilder = list(it.get("images") or [])
    if it.get("image") and it["image"].get("hash") not in {b["hash"] for b in bilder}:
        bilder.insert(0, it["image"])
    bilder.sort(key=lambda b: int(b.get("sortIndex") or 0))
    meta = []
    for i, b in enumerate(bilder, 1):
        fil = mapp / f"{i:02d}-{b['hash'][:8]}.jpg"
        if not fil.exists():
            try:
                urllib.request.urlretrieve(b["url"], fil)
            except Exception as e:  # noqa: BLE001 – enstaka bild saknas i R360
                print(f"  saknas: {b['url']} ({e})", file=sys.stderr)
                continue
        meta.append({"fil": fil.name, "alt": (b.get("translations") or {}).get("sv", {}).get("accessibility")})
    fakta = {
        "namn": namn,
        "omrade": it.get("groupTitle"),
        "url": (f"{HOST}/client/product/boende-{RESVTYPE}/"
                f"{slug(it.get('groupTitle', ''))}-{it.get('grouppoollid')}/{it.get('poollid')}/"
                f"{slug(namn)}-{it.get('unitlid')}"),
        "kriterier": {kriterier.get(k, k): v for k, v in (it.get("crits") or {}).items() if v not in (False, None)},
        "beskrivning": it.get("weblong"),
        "bilder": meta,
    }
    (mapp / "fakta.json").write_text(json.dumps(fakta, ensure_ascii=False, indent=2))
    print(f"{namn}: {len(meta)} bilder → {mapp}")


def main():
    ap = argparse.ArgumentParser()
    here = pathlib.Path(__file__).resolve()
    ap.add_argument("--ut", default=str(here.parents[3] / "assets" / "boenden"))
    ap.add_argument("--sajt", choices=SAJTER, default="td")
    ap.add_argument("--omrade", type=int, help="grouppoollid: hämta alla boenden i området")
    a = ap.parse_args()
    global HOST, RESVTYPE, API
    HOST, RESVTYPE = SAJTER[a.sajt]
    API = f"{HOST}/sv/v3/api"
    ut = pathlib.Path(a.ut)
    kriterier = {k: v["title"] for k, v in get_json(f"{API}/criterias")["payload"].items()}
    alla = katalog()
    print(f"{len(alla)} boenden i R360-katalogen")

    if a.omrade:
        valda = [it for it in alla if it.get("grouppoollid") == a.omrade]
    else:
        valda = []
        for namn in (BOENDEN_OG if a.sajt == "og" else BOENDEN):
            exakt = [it for it in alla if (it.get("unitdesc4") or "") == namn]
            traff = exakt or [it for it in alla if (it.get("unitdesc4") or "").startswith(namn)]
            if traff:
                valda.append(traff[0])
            else:
                print(f"hittades inte: {namn}")

    for it in valda:
        spara(it, ut / slug(it["groupTitle"]) / slug(it["unitdesc4"]), kriterier)


if __name__ == "__main__":
    main()
