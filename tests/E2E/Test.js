import { test } from '@japa/runner'

test.group('Test', () => {
  test('should be able to run tests', async ({ assert }) => {
    assert.equal(2 + 2, 4)
  })
})
