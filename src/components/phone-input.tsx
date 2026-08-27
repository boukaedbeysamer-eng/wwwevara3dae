import { useMemo } from "react";

export type Country = { code: string; dial: string; name: string; flag: string };

export const COUNTRIES: Country[] = [
  { code: "AE", dial: "+971", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "SA", dial: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "QA", dial: "+974", name: "Qatar", flag: "🇶🇦" },
  { code: "KW", dial: "+965", name: "Kuwait", flag: "🇰🇼" },
  { code: "BH", dial: "+973", name: "Bahrain", flag: "🇧🇭" },
  { code: "OM", dial: "+968", name: "Oman", flag: "🇴🇲" },
  { code: "LB", dial: "+961", name: "Lebanon", flag: "🇱🇧" },
  { code: "JO", dial: "+962", name: "Jordan", flag: "🇯🇴" },
  { code: "EG", dial: "+20", name: "Egypt", flag: "🇪🇬" },
  { code: "GB", dial: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "US", dial: "+1", name: "United States", flag: "🇺🇸" },
  { code: "IN", dial: "+91", name: "India", flag: "🇮🇳" },
  { code: "PK", dial: "+92", name: "Pakistan", flag: "🇵🇰" },
  { code: "PH", dial: "+63", name: "Philippines", flag: "🇵🇭" },
  { code: "FR", dial: "+33", name: "France", flag: "🇫🇷" },
  { code: "DE", dial: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "AU", dial: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "CA", dial: "+1", name: "Canada", flag: "🇨🇦" },
  { code: "ZA", dial: "+27", name: "South Africa", flag: "🇿🇦" },
];

/** Digits only, max 15 (E.164 limit minus dial code). */
export function sanitizeNationalNumber(value: string) {
  return value.replace(/\D/g, "").slice(0, 15);
}

export function buildE164(dial: string, national: string) {
  const dialDigits = dial.replace(/\D/g, "");
  let digits = sanitizeNationalNumber(national).replace(/^0+/, "");
  // Tolerate people who paste the full international number into the field.
  if (digits.startsWith(dialDigits) && digits.length > dialDigits.length) {
    digits = digits.slice(dialDigits.length).replace(/^0+/, "");
  }
  return digits ? `${dial}${digits}` : "";
}


type Props = {
  dial: string;
  number: string;
  onDialChange: (dial: string) => void;
  onNumberChange: (value: string) => void;
  error?: string;
};

export function PhoneInput({ dial, number, onDialChange, onNumberChange, error }: Props) {
  const options = useMemo(
    () => COUNTRIES.map((c) => ({ ...c, key: `${c.code}${c.dial}` })),
    [],
  );

  return (
    <div>
      <span className="block text-xs uppercase tracking-[0.18em] text-foreground/70">
        WhatsApp number
      </span>
      <div className="mt-1 flex items-end gap-3">
        <select
          aria-label="Country dialling code"
          value={dial}
          onChange={(e) => onDialChange(e.target.value)}
          className="w-32 shrink-0 border-b border-foreground/30/25 bg-transparent px-0 py-2 text-sm text-foreground focus:border-terrain focus:outline-none"
        >
          {options.map((c) => (
            <option key={c.key} value={c.dial}>
              {c.flag} {c.dial}
            </option>
          ))}
        </select>
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          name="whatsapp-number"
          aria-label="WhatsApp phone number"
          placeholder="50 123 4567"
          value={number}
          onChange={(e) => onNumberChange(sanitizeNationalNumber(e.target.value))}
          className="w-full border-b border-foreground/30/25 bg-transparent px-0 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:border-terrain focus:outline-none"
        />
      </div>
      <span className="mt-1 block text-xs text-foreground/50">
        Numbers only — we'll message you on {dial} {number || "…"}
      </span>
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </div>
  );
}
