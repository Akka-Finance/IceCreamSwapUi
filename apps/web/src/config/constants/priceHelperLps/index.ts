import { getFarmsPriceHelperLpFiles } from '@pancakeswap/farms'
import { ChainId } from '@pancakeswap/sdk'
// import PoolsBscPriceHelper from './pools/56'

export { getFarmsPriceHelperLpFiles }

export const getPoolsPriceHelperLpFiles = (chainId: ChainId) => {
  /* switch (chainId) {
    case ChainId.BSC:
      return PoolsBscPriceHelper
    default:
      return []
  }
   */
  return []
}
