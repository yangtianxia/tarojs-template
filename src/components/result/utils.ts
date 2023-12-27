import type { PropType } from 'vue'
import type { ResultStatus } from './types'

export const resultSharedProps = {
  status: {
    type: [String, Object] as PropType<ResultStatus>,
    default: null as unknown
  }
}

export const resultStatusConfig = {
  404: {
    title: $t('result.404.title'),
    // image: require('./image/404.png')
  },
  500: {
    title: $t('result.500.title'),
    // image: require('./image/500.png')
  },
  nodata: {
    title: $t('result.nodata.title'),
    // image: require('./image/no-data.png')
  },
  network: {
    title: $t('result.network.title'),
    // image: require('./image/no-network.png')
  },
  error: {
    title: $t('result.error.title'),
    // image: require('./image/error.png')
  }
} as const
