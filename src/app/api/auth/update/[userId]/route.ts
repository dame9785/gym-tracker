export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const id = Number(userId);

    // 1. Kontrollera userId
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Ogiltigt användar-ID.',
          errors: [],
        } satisfies AuthApiResponse,
        { status: 400 }
      );
    }

    // 2. Hämta JWT
    const token = request.cookies.get('token')?.value;

if (!token) {
  return NextResponse.json(
    {
      success: false,
      message: 'Du måste vara inloggad.',
      errors: [],
    } satisfies AuthApiResponse,
    { status: 401 }
  );
}

    // 3. Verifiera JWT
    

    try {
      const payload = verifyToken(token);
    } catch {
      return NextResponse.json(
  {
    success: false,
    message: 'Ogiltig eller utgången token.',
    errors: [],
  } satisfies AuthApiResponse,
  { status: 401 }
);
    }

    // 4. Authorization
    if (payload.userId !== id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Du har inte behörighet.',
          errors: [],
        } satisfies AuthApiResponse,
        { status: 403 }
      );
    }

    // 5. Hämta body
    const body = await request.json();

    // 6. Zod validation
    const validation = updateSchema.safeParse(body);

    if (!validation.success) {
      const fieldErrors = Object.fromEntries(
        validation.error.issues.map((issue) => [
          String(issue.path[0]),
          issue.message,
        ])
      );

      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed.',
          errors: validation.error.issues.map(
            (issue) => issue.message
          ),
          fieldErrors,
        } satisfies AuthApiResponse,
        { status: 400 }
      );
    }

    // 7. Business logic
    const response = await authService.updateUser(
      validation.data,
      id
    );

    return NextResponse.json(response, {
      status: response.success ? 200 : 400,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong.',
        errors: [],
      } satisfies AuthApiResponse,
      { status: 500 }
    );
  }
}