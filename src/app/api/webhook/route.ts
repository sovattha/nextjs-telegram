import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const json = await request.json();
  console.log('Received a new message:', json);
  if (!json) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return NextResponse.json({ error: 'Telegram credentials not configured' }, { status: 500 });
  }

  try {
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await axios.post(telegramUrl, {
      chat_id: chatId,
      text: `<code>${JSON.stringify(json, null, 2)}</code>`,
      parse_mode: 'HTML',
    });

    return NextResponse.json({ success: true, telegramResponse: response.data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to send Telegram message' }, { status: 500 });
  }
}
