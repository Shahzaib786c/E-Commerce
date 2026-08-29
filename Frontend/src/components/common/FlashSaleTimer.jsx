import React, { useState, useEffect } from "react";
import "./FlashSaleTimer.css";

// Countdown target: rolls forward to the next midnight + 8h whenever it expires,
// so the timer always shows a live, ticking countdown without ever going stale.
function getNextDeadline() {
  const now = new Date();
  const deadline = new Date(now);
  deadline.setHours(24, 0, 0, 0); // next midnight
  deadline.setHours(deadline.getHours() + 8); // sale actually ends 8am the day after
  return deadline;
}

function getTimeParts(deadline) {
  const diff = Math.max(0, deadline.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function FlashSaleTimer({ compact = false }) {
  const [deadline, setDeadline] = useState(getNextDeadline);
  const [time, setTime] = useState(() => getTimeParts(deadline));

  useEffect(() => {
    const tick = setInterval(() => {
      setTime((prev) => {
        const next = getTimeParts(deadline);
        if (next.hours === 0 && next.minutes === 0 && next.seconds === 0) {
          setDeadline(getNextDeadline());
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [deadline]);

  if (compact) {
    return (
      <div className="sale-timer sale-timer--compact">
        <span className="sale-timer__label">
          🧸 Bear Hug Sale — 20% off ends in
        </span>
        <div className="sale-timer__clock">
          <span>{pad(time.hours)}</span>:<span>{pad(time.minutes)}</span>:
          <span>{pad(time.seconds)}</span>
        </div>
      </div>
    );
  }

  return (
    <section className="sale-timer">
      <div className="container sale-timer__inner">
        <div className="sale-timer__copy">
          <span className="eyebrow eyebrow--light">Limited time</span>
          <h2>The Bear Hug Sale — 20% off everything</h2>
          <p>
            Ends the moment this clock hits zero. New bears restock at full
            price after that.
          </p>
        </div>
        <div className="sale-timer__clock sale-timer__clock--large">
          <div className="sale-timer__unit">
            <span className="sale-timer__number">{pad(time.hours)}</span>
            <span className="sale-timer__unit-label">Hours</span>
          </div>
          <span className="sale-timer__colon">:</span>
          <div className="sale-timer__unit">
            <span className="sale-timer__number">{pad(time.minutes)}</span>
            <span className="sale-timer__unit-label">Minutes</span>
          </div>
          <span className="sale-timer__colon">:</span>
          <div className="sale-timer__unit">
            <span className="sale-timer__number">{pad(time.seconds)}</span>
            <span className="sale-timer__unit-label">Seconds</span>
          </div>
        </div>
      </div>
    </section>
  );
}
