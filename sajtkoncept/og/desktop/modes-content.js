/* OG mode content — structure copied from TD; calendar copy is placeholder. */

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
      rows: [{ time: "11:00", title: "Pond skim i Hamra" }]
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
      rows: [{ time: "10:00", title: "Utcheckning" }]
    }
  ]
};

export function modes() {
  return { new: {}, returning: {}, booking: { calendar: BOOKING_CALENDAR }, onsite: {} };
}
