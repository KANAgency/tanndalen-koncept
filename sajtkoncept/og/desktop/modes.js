/* OG view modes — wires site config + content into the shared engine. */
import {
  onsiteStorageKey,
  stayStorageKey,
  wifiOnsiteSignal,
  MODES_UI
} from "./site-config.js";
import * as stayApi from "./demo-stay.js";
import { BOOKING_CALENDAR, modes } from "./modes-content.js";
import { createModesEngine } from "/shared/js/modes-engine.js";

export { modes };

const engine = createModesEngine({
  onsiteStorageKey,
  stayStorageKey,
  wifiOnsiteSignal,
  stayApi,
  bookingCalendar: BOOKING_CALENDAR,
  ui: MODES_UI
});

export const init = engine.init;
export const isOnsiteActive = engine.isOnsiteActive;
export const setOnsite = engine.setOnsite;
