/* OG-only mode content. Not shared. Allt i [hakparentes] är påhittat och ska bytas mot riktigt innehåll. */

export const BOOKING_CALENDAR = {
  range: "[15–22 feb] · 2027",
  groups: [
    {
      date: "2027-02-15",
      rows: [
        { time: "16:00", title: "Checka in i [Grönklitt Stugby]" },
        { time: "16:00", title: "Hyrskidor redo", link: "Se var" }
      ]
    },
    {
      date: "2027-02-16",
      rows: [
        { time: "10:00", title: "[Barnens skidskola, första passet]" }
      ]
    },
    {
      date: "2027-02-17",
      rows: [
        { time: "11:00", title: "[Bärra i barnbacken]" },
        { time: "18:00", title: "[Fackeltåg i barnbacken]" }
      ]
    },
    {
      date: "2027-02-22",
      rows: [
        { time: "11:00", title: "Utcheckning" }
      ]
    }
  ]
};

/* Läge 4 (på plats): dagens program för familjen, som TD:s ONSITE_CALENDAR (16 nov). Allt i [ ] är påhittat. */
export const ONSITE_CALENDAR = {
  range: "Er dag · [tis 16 feb]",
  groups: [
    {
      label: "I dag",
      rows: [
        { time: "09:30", title: "[Barnens skidskola i barnbacken]" },
        { time: "12:00", title: "[Lunch på Grönklittsgården]" },
        { time: "14:00", title: "Längd: Elljusspåret, 4,2 km", link: "Skidorna" },
        { time: "18:00", title: "[Fackeltåg i barnbacken]" }
      ]
    },
    {
      label: "I morgon",
      rows: [
        { time: "09:00", title: "Första åket i nypreparerat" },
        { time: "11:00", title: "[Bärra i barnbacken]" },
        { time: "18:00", title: "[Familjetur i belysta spåret]" }
      ]
    }
  ]
};

export function modes() {
  return { new: {}, returning: {}, booking: { calendar: BOOKING_CALENDAR }, onsite: { calendar: ONSITE_CALENDAR } };
}
