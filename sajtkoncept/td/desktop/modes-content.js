/* TD-only mode content. Not shared. Tip copy lives in site-config (MODES_UI.tip). */

export const BOOKING_CALENDAR = {
  range: "12–19 feb · 2027",
  groups: [
    {
      date: "2027-02-12",
      rows: [
        { time: "12:00", title: "Checka in på Ski Lodge Premium" },
        { time: "14:00", title: "Utrustning redo", link: "Se var" }
      ]
    },
    {
      date: "2027-02-13",
      rows: [
        { time: "11:00", title: "Pond skim i Hamra" }
      ]
    },
    {
      date: "2027-02-14",
      rows: [
        { time: "10:00", title: "Hundspann från Hamra" },
        { time: "19:00", title: "Fondue i Fjällkåtan" }
      ]
    },
    {
      date: "2027-02-19",
      rows: [
        { time: "10:00", title: "Utcheckning" }
      ]
    }
  ]
};

/* Läge 4 (på plats): dagens program för familjen. Har boende, liftkort, alpin- och längdutrustning. Tider och platser i [ ] är platshållare. */
export const ONSITE_CALENDAR = {
  range: "Er dag · mån 15 feb",
  groups: [
    {
      label: "I dag",
      rows: [
        { time: "09:30", title: "Skidskola för barnen, [Hamra]" },
        { time: "12:00", title: "Våfflor i Toppstugan" },
        { time: "14:00", title: "Längd: [Fjällbjörksslingan]", link: "Skidorna" },
        { time: "19:00", title: "Fondue i Fjällkåtan" }
      ]
    },
    {
      label: "I morgon",
      rows: [
        { time: "09:00", title: "Första åket i nypreparerat" },
        { time: "10:00", title: "Hundspann från Hamra" },
        { time: "18:00", title: "Familjetur i belysta spåret" }
      ]
    }
  ]
};

export function modes() {
  return { new: {}, returning: {}, booking: { calendar: BOOKING_CALENDAR }, onsite: { calendar: ONSITE_CALENDAR } };
}
