export const resolveCertificateTitle = (storageType?: string | null) =>
  storageType === "normal" ? "Hydrostatic Pressure Test Certificate" : "Truck Tanker Hydrostatic Test Certificate";

export const resolveStorageNoun = (storageType?: string | null) =>
  storageType === "normal" ? "storage tank" : "mobile storage tank";