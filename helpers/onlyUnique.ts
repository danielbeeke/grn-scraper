/**
 * May be used for filtering array's.
 * @param value 
 * @param index 
 * @param self 
 */

export function onlyUnique(value: any, index: number, self: Array<any>) {
  return self.indexOf(value) === index && value;
}