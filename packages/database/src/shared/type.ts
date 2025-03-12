export const DEFAULT_LIMIT = 10
export const DEFAULT_PAGE = 1

export enum PeriodValues {
  THIS_WEEK = "week",
  THIS_MONTH = "month",
  THIS_YEAR = "year",
  INFINITY = "infinity",
}

export enum FilterValues {
  LASTED = "lasted",
  HOT = "hot",
  // TRENDING = "trending",
}

export interface IActionReturn<T> {
  data?: T
  error?: any
}

export interface IGetListResponse<T> {
  data: {
    data: T[]
    total: number
    page?: number
    totalPages?: number
    limit?: number
  }
  error?: unknown
}
