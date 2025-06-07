import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('Login API called');
  try {
    const body = await request.text();
    console.log('Request body:', body);

    const { email, password } = JSON.parse(body);
    console.log('Parsed credentials:', { email, password: '***' });

    // Validasi input
    if (!email || !password) {
      console.log('Validation failed: missing email or password');
      return NextResponse.json(
        { success: false, error: 'Email dan password wajib diisi' },
        { status: 400 }
      );
    }

    // Demo credentials untuk admin
    const validCredentials = [
      {
        email: 'admin@pontigramid.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin'
      },
      {
        email: 'editor@pontigramid.com',
        password: 'editor123',
        name: 'Editor User',
        role: 'editor'
      }
    ];

    // Cek kredensial
    const user = validCredentials.find(
      cred => cred.email === email.toLowerCase() && cred.password === password
    );

    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('Login failed: invalid credentials');
      return NextResponse.json(
        { success: false, error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Generate simple token (untuk demo)
    const token = Buffer.from(JSON.stringify({
      email: user.email,
      name: user.name,
      role: user.role,
      timestamp: Date.now()
    })).toString('base64');

    const response = {
      success: true,
      token,
      user: {
        email: user.email,
        name: user.name,
        role: user.role
      }
    };

    console.log('Login successful, returning:', response);
    return NextResponse.json(response);

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan saat login' },
      { status: 500 }
    );
  }
}
