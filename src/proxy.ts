import { NextRequest, NextResponse } from 'next/server';

const USER = 'demo';
const PASS = 'demo456';

export function proxy(req: NextRequest) {
  // Utloggning (endast för prototypen): svara alltid 401 så att webbläsaren
  // släpper sina sparade inloggningsuppgifter.
  if (req.nextUrl.pathname === '/logga-ut') {
    return new NextResponse(
      `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8" />
  <title>Utloggad</title>
  <style>
    body { font-family: -apple-system, sans-serif; display: flex; align-items: center;
           justify-content: center; min-height: 90vh; background: #F7F7F8; color: #1D1D1B; }
    .kort { background: #fff; border: 1px solid #E3E3E6; border-radius: 12px;
            padding: 32px 40px; max-width: 420px; text-align: center; }
    a { color: #4A1B8B; }
  </style>
</head>
<body>
  <div class="kort">
    <h1 style="font-size:18px">Du är nu utloggad</h1>
    <p style="font-size:14px">Om en inloggningsruta visas, klicka på Avbryt.
    Du skickas till startsidan om några sekunder, där du kan logga in igen.</p>
    <p style="font-size:14px"><a href="/oversikt">Till startsidan direkt</a></p>
  </div>
</body>
</html>`,
      {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Interregdatabas", charset="UTF-8"',
          'Content-Type': 'text/html; charset=UTF-8',
          'Refresh': '4; url=/oversikt',
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
