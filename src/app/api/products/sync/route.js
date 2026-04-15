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
    if (!token) return NextResponse.json({ error: 'Obehörig' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const userId = decoded.userId;

    await dbConnect();
    const products = await Product.find({ userId });

    let updatedCount = 0;

    for (const prod of products) {
      try {
        const { price, isSizeInStock } = await scrapeProductUrl(prod.url, prod.targetSize);
        let changed = false;

        // Uppdatera vid prisskillnad (Mock-tillägg: för test kan scrapern plöstligt hitta ett billigare slumpmässigt pris pga vår scraper-fallback om inte orginalsidan hittas)
        if (price !== prod.currentPrice) {
          prod.currentPrice = price;
          prod.priceHistory.push({ price: price, date: new Date() });
          changed = true;
        }

        // Lagerstatus checking
        if (isSizeInStock !== prod.isSizeInStock) {
          prod.isSizeInStock = isSizeInStock;
          changed = true;
        }

        if (changed) {
          await prod.save();
          updatedCount++;
        }
      } catch (err) {
        console.error(`Kunde inte synka ${prod.url}`, err);
      }
    }

    return NextResponse.json({ success: true, updatedCount });
  } catch (error) {
    return NextResponse.json({ error: 'Något gick fel vid synkning' }, { status: 500 });
  }
}
