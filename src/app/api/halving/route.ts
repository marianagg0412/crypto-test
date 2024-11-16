// src/app/api/halving/route.ts
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get('https://blockchain.info/q/getblockcount');

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return new Response('Failed to fetch data', { status: 500 });
  }
}
