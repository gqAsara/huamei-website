/** Public embed identifiers from tawk.to → Administration → Chat Widget. */
export function getLiveChatConfig() {
  const propertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID?.trim();
  const widgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID?.trim();

  // Reject missing values, pasted embed HTML, and setup placeholders.
  if (!propertyId || !/^[a-f\d]{24}$/i.test(propertyId)) return null;
  if (!widgetId || !/^[a-z\d]{1,32}$/i.test(widgetId)) return null;

  return {
    propertyId,
    widgetId,
    scriptSrc: `https://embed.tawk.to/${propertyId}/${widgetId}`,
  };
}
