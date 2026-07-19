// @ts-check
/**
 * <quoting-clock> — a literary clock.
 *
 * Rounds the current time to the nearest quarter-hour and shows the matching
 * quote from quotes.json, which lives beside this module (loaded as a module,
 * so the data URL resolves regardless of page depth). The element's static
 * children are the no-JS fallback; the first successful render replaces
 * them, and any failure leaves them untouched. Updates are scheduled with a
 * single timeout aimed at the next quarter-hour boundary — no polling.
 */

const MINUTES_PER_DAY = 24 * 60;
const QUARTER_MS = 15 * 60 * 1000;

/** @typedef {{ quote: string, title: string, author: string }} QuoteEntry */

/** Twelve-hour clock words; index 0 is twelve. */
const HOUR_WORDS = [
  "twelve", "one", "two", "three", "four", "five",
  "six", "seven", "eight", "nine", "ten", "eleven",
];

/**
 * Minutes since local midnight, rounded to the nearest quarter-hour.
 * @param {Date} now
 * @returns {number} a multiple of 15 in 0–1425; 23:53 wraps to 0
 */
function nearestQuarter(now) {
  const minutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  return (Math.round(minutes / 15) * 15) % MINUTES_PER_DAY;
}

/**
 * "HH:MM" form of a slot, matching the quotes.json keys.
 * @param {number} slot minutes since midnight
 */
function slotKey(slot) {
  const h = String(Math.floor(slot / 60)).padStart(2, "0");
  const m = String(slot % 60).padStart(2, "0");
  return `${h}:${m}`;
}

/**
 * Spoken label for a slot: "noon", "three o’clock", "a quarter past seven",
 * "half past eleven", "a quarter to midnight" …
 * @param {number} slot minutes since midnight
 */
function slotLabel(slot) {
  const minute = slot % 60;
  // "a quarter to four" names the upcoming hour
  const hour = (Math.floor(slot / 60) + (minute === 45 ? 1 : 0)) % 24;
  const name = hour === 0 ? "midnight" : hour === 12 ? "noon" : HOUR_WORDS[hour % 12];
  switch (minute) {
    case 0:
      return hour === 0 || hour === 12 ? name : `${name} o’clock`;
    case 15:
      return `a quarter past ${name}`;
    case 30:
      return `half past ${name}`;
    default:
      return `a quarter to ${name}`;
  }
}

/**
 * The populated slot nearest to `slot`, measured around the 24-hour dial
 * (a tie goes to the slot listed first in the data).
 * @param {number} slot minutes since midnight
 * @param {Map<number, QuoteEntry>} slots
 * @returns {number | undefined}
 */
function nearestPopulated(slot, slots) {
  let best;
  let bestDistance = Infinity;
  for (const candidate of slots.keys()) {
    const straight = Math.abs(candidate - slot);
    const distance = Math.min(straight, MINUTES_PER_DAY - straight);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = candidate;
    }
  }
  return best;
}

class QuotingClock extends HTMLElement {
  /** @type {Map<number, QuoteEntry> | null} */
  #slots = null;

  /** @type {ReturnType<typeof setTimeout> | undefined} */
  #timer;

  /** Background tabs throttle timers; re-sync when the page returns. */
  #onVisible = () => {
    if (document.visibilityState === "visible") this.#tick();
  };

  async connectedCallback() {
    /** @type {Map<number, QuoteEntry>} */
    const slots = new Map();
    try {
      const response = await fetch(new URL("quotes.json", import.meta.url));
      if (!response.ok) return;
      /** @type {{ slots?: Record<string, QuoteEntry> }} */
      const data = await response.json();
      for (const [key, entry] of Object.entries(data.slots ?? {})) {
        const [h = NaN, m = NaN] = key.split(":").map(Number);
        const minutes = h * 60 + m;
        if (Number.isFinite(minutes)) slots.set(minutes, entry);
      }
    } catch {
      return; // fetch or parse failed: the static fallback stands
    }
    if (slots.size === 0 || !this.isConnected) return;
    this.#slots = slots;
    document.addEventListener("visibilitychange", this.#onVisible);
    this.#tick();
  }

  disconnectedCallback() {
    clearTimeout(this.#timer);
    document.removeEventListener("visibilitychange", this.#onVisible);
  }

  /** Render now, then aim one timeout at the next quarter-hour boundary. */
  #tick() {
    this.#render(new Date());
    clearTimeout(this.#timer);
    // Quarter-hour boundaries align with the epoch in every real time zone
    // (all UTC offsets are multiples of 15 minutes), so local boundaries can
    // be derived from Date.now() directly. Rounding to the *nearest* quarter
    // also makes a timer that fires marginally early self-correcting.
    this.#timer = setTimeout(() => this.#tick(), QUARTER_MS - (Date.now() % QUARTER_MS));
  }

  /**
   * Build the quote display and swap it in atomically. The .clock-swap
   * wrapper is fresh each render, restarting the fade-in that the stylesheet
   * gates behind prefers-reduced-motion.
   * @param {Date} now
   */
  #render(now) {
    if (!this.#slots) return;
    const slot = nearestQuarter(now);
    const populated = this.#slots.has(slot) ? slot : nearestPopulated(slot, this.#slots);
    const entry = populated === undefined ? undefined : this.#slots.get(populated);
    if (!entry) return;

    const swap = document.createElement("div");
    swap.className = "clock-swap";

    const timeLine = document.createElement("p");
    timeLine.className = "clock-time";
    const time = document.createElement("time");
    time.dateTime = slotKey(slot);
    time.textContent = slotLabel(slot);
    timeLine.append(time);

    const figure = document.createElement("figure");
    const quote = document.createElement("blockquote");
    quote.textContent = `“${entry.quote}”`;
    const caption = document.createElement("figcaption");
    const cite = document.createElement("cite");
    cite.textContent = entry.title;
    caption.append(`— ${entry.author}, `, cite);
    figure.append(quote, caption);

    swap.append(timeLine, figure);
    this.replaceChildren(swap);
  }
}

customElements.define("quoting-clock", QuotingClock);
