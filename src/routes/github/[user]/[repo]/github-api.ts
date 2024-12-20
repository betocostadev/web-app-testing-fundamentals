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
    private fetch: Fetch = fetch,
    private delay: (ms: number) => Promise<void> = delay
  ) {}

  async getRepositories(username: string) {
    let page = 1
    const repositories: OrgRepoResponse[] = []

    while (true) {
      const response = await this.fetch(
        `https://api.github.com/users/${username}/repos?per_page=30&page=${page}`,
        {
          headers: {
            'User-Agent': 'Qwik Workshop',
            'X-GitHub-Api-Version': '2022-11-28',
          },
        }
      )

      const json = await response.json()
      repositories.push(...json)

      if (json.length < 30) {
        break
      }
      // console.log(json)
      page++
    }
    return repositories
  }
  async getRepository(user: string, repo: string) {
    const headers: HeadersInit = {
      'User-Agent': 'Qwik Workshop',
      'X-GitHub-Api-Version': '2022-11-28',
    }

    if (this.token) {
      headers['Authorization'] = 'Bearer ' + this.token
    }

    return Promise.race([
      this.delay(4000).then(() => {
        return {
          response: 'timeout',
        }
      }),

      this.fetch(`https://api.github.com/repos/${user}/${repo}`, {
        headers,
      }).then((response) => {
        return response.json()
      }),
    ])
  }
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
