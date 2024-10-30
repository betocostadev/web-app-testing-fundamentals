import { Mock, describe, it, vi, beforeEach } from 'vitest'
import { Fetch, GithubApi } from './github-api'

describe('github-api', () => {
  // Understand that this isn't a unit test, since Github can go down and the test will fail
  // We will mock it to avoid this
  let fetchMock: Mock<Parameters<Fetch>, ReturnType<Fetch>>
  let delayMock: Mock<[number], Promise<void>>
  let api: GithubApi

  beforeEach(() => {
    fetchMock = vi.fn<Parameters<Fetch>, ReturnType<Fetch>>(mockPromise)
    delayMock = vi.fn<[number], Promise<void>>(mockPromise)
    api = new GithubApi('TOKEN', fetchMock, delayMock)
  })

  describe('getRepository', () => {
    // expect is passed in the function as an argument here to avoid problems when using concurrent tests
    // there is no need to pass it when the tests are not concurrent
    it('should return repository information', async ({ expect }) => {
      // Mocking to avoid a failure due to api or communication failure
      const responsePromise = api.getRepository('USERNAME', 'REPOSITORY')

      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.github.com/repos/USERNAME/REPOSITORY',
        {
          headers: {
            'User-Agent': 'Qwik Workshop',
            'X-GitHub-Api-Version': '2022-11-28',
            Authorization: 'Bearer TOKEN',
          },
        }
      )
      // The actual response doens't matter, that's why the RESPONSE below, to enforce that.
      fetchMock.mock.results[0].value.resolve(new Response('"RESPONSE"'))
      expect(await responsePromise).toEqual('RESPONSE')
      // expect(response).toMatchSnapshot()
    })
    it('should timeout after x seconds with timeout response', async ({
      expect,
    }) => {
      const responsePromise = api.getRepository('USERNAME', 'REPOSITORY')

      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.github.com/repos/USERNAME/REPOSITORY',
        {
          headers: {
            'User-Agent': 'Qwik Workshop',
            'X-GitHub-Api-Version': '2022-11-28',
            Authorization: 'Bearer TOKEN',
          },
        }
      )
      expect(delayMock).toHaveBeenCalledWith(4000)
      delayMock.mock.results[0].value.resolve()
      expect(await responsePromise).toEqual({
        response: 'timeout',
      })
    })
  })
})

function mockPromise<T>() {
  let resolve!: (value: T) => void
  let reject!: (error: any) => void

  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  }) as Promise<T> & { resolve: typeof resolve; reject: typeof reject }
  promise.resolve = resolve
  promise.reject = reject
  return promise
}
