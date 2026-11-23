import React, { useState } from 'react'

interface CrazyToursLogoProps {
  className?: string
  size?: number
  showWordmark?: boolean
  light?: boolean
}

/**
 * 100% Exact Official Vector Polygon extracted directly from master asset
 * Crazy Tours Travels/public/IMG_1611.PNG (2500x2500 master emblem)
 */
const OFFICIAL_LOGO_PATH =
  'M 1006 20 L 1020 21 L 1031 26 L 1118 112 L 1185 114 L 1200 126 L 1207 145 ' +
  'L 1201 168 L 1183 182 L 1117 183 L 1033 267 L 1022 273 L 1003 274 L 991 269 ' +
  'L 982 261 L 975 246 L 975 231 L 980 219 L 1013 185 L 1012 183 L 500 184 ' +
  'L 471 187 L 457 193 L 444 207 L 439 222 L 440 236 L 449 253 L 458 261 ' +
  'L 474 267 L 518 263 L 605 263 L 639 271 L 667 288 L 684 306 L 696 326 ' +
  'L 705 357 L 705 876 L 713 896 L 725 907 L 737 912 L 754 912 L 769 905 ' +
  'L 779 895 L 786 877 L 785 361 L 794 327 L 808 304 L 830 283 L 854 270 ' +
  'L 885 263 L 921 266 L 948 277 L 964 288 L 987 315 L 997 336 L 1002 357 ' +
  'L 1002 925 L 998 951 L 986 990 L 973 1017 L 952 1048 L 921 1080 L 889 1103 ' +
  'L 849 1122 L 812 1132 L 790 1135 L 515 1135 L 445 1128 L 366 1108 L 283 1071 ' +
  'L 218 1028 L 187 1002 L 127 937 L 91 884 L 61 825 L 38 759 L 25 696 ' +
  'L 20 632 L 24 558 L 39 484 L 58 429 L 84 375 L 123 315 L 166 265 ' +
  'L 219 218 L 274 181 L 339 149 L 327 176 L 320 206 L 319 237 L 325 271 ' +
  'L 336 299 L 352 324 L 377 350 L 401 366 L 360 391 L 320 427 L 288 468 ' +
  'L 261 522 L 250 558 L 243 606 L 246 668 L 261 725 L 278 762 L 300 796 ' +
  'L 331 831 L 363 858 L 415 888 L 470 906 L 511 912 L 590 912 L 605 950 ' +
  'L 630 984 L 524 984 L 484 981 L 431 970 L 387 954 L 343 931 L 293 894 ' +
  'L 255 855 L 216 798 L 192 745 L 179 699 L 172 649 L 172 598 L 184 527 ' +
  'L 207 466 L 246 403 L 288 358 L 268 323 L 254 283 L 202 332 L 174 367 ' +
  'L 150 404 L 116 478 L 98 547 L 92 598 L 92 649 L 98 700 L 119 777 ' +
  'L 131 806 L 158 856 L 204 917 L 238 951 L 285 988 L 321 1010 L 365 1031 ' +
  'L 411 1047 L 454 1057 L 503 1063 L 787 1063 L 819 1056 L 850 1042 L 875 1024 ' +
  'L 896 1002 L 912 978 L 921 958 L 931 912 L 931 368 L 923 349 L 907 337 ' +
  'L 887 335 L 873 341 L 863 351 L 857 365 L 854 902 L 842 930 L 833 943 ' +
  'L 801 970 L 781 979 L 757 984 L 717 981 L 685 967 L 659 944 L 642 916 ' +
  'L 634 886 L 632 359 L 618 341 L 604 335 L 509 335 L 468 338 L 444 333 ' +
  'L 424 324 L 408 313 L 382 282 L 371 255 L 368 216 L 375 186 L 394 154 ' +
  'L 421 131 L 457 117 L 509 112 L 1013 112 L 1014 110 L 981 77 L 975 63 ' +
  'L 975 48 L 980 36 L 993 24 L 1006 20 Z'

export function CrazyToursLogo({
  className = '',
  size = 40,
  showWordmark = true,
  light = false,
}: CrazyToursLogoProps) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon Mark Box */}
      <div
        className="relative rounded-xl overflow-hidden shadow-sm flex-none flex items-center justify-center p-1 border border-emerald-950/15"
        style={{
          width: size,
          height: size,
          background: 'radial-gradient(circle at 40% 30%, #ef4934 0%, #d83a26 60%, #a81c0c 100%)',
        }}
      >
        {!imageFailed ? (
          <img
            src="/IMG_1611.PNG"
            alt="Crazy Tours Travels Emblem"
            className="w-full h-full object-contain rounded-lg"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <svg
            viewBox="0 0 1227 1155"
            className="w-full h-full p-0.5"
            fill="#ffffff"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d={OFFICIAL_LOGO_PATH} fill="#ffffff" />
          </svg>
        )}
      </div>

      {/* Wordmark Typography */}
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-[-0.03em] ${
                light ? 'text-white' : 'text-[#072f2b]'
              }`}
              style={{ fontSize: size * 0.55 }}
            >
              CRAZY
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ef4934]"></span>
          </div>
          <span
            className="font-bold tracking-[0.24em] uppercase text-[#ef4934] mt-0.5"
            style={{ fontSize: Math.max(9, size * 0.25) }}
          >
            Tours & Travels
          </span>
        </div>
      )}
    </div>
  )
}
