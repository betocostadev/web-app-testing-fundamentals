import { describe, it } from 'vitest'
import { cluster, loadDataset } from './clustering'

describe('clustering', () => {
  it.skip('should load data', ({ expect }) => {
    const dataset = loadDataset()
    expect(dataset).toMatchSnapshot()
  })

  it('should create a cluster', ({ expect }) => {
    const smallDataSet = [
      { lat: 0, lng: 0 },
      { lat: 0, lng: 1 },
      { lat: 10, lng: 10 },
      { lat: 11, lng: 11 },
    ]
    const clusters = cluster(smallDataSet, 5, 1)
    // console.log(clusters)
    // We ran the first time to get the data below from the first snapshot generated
    // We also removed some less important parts and used .toMatchObject to test
    // if what we want is in the object
    expect(clusters).toMatchObject({
      clusters: [
        {
          data: [
            {
              lat: 0,
              lng: 0,
            },
            {
              lat: 0,
              lng: 1,
            },
          ],
        },
        {
          data: [
            {
              lat: 10,
              lng: 10,
            },
            {
              lat: 11,
              lng: 11,
            },
          ],
        },
      ],
      latMax: 11,
      latMin: 0,
      lngMax: 11,
      lngMin: 0,
    })
  })
})
