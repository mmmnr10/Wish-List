import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function DELETE(req, { params }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Obehörig' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const userId = decoded.userId;

    const { id } = await params;

    await dbConnect();
    
    // Raderar produkten men säkerställer att det bara är ägaren som kan göra det
    const deletedProduct = await Product.findOneAndDelete({ _id: id, userId });
    
    if (!deletedProduct) {
      return NextResponse.json({ error: 'Hittades inte eller så äger du inte denna bevakning' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Internt fel vid radering' }, { status: 500 });
  }
}
