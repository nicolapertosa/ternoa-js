import BN from "bn.js"
import { hexToString } from "@polkadot/util"
import { query, BalanceType } from "../blockchain"
import { chainQuery, Errors, txPallets } from "../constants"
import { ICollectionData, INftData } from "./types"

/**
 * @name nftMintFee
 * @summary Fee to mint an NFT (extra fee on top of the tx fees).
 * @returns NFT mint fee.
 */
export const getNftMintFee = async (): Promise<BalanceType> => {
  const fee = await query(txPallets.nft, chainQuery.nftMintFee)
  return fee as any as BalanceType
}

/**
 * @name getNextNftId
 * @summary Get the next NFT Id available.
 * @returns Number.
 */
export const getNextNftId = async (): Promise<number> => {
  const id = await query(txPallets.nft, chainQuery.nextNFTId)
  return (id as any as BN).toNumber()
}

/**
 * @name getNextCollectionId
 * @summary Get the next collection Id available.
 * @returns Number.
 */
export const getNextCollectionId = async (): Promise<number> => {
  const id = await query(txPallets.nft, chainQuery.nextCollectionId)
  return (id as any as BN).toNumber()
}

/**
 * @name getNftData
 * @summary       Provides the data related to one NFT.
 * @param nftId   The NFT id.
 * @returns       A JSON object with the NFT data. ex:{owner, creator, offchainData, (...)}
 */
export const getNftData = async (nftId: number): Promise<INftData | null> => {
  const data = await query(txPallets.nft, chainQuery.nfts, [nftId])
  if (data.isEmpty == true) {
    return null
  }

  try {
    const result = data.toJSON() as INftData
    // The offchainData is an hexadecimal string, we convert it to a human readable string.
    if (result.offchainData) result.offchainData = hexToString(result.offchainData)
    return result
  } catch (error) {
    throw new Error(`${Errors.NFT_CONVERSION_ERROR}`)
  }
}

/**
 * @name getCollectionData
 * @summary             Provides the data related to one NFT collection. ex:{owner, creator, offchainData, limit, isClosed(...)}
 * @param collectionId  The collection id.
 * @returns             A JSON object with data of a single NFT collection.
 */
export const getCollectionData = async (collectionId: number): Promise<ICollectionData | null> => {
  const data = await query(txPallets.nft, chainQuery.collections, [collectionId])
  if (data.isEmpty == true) {
    return null
  }

  try {
    return data.toJSON() as any as ICollectionData
  } catch (error) {
    throw new Error(`${Errors.COLLECTION_CONVERSION_ERROR}`)
  }
}
