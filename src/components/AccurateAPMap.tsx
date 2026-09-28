import React, { useState } from 'react';

// Exact 28/26 districts from your provided first code:
const districtsData: [string, number][] = [
  ["Srikakulam", 912],["Parvathipuram Manyam", 451], ["Vizianagaram", 777], ["Visakhapatnam", 79],
  ["Alluri Sitarama Raju", 244],["Anakapalli", 646],["Kakinada", 385],["Dr. B.R. Ambedkar Konaseema", 342],
  ["East Godavari", 342],["Polavaram", 186],["Eluru", 547], ["West Godavari", 393],["NTR", 288], 
  ["Krishna", 491],["Guntur", 258],["Palnadu", 527],["Bapatla", 358], ["Prakasam", 519],
  ["Markapuram", 406], ["SPSR Nellore", 700],["Kurnool", 484], ["Nandyal", 489], ["Anantapur", 577], 
  ["Sri Sathya Sai", 467], ["Y.S.R. Kadapa", 619],["Annamayya", 411], ["Tirupati", 807],["Chittoor", 622]
];

// Exact coordinates from your initial code:
const mapPins: [string, number, number][] = [
  ["Srikakulam", 230, 55],
  ["Parvathipuram Manyam", 205, 72],
  ["Vizianagaram", 210, 91],
  ["Visakhapatnam", 217, 112],
  ["Alluri Sitarama Raju", 245, 120],
  ["Anakapalli", 225, 137],
  ["Kakinada", 250, 153],
  ["Dr. B.R. Ambedkar Konaseema", 270, 170],
  ["East Godavari", 245, 178],
  ["Eluru", 218, 185],
  ["West Godavari", 200, 198],
  ["NTR", 230, 211],
  ["Krishna", 250, 220],
  ["Palnadu", 205, 235],
  ["Guntur", 225, 245],
  ["Bapatla", 200, 260],
  ["Prakasam", 175, 275],
  ["Sri Potti Sriramulu Nellore", 155, 300],
  ["Kurnool", 140, 265],
  ["Nandyal", 160, 295],
  ["Anantapur", 135, 335],
  ["Sri Sathya Sai", 155, 360],
  ["YSR Kadapa", 195, 315],
  ["Annamayya", 185, 345],
  ["Tirupati", 170, 380],
  ["Chittoor", 145, 390]
];

interface AccurateAPMapProps {
  selectedDistrict: string;
  onSelectDistrict: (districtName: string) => void;
}

export const AccurateAPMap: React.FC<AccurateAPMapProps> = ({
  selectedDistrict,
  onSelectDistrict
}) => {
  return (
    <div className="ap-svg-wrap">
      <svg
        viewBox="0 0 380 430"
        className="ap-svg"
        aria-label="Andhra Pradesh district map"
      >
        <defs>
          <linearGradient
            id="land"
            x1="0"
            x2="1"
            y1="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#3fd8b2"
            />
            <stop
              offset="100%"
              stopColor="#3e8cff"
            />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur
              stdDeviation="5"
              result="b"
            />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Andhra Pradesh Map */}
        <path
          d="
            M178 24
            L228 18
            L264 47
            L294 72
            L282 101
            L316 126
            L294 155
            L309 184
            L285 207
            L301 242
            L278 263
            L284 299
            L251 317
            L255 353
            L225 374
            L211 410
            L171 392
            L151 360
            L128 347
            L120 315
            L94 298
            L103 264
            L78 237
            L92 204
            L72 178
            L96 151
            L83 119
            L109 103
            L102 73
            L133 62
            L144 35
            Z
          "
          fill="url(#land)"
          stroke="#8be7ff"
          strokeWidth="3"
          filter="url(#glow)"
        />

        {/* 26 Districts */}
        {mapPins.map(([n, x, y], i) => (
          <g 
            key={n}
            className="cursor-pointer"
            onClick={() => onSelectDistrict(n)}
          >
            <circle
              cx={x}
              cy={y}
              r="7"
              fill={[
                "#22c55e",
                "#fb7185",
                "#38bdf8",
                "#a78bfa",
                "#f97316",
                "#eab308",
                "#ef4444"
              ][i % 7]}
              stroke="#fff"
              strokeWidth="2"
            />

            <text
              x={x + 10}
              y={y + 4}
              fill="#d9f7ff"
              fontSize="7"
            >
              {n}
            </text>
          </g>
        ))}

        {/* Bay of Bengal */}
        <text
          x="270"
          y="230"
          fill="#5bb7df"
          fontSize="13"
          transform="rotate(-75 270 230)"
        >
          Bay of Bengal
        </text>

        {/* North */}
        <text
          x="330"
          y="25"
          fill="#fff"
          fontSize="18"
        >
          N
        </text>
      </svg>
    </div>
  );
};

export { districtsData };
