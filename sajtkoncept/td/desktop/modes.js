/* TD view modes — wires site config + content into the shared engine. */
import {
  onsiteStorageKey,
  stayStorageKey,
  wifiOnsiteSignal,
  MODES_UI
} from "./site-config.js";
import * as stayApi from "./demo-stay.js";
import { BOOKING_CALENDAR, ONSITE_CALENDAR, modes } from "./modes-content.js?v=checkin15";
import { createModesEngine } from "/shared/js/modes-engine.js?v=fit7";

export { modes };

const engine = createModesEngine({
  onsiteStorageKey,
  stayStorageKey,
  wifiOnsiteSignal,
  stayApi,
  bookingCalendar: BOOKING_CALENDAR,
  onsiteCalendar: ONSITE_CALENDAR,
  calendarAllGren: true,
  ui: MODES_UI
});

export const init = engine.init;
export const isOnsiteActive = engine.isOnsiteActive;
export const setOnsite = engine.setOnsite;
