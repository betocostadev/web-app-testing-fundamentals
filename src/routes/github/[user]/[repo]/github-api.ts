// Creating a simple fake API to fetch some repository data on Github.
// It needs a Private Github Access Token that you can generate in your Github Profile.
import type { paths } from '@octokit/openapi-types'

type OrgRepoResponse =
  paths['/repos/{owner}/{repo}']['get']['responses']['200']['content']['application/json']

export type Fetch = typeof fetch

// Fetch is passed here for test purposes. We are mocking a fetch with Vitest
export class GithubApi {
  constructor(
    private token: string | undefined,
    private fetch: Fetch
  ) {}

  async getRepository(user: string, repo: string) {
    const headers: HeadersInit = {
      'User-Agent': 'Qwik Workshop',
      'X-GitHub-Api-Version': '2022-11-28',
    }

    if (this.token) {
      headers['Authorization'] = 'Bearer ' + this.token
    }

    const response = await this.fetch(
      `https://api.github.com/repos/${user}/${repo}`,
      {
        headers,
      }
    )
    const repository = (await response.json()) as OrgRepoResponse

    return repository
  }
}
