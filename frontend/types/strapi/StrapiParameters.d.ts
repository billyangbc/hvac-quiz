// https://gist.github.com/qhoirulanwar/c8a16a01367b4ff6fb93a1e046781faf
export interface IApiParameters {
  sort?: string[] | string | null;
  filters?: Filters;
  populate?: any;
  fields?: string[] | null;
  pagination?: Pagination;
  publicationState?: string;
  locale?: string[] | string | null;
}

interface Pagination {
  pageSize: number | undefined;
  page: number | undefined;
}

interface Filters {
  $or?: any;
  $eq?: any;
  $eqi?: any;
  $ne?: any;
  $lt?: any;
  $lte?: any;
  $gt?: any;
  $gte?: any;
  $in?: any;
  $notIn?: any;
  $contains?: any;
  $notContains?: any;
  $containsi?: any;
  $notContainsi?: any;
  $null?: any;
  $notNull?: any;
  $between?: any;
  $startsWith?: any;
  $startsWithi?: any;
  $endsWith?: any;
  $endsWithi?: any;
  $and?: any;
  $not?: any;
}
