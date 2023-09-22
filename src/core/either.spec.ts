import { Either, isLeft, isRight, left, right } from './either'

function shouldSuccess(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(10)
  }

  return left('error.')
}

test('success result', () => {
  const result = shouldSuccess(true)

  if (isRight(result)) {
    console.log(result.value.toFixed(2))
  }

  expect(isRight(result)).toBe(true)
  expect(isLeft(result)).toBe(false)
})

test('failure result', () => {
  const result = shouldSuccess(false)

  if (isLeft(result)) {
    console.log(result.value.toUpperCase())
  }

  expect(isLeft(result)).toBe(true)
  expect(isRight(result)).toBe(false)
})
