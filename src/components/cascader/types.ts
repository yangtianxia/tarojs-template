export type CascaderOption = {
  text?: string
  value?: Numeric
  disabled?: boolean
  children?: CascaderOption[]
  // for custom filed names
  [key: PropertyKey]: any
}

export type CascaderTab = {
  options: CascaderOption[]
  selected: CascaderOption | null
}

export type CascaderFieldNames = {
  text?: string
  value?: string
  children?: string
}
