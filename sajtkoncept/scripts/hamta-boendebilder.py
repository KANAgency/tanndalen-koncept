#!/usr/bin/env python3
"""Hämtar alla bilder och fakta för utvalda boenden ur R360 (hamra.r360online.se).

Ingen webbläsare, inga AI-anrop: skriptet frågar R360:s publika sök-API
(samma som bokningssidan använder) för ett antal ankomstveckor, plockar ut
de namngivna boendena och laddar ner originalbilderna (_org.jpg).

Körning (från sajtkoncept/):
    python3 scripts/hamta-boendebilder.py
    python3 scripts/hamta-boendebilder.py --ut ../../assets/boenden --veckor 20
    python3 scripts/hamta-boendebilder.py --omrade 33295   # alla boenden i Fjällöga

Utdata per boende: <ut>/<slug>/NN-<hash>.jpg + fakta.json (beskrivning,
kriterier, alt-texter, pris för första lediga vecka).
Boenden som inte finns i R360 (t.ex. privata som Fjällsippan 4) rapporteras
som "hittades inte" – de bilderna kommer från kunden.
"""
import argparse
import datetime as dt
import json
import pathlib
import re
import sys
import time
import urllib.request

API = "https://hamra.r360online.se/sv/v3/api"
RESVTYPE = 1007  # Boende

# (namn i R360 – början på unitdesc4, grouppoollid). Lägg till/ta bort här.
# grouppoollid står i R360-URL:en: /client/product/boende-1007/<område>-<grouppoollid>
BOENDEN = [
    ("Fjällsippan 4", None),  # privat, finns inte i R360 – bilder från kund
    ("Ski Lodge Premium 203", 37332),
    ("Skarljus 7 A", 37147),
    ("Brunkullan 23", 19148),
    ("Fjällstugan Järven", 31379),
]


def get_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": "td-sajtkoncept/1.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


def slug(s):
    s = s.lower().translate(str.maketrans("åäöé", "aaoe"))
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def lordagar(n):
    d = dt.date.today()
    d += dt.timedelta(days=(5 - d.weekday()) % 7 or 7)
    for i in range(n):
        yield d + dt.timedelta(weeks=i)


def main():
    ap = argparse.ArgumentParser()
    here = pathlib.Path(__file__).resolve()
    ap.add_argument("--ut", default=str(here.parents[3] / "assets" / "boenden"))
    ap.add_argument("--veckor", type=int, default=52, help="antal lördagar att söka i")
    ap.add_argument("--omrade", type=int, help="grouppoollid: hämta ALLA boenden i området i stället för listan")
    a = ap.parse_args()
    ut = pathlib.Path(a.ut)
    kriterier = {k: v["title"] for k, v in get_json(f"{API}/criterias")["payload"].items()}

    # Sök-API:t visar bara lediga boenden, så vi provar en vecka i taget
    # per område tills boendet dyker upp.
    hittade = {}
    if a.omrade:
        enheter = {}
        for start in lordagar(a.veckor):
            slut = start + dt.timedelta(days=7)
            url = (f"{API}/search?resvtype={RESVTYPE}&grouppoollid={a.omrade}"
                   f"&startdate={start}&enddate={slut}&guests=2")
            try:
                groups = get_json(url)["payload"]["groups"]
            except Exception:  # noqa: BLE001
                continue
            groups = groups.values() if isinstance(groups, dict) else groups
            for g in groups:
                for it in g["items"]:
                    enheter.setdefault(it["unitlid"], it)
            time.sleep(0.3)
        for it in enheter.values():
            spara(it, it["unitdesc4"], ut / slug(it["groupTitle"]) / slug(it["unitdesc4"]), kriterier)
        print(f"{len(enheter)} boenden i området")
    for namn, grupp in ([] if a.omrade else BOENDEN):
        if grupp is None:
            continue
        for start in lordagar(a.veckor):
            slut = start + dt.timedelta(days=7)
            url = (f"{API}/search?resvtype={RESVTYPE}&grouppoollid={grupp}"
                   f"&startdate={start}&enddate={slut}&guests=2")
            try:
                groups = get_json(url)["payload"]["groups"]
            except Exception:  # noqa: BLE001 – vecka utan bokningsbar period
                continue
            groups = groups.values() if isinstance(groups, dict) else groups
            traff = [it for g in groups for it in g["items"]
                     if (it.get("unitdesc4") or "").startswith(namn)]
            time.sleep(0.3)
            if traff:
                hittade[namn] = traff[0]
                print(f"hittade {traff[0]['unitdesc4']} ({start})")
                break

    if a.omrade:
        return
    for namn, _ in BOENDEN:
        it = hittade.get(namn)
        if not it:
            print(f"hittades inte: {namn}")
            continue
        spara(it, namn, ut / slug(namn), kriterier)


def spara(it, namn, mapp, kriterier):
    mapp.mkdir(parents=True, exist_ok=True)
    bilder = list(it.get("images") or [])
    if it.get("image") and it["image"].get("hash") not in {b["hash"] for b in bilder}:
        bilder.insert(0, it["image"])
    bilder.sort(key=lambda b: int(b.get("sortIndex") or 0))
    meta = []
    for i, b in enumerate(bilder, 1):
        fil = mapp / f"{i:02d}-{b['hash'][:8]}.jpg"
        if not fil.exists():
            urllib.request.urlretrieve(b["url"], fil)
        meta.append({"fil": fil.name, "alt": b["translations"].get("sv", {}).get("accessibility")})
    fakta = {
        "namn": namn,
        "omrade": it.get("groupTitle"),
        "url": f"https://hamra.r360online.se/client/product/boende-{RESVTYPE}/{slug(it.get('groupTitle',''))}-{it.get('grouppoollid')}/{it.get('poollid')}/{slug(namn)}-{it.get('unitlid')}",
        "vecka": [it.get("arrdate"), it.get("depdate")],
        "pris_vecka_kr": it.get("aprice"),
        "kriterier": {kriterier.get(k, k): v for k, v in it.get("crits", {}).items() if v not in (False, None)},
        "beskrivning": it.get("weblong"),
        "bilder": meta,
    }
    (mapp / "fakta.json").write_text(json.dumps(fakta, ensure_ascii=False, indent=2))
    print(f"{namn}: {len(meta)} bilder → {mapp}")

if __name__ == "__main__":
    main()
