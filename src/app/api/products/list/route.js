import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Obehörig' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    await dbConnect();
    // Hämta alla produkter för inloggad användare, sortera med nyast överst
    const products = await Product.find({ userId: decoded.userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error) {
    console.error('List product error:', error);
    return NextResponse.json({ error: 'Något gick fel vid hämtning' }, { status: 500 });
  }
}
