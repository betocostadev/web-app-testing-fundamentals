import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  const clusterPage = new ClusterPage(page)
  await clusterPage.goto()
  await expect(clusterPage.title).resolves.toMatch(
    'Chicago Traffic Accidents Clustering'
  )
})

test('it prints current parameters', async ({ page }) => {
  // Much simpler using Page Objects. Also more reusable.
  const clusterPage = new ClusterPage(page)
  await clusterPage.goto({ size: 1000, distance: 450 })
  await expect(clusterPage.size).toHaveText('1000')
  await expect(clusterPage.distance).toHaveText('450')
  await expect(clusterPage.minClusterSize).toHaveText('5')
  // await page.goto('http://localhost:5173/clustering/?size=1000&distance=450')
  // await expect(page.locator('span.size')).toHaveText('1000')
  // await expect(page.locator('span.distance')).toHaveText('450')
  // await expect(page.locator('span.min-cluster-size')).toHaveText('5')
})

class ClusterPage {
  constructor(private page: any) {}

  async goto({
    size,
    distance,
    minClusterSize,
  }: { size?: number; distance?: number; minClusterSize?: number } = {}) {
    const url = new URL('http://localhost:5173/clustering/')
    if (size) url.searchParams.set('size', size.toString())
    if (distance) url.searchParams.set('distance', distance.toString())
    if (minClusterSize)
      url.searchParams.set('minClusterSize', minClusterSize.toString())
    await this.page.goto(url.toString())
  }

  get title() {
    return this.page.title()
  }

  // Represents the current size of the dataset.
  get size() {
    return this.page.locator('span.size')
  }

  get distance() {
    return this.page.locator('span.distance')
  }

  get minClusterSize() {
    return this.page.locator('span.min-cluster-size')
  }
}
