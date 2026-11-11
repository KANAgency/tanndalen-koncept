/* Vägpunkter i sträckans egna koordinater.
   t = andel längs sträckan (0–1), offset = avvikelse vinkelrätt, andel av längden.
   Positiv offset är till höger om färdriktningen. Ändra fritt; buildHittaRoute ritar om. */
export const hittaRoute = [
  {
    name: "Stockholm–Orsa",
    points: [
      [0.00, 0],
      [0.34, 0.075],
      [0.60, -0.08],
      [1.00, 0]
    ]
  },
  {
    name: "Orsa–Tänndalen",
    points: [
      [0.00, 0],
      [0.34, -0.075],
      [0.60, 0.08],
      [1.00, 0]
    ]
  }
];
