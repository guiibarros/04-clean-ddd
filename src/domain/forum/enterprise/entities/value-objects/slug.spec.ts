import { Slug } from './slug'

test('it should be able to generate a new slug from text', () => {
  const slug = Slug.generateFromText('Example question title')

  expect(slug.value).toEqual('example-question-title')
})
