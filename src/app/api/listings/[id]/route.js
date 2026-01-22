import dbConnect from '@/lib/db';
import Listing from '@/models/Listing';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) { // <--- Destructure params ở đây
  try {
    // QUAN TRỌNG: Trong Next.js 15, params là Promise, phải await
    const { id } = await params; 

    await dbConnect();

    const listing = await Listing.findById(id);

    if (!listing) {
      return NextResponse.json({ success: false, error: "Tin không tồn tại" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: listing });

  } catch (error) {
    console.error("Lỗi API:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
