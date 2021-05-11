// prettier-ignore
type FindAddressParams =
  | { address: string }
  | { latitude: number; longitude: number }

type FindPlacesParams =
  | { cursor: string }
  | { keyword: string; latitude: number; longitude: number; radius: number; type: string }

export type { FindAddressParams, FindPlacesParams }
