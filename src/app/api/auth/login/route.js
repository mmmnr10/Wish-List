import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'E-post och lösenord krävs' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Fel e-post eller lösenord' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Fel e-post eller lösenord' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    // Provide the JWT via HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return NextResponse.json({ success: true, message: 'Inloggad!' }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Något gick fel' }, { status: 500 });
  }
}
