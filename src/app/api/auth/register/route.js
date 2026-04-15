import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'E-post och lösenord krävs' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Konto finns redan' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      passwordHash,
    });

    return NextResponse.json({ success: true, message: 'Konto skapat' }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Något gick fel' }, { status: 500 });
  }
}
