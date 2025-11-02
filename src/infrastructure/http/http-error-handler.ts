import { ApplicationError } from '../../application/exceptions/application-error'

interface ErrorResponse {
  error: string
}

export const formatError = (error: unknown): {
  status: number
  body: ErrorResponse
} => {
  if (error instanceof ApplicationError) {
    return {
      status: error.statusCode,
      body: { error: error.message }
    }
  }

  console.error(error)

  return {
    status: 500,
    body: { error: 'Internal server error' }
  }
}
