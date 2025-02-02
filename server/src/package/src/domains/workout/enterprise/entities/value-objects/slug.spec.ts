import { Slug } from './slug'

it('should be able to create a slug from text', () => {
  const slug = Slug.createFromText('An Example Title')

  expect(slug.value).toEqual('an-example-title')
})
