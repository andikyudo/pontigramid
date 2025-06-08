import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import News from '@/models/News';
import mongoose from 'mongoose';

// GET - Ambil berita berdasarkan ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    
    // Validasi ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'ID berita tidak valid' },
        { status: 400 }
      );
    }
    
    const news = await News.findById(id);
    
    if (!news) {
      return NextResponse.json(
        { success: false, error: 'Berita tidak ditemukan' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: news
    });
    
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data berita' },
      { status: 500 }
    );
  }
}

// PUT - Update berita
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();
    
    // Validasi ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'ID berita tidak valid' },
        { status: 400 }
      );
    }
    
    const { title, content, excerpt, category, author, imageUrl, published } = body;
    
    // Validasi input
    if (!title || !content || !excerpt || !category || !author) {
      return NextResponse.json(
        { success: false, error: 'Semua field wajib diisi' },
        { status: 400 }
      );
    }
    
    const updatedNews = await News.findByIdAndUpdate(
      id,
      {
        title,
        content,
        excerpt,
        category,
        author,
        imageUrl: imageUrl || '',
        published: published || false
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedNews) {
      return NextResponse.json(
        { success: false, error: 'Berita tidak ditemukan' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updatedNews,
      message: 'Berita berhasil diupdate'
    });
    
  } catch (error: unknown) {
    console.error('Error updating news:', error);

    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Judul berita sudah ada' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Gagal mengupdate berita' },
      { status: 500 }
    );
  }
}

// DELETE - Hapus berita
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    
    // Validasi ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'ID berita tidak valid' },
        { status: 400 }
      );
    }
    
    const deletedNews = await News.findByIdAndDelete(id);
    
    if (!deletedNews) {
      return NextResponse.json(
        { success: false, error: 'Berita tidak ditemukan' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Berita berhasil dihapus'
    });
    
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal menghapus berita' },
      { status: 500 }
    );
  }
}
