type DateLike = string | number | Date | null | undefined;

type FormatDateOptions = {
  locale?: string;
  fallback?: string;
  options?: Intl.DateTimeFormatOptions;
};

const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  year: "numeric",
};

const DEFAULT_DATETIME_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

const resolveDate = (value: DateLike): Date | null => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const resolveInvalidFallback = (value: DateLike, fallback: string) => {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
};

export const formatDate = (
  value: DateLike,
  {
    locale = "en-NG",
    fallback = "--",
    options = DEFAULT_DATE_OPTIONS,
  }: FormatDateOptions = {},
) => {
  const date = resolveDate(value);
  if (!date) return resolveInvalidFallback(value, fallback);
  return new Intl.DateTimeFormat(locale, options).format(date);
};

export const formatDateTime = (
  value: DateLike,
  {
    locale = "en-NG",
    fallback = "--",
    options = DEFAULT_DATETIME_OPTIONS,
  }: FormatDateOptions = {},
) => {
  const date = resolveDate(value);
  if (!date) return resolveInvalidFallback(value, fallback);
  return new Intl.DateTimeFormat(locale, options).format(date);
};

const getOrdinalSuffix = (day: number) => {
  const lastDigit = day % 10;
  const lastTwoDigits = day % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return "TH";
  if (lastDigit === 1) return "ST";
  if (lastDigit === 2) return "ND";
  if (lastDigit === 3) return "RD";
  return "TH";
};

export const formatCertificateDateHeading = (
  value: DateLike,
  { locale = "en-GB", fallback = "--" }: Pick<FormatDateOptions, "locale" | "fallback"> = {},
) => {
  const date = resolveDate(value);
  if (!date) return resolveInvalidFallback(value, fallback);

  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);
  const month = new Intl.DateTimeFormat(locale, { month: "long" })
    .format(date)
    .toUpperCase();
  const year = date.getFullYear();

  return `${day}${suffix} ${month}, ${year}`;
};

export const formatDateSlash = (
  value: DateLike,
  { locale = "en-GB", fallback = "--/--/----" }: Pick<FormatDateOptions, "locale" | "fallback"> = {},
) => {
  return formatDate(value, {
    locale,
    fallback,
    options: {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  });
};
