import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type ErrorType = 'database' | 'connection' | 'validation' | 'unknown';

interface ErrorResponse {
  status: string;
  error: string;
  details: {
    code?: string;
    timestamp: number;
    type: ErrorType;
  };
}

const createErrorResponse = (
  message: string,
  type: ErrorType,
  code?: string
): ErrorResponse => ({
  status: '❌ Error',
  error: message,
  details: {
    code,
    timestamp: Date.now(),
    type,
  },
});

const createSuccessResponse = (message: string) => ({
  status: '✅ Success',
  message,
  timestamp: Date.now(),
});

export async function GET() {
  try {
    // Test the connection with a timeout
    const result = await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database connection timeout')), 5000)
      ),
    ]);

    return NextResponse.json(createSuccessResponse('Successfully connected to database!'));
  } catch (error) {
    console.error('Database connection error:', error);
    
    // Determine error type and details
    let errorResponse: ErrorResponse;
    
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        errorResponse = createErrorResponse(
          'Database connection timeout',
          'connection',
          'TIMEOUT'
        );
      } else if (error.message.includes('connection')) {
        errorResponse = createErrorResponse(
          'Failed to connect to database',
          'connection',
          'CONNECTION_FAILED'
        );
      } else if (error.message.includes('prisma')) {
        errorResponse = createErrorResponse(
          'Database query error',
          'database',
          'QUERY_ERROR'
        );
      } else {
        errorResponse = createErrorResponse(
          error.message,
          'unknown',
          'UNKNOWN_ERROR'
        );
      }
    } else {
      errorResponse = createErrorResponse(
        'An unexpected error occurred',
        'unknown',
        'UNKNOWN_ERROR'
      );
    }

    return NextResponse.json(errorResponse, { status: 500 });
  }
} 