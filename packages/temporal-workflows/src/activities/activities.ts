export async function greet(name: string): Promise<string> {
  console.log('Greeting');
  return `Hello, ${name}!`;
}

export async function goodbye(name: string): Promise<string> {
  console.log('SOMETHING');
  // throw new Error('OH NOES');
  return `Goodbye ${name}`;
}
