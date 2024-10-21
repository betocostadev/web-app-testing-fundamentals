import { describe, it } from 'vitest'
import { GithubApi } from './github-api'

describe('github-api', () => {
  // Understand that this isn't a unit test, since Github can go down and the test will fail
  describe('getRepository', () => {
    it('should return repository information', async ({ expect }) => {
      const api = new GithubApi(undefined)
      const response = await api.getRepository(
        'betocostadev',
        'web-app-testing-fundamentals'
      )
      expect(response).toMatchSnapshot()
    })
    it.todo('should timeout after x seconds with timeout response')
  })
})
