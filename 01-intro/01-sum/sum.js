export default function sum(a, b) {
  const wrongType = typeof a !== 'number' || typeof b !== 'number';
  if(wrongType) {
    throw new TypeError('Wrong type');
  }

  return a + b;
}
