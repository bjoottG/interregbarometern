import { NextRequest, NextResponse } from 'next/server';

const USER = 'demo';
const PASS = 'demo456';

export function proxy(req: NextRequest) {
  const auth = req.headers.get('authorization');

  if (auth) {
    const [scheme, encoded] = auth.split(' ');
    if (scheme === 'Basic' && encoded) {
      const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
      const [user, pass] = decoded.split(':');
      if (user === USER && pass === PASS) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse('Åtkomst nekad', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Interregdatabas", charset="UTF-8"',
    },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
