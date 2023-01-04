import { ChainId, Currency, CurrencyAmount, NATIVE } from '@pancakeswap/sdk'
import { FAST_INTERVAL, NATIVE_TOKEN_ADDRESS } from 'config/constants'
import { keysToCamel } from 'utils/snakeToCamel'
import { useEffect } from 'react'
import { useIsAkkaSwapModeStatus } from 'state/global/hooks'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import useSWR, { Fetcher } from 'swr'
import { AkkaRouterArgsResponseType, AkkaRouterInfoResponseType } from './types'
import { useActiveChainId } from 'hooks/useActiveChainId'

// Api for smart contract args (use this api to call akka contract easily)
export const useAkkaRouterArgs = (token0: Currency, token1: Currency, amount: CurrencyAmount<Currency>, slippage = 0.1) => {
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const [isAkkSwapMode, toggleSetAkkaMode, toggleSetAkkaModeToFalse, toggleSetAkkaModeToTrue] =
    useIsAkkaSwapModeStatus()
  const fetcher: Fetcher<AkkaRouterArgsResponseType> = (url) =>
    fetch(url).then((r) => {
      if (r.status !== 200) {
        toggleSetAkkaModeToFalse()
      }
      return r.json()
    })
  const { chainId } = useActiveChainId()
  const { data, error } = useSWR(
    `https://icecream.akka.finance/swap?token0=${inputCurrencyId === NATIVE[chainId].symbol ? NATIVE_TOKEN_ADDRESS : token0?.wrapped?.address
    }&token1=${outputCurrencyId === NATIVE[chainId].symbol ? NATIVE_TOKEN_ADDRESS : token1?.wrapped?.address
    }&amount=${amount?.toExact()}&slipage=${slippage}&use_split=true&chain_id=${chainId}`,
    token0 && token1 && amount && slippage && (chainId === ChainId.BITGERT || chainId === ChainId.XDC) && fetcher,
    {
      refreshInterval: FAST_INTERVAL,
    },
  )
  return { data, error }
}

// Api with information for ui to show route
export const useAkkaRouterRoute = (token0: Currency, token1: Currency, amount: CurrencyAmount<Currency>, slippage = 0.1) => {
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const [isAkkSwapMode, toggleSetAkkaMode, toggleSetAkkaModeToFalse, toggleSetAkkaModeToTrue] =
    useIsAkkaSwapModeStatus()
  const fetcher: Fetcher<AkkaRouterInfoResponseType> = (url) =>
    fetch(url).then((r) => {
      if (r.status !== 200) {
        toggleSetAkkaModeToFalse()
      }
      return r.json()
    })
  const { chainId } = useActiveChainId()
  const { data, error } = useSWR(
    `https://icecream.akka.finance/route?token0=${inputCurrencyId === NATIVE[chainId].symbol ? NATIVE_TOKEN_ADDRESS : token0?.wrapped?.address
    }&token1=${outputCurrencyId === NATIVE[chainId].symbol ? NATIVE_TOKEN_ADDRESS : token1?.wrapped?.address
    }&amount=${amount?.toExact()}&slipage=${slippage}&use_split=true&chain_id=${chainId}`,
    token0 && token1 && amount && slippage && (chainId === ChainId.BITGERT || chainId === ChainId.XDC) && fetcher,
    {
      refreshInterval: FAST_INTERVAL,
    },
  )
  return { data, error }
}

// Call both apis route and args together in the same time
export const useAkkaRouterRouteWithArgs = (token0: Currency, token1: Currency, amount: CurrencyAmount<Currency>, slippage = 0.1) => {
  const route = useAkkaRouterRoute(token0, token1, amount, slippage)
  const args = useAkkaRouterArgs(token0, token1, amount, slippage)

  return {
    route,
    args,
  }
}
