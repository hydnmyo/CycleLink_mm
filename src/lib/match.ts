export function materialsMatch(
  a: { category: string; subcategory: string; city: string },
  b: { category: string; subcategory: string; city: string },
) {
  return a.category === b.category && a.subcategory === b.subcategory && a.city === b.city
}
