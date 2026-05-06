function addMinutes(iso, mins) {
  return new Date(new Date(iso).getTime() + mins * 60 * 1000).toISOString();
}

export function buildMockOffers({ from, to, departDate }) {
  const base = new Date(`${departDate}T09:00:00.000Z`).toISOString();
  const carriers = ["ZA", "ZT", "OK"];
  const makeOffer = (i, price) => {
    const carrier = carriers[i % carriers.length];
    const seg1Dur = 120 + i * 25;
    const seg2Dur = 180 + i * 15;
    const hasStop = i % 2 === 1;
    const departAt = addMinutes(base, i * 45);
    const arriveAt = addMinutes(departAt, hasStop ? seg1Dur + 65 + seg2Dur : seg1Dur + seg2Dur);
    return {
      id: `mock_${departDate}_${i}`,
      price: { amount: price, currency: "USD" },
      segments: hasStop
        ? [
            {
              from,
              to: "CHI",
              departAt,
              arriveAt: addMinutes(departAt, seg1Dur),
              carrier,
              flightNumber: `${carrier}${100 + i}`,
              durationMinutes: seg1Dur,
              stops: 0
            },
            {
              from: "CHI",
              to,
              departAt: addMinutes(departAt, seg1Dur + 65),
              arriveAt,
              carrier,
              flightNumber: `${carrier}${500 + i}`,
              durationMinutes: seg2Dur,
              stops: 0
            }
          ]
        : [
            {
              from,
              to,
              departAt,
              arriveAt,
              carrier,
              flightNumber: `${carrier}${700 + i}`,
              durationMinutes: seg1Dur + seg2Dur,
              stops: 0
            }
          ],
      deepLink: "https://www.aviasales.com/"
    };
  };

  return [makeOffer(0, 219), makeOffer(1, 249), makeOffer(2, 289), makeOffer(3, 315)];
}
