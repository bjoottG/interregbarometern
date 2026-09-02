import { NextRequest, NextResponse } from 'next/server';

const USER = 'demo';
const PASS = 'demo456';

export function proxy(req: NextRequest) {
  // Utloggning (endast för prototypen): svara alltid 401 så att webbläsaren
  // släpper sina sparade inloggningsuppgifter.
  if (req.nextUrl.pathname === '/logga-ut') {
    return new NextResponse(
      'Du är nu utloggad ur prototypen. Stäng inloggningsrutan och gå tillbaka för att logga in igen.',
      {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Interregdatabas", charset="UTF-8"',
          'Content-Type': 'text/plain; charset=UTF-8',
        },
      },
    );
  }

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
