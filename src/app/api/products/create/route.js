import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { scrapeProductUrl } from '@/lib/scraper';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Obehörig - Du måste vara inloggad' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const userId = decoded.userId;

    const { url, targetSize } = await req.json();
    if (!url || !targetSize) {
      return NextResponse.json({ error: 'Både länk och storlek krävs' }, { status: 400 });
    }

    // Scrapea sidan efter info och storleksstatus
    const { title, image, price, isSizeInStock } = await scrapeProductUrl(url, targetSize);

    await dbConnect();
    
    // Spara till databasen, länk till andvändaren
    const newProduct = await Product.create({
      userId,
      url,
      title,
      image,
      targetSize,
      isSizeInStock,
      currentPrice: price,
      priceHistory: [{ price }] // Logga första priset i arrayen
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Fel vid upphämtning. Se till att det är en äkta butikslänk.' }, { status: 500 });
  }
}
