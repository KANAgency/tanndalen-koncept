/* OG-only mode content. Not shared. Allt i [hakparentes] är påhittat och ska bytas mot riktigt innehåll. */

export const BOOKING_CALENDAR = {
  range: "[15–22 feb] · 2027",
  groups: [
    {
      date: "2027-02-15",
      rows: [
        { time: "15:00", title: "Checka in i [Grönklitt Stugby]" },
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
        { time: "11:00", title: "[Visning i Orsa Rovdjurspark]" },
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

export function modes() {
  return { new: {}, returning: {}, booking: { calendar: BOOKING_CALENDAR }, onsite: {} };
}
