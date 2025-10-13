import { splitCamelCase } from "./split-camel-case"

/**
 * Token-basierte Überprüfung, ob zwei Strings eine gemeinsamkeit haben.
 * Gibt 1 zurück, wenn sie mindestens einen Token gemeinsam haben, sonst 0.
 *
 * @param {string} name - Der erste String, der überprüft wird
 * @param {string} compareWith - Der zweite String, der überprüft wird
 * @returns {number} 1, wenn mindestens ein Token übereinstimmt, sonst 0
 */
export default (name: string, compareWith: string): number => {
  const splitName: string[] = splitCamelCase(name);
  const splitCompareWith: string[] = splitCamelCase(compareWith);
  return splitName.some(t => splitCompareWith.includes(t)) ? 1: 0;
}
