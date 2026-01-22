import dbConnect from '@/lib/db';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST() {
  const user = await currentUser();
  await dbConnect();
  // Tặng ngay 1 triệu LAK để test
  await User.findOneAndUpdate({ clerkId: user.id }, { $inc: { walletBalance: 1000000 } });
  return NextResponse.json({ success: true });
}
