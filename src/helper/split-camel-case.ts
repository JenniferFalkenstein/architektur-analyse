type ExampleType = {
  name: string,
  age: number,
}
/**
 * Konvertiert ein camelCase oder PascalCase string in ein Array mit LowerCase Wörtern
 * z.B. "getUserAndTransform" -> ["get", "user", "and", "transform"]
 *
 * @param {string} name - The camelCase or PascalCase string to convert.
 * @returns {string[]} An array of lowercase words.
 */
function splitCamelCase(name: string, example?: Omit<ExampleType, 'name'>): string[] {
  return name.split(/(?=[A-Z])|_/).map(word => word);
};

export {
  splitCamelCase,
};
