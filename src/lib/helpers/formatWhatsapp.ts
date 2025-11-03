export const formatWhatsapp = (phone: string) => {
  if (!phone) return null;

  let digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return `+55${digits}`;
  }
  if (digits.length === 13 && digits.startsWith("55")) {
    return `+${digits}`;
  }
  return `+${digits}`;
}