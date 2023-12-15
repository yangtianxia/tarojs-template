import { areaList } from '@vant/area-data'

type Option = {
  text: string
  value: string
  children?: Option[]
}

/**
 * 部分服务暂不支持
 * - 中国香港
 * - 中国澳门
 * - 中国台湾
 */
const defaultIgnore = ['71', '81', '82']

const makeOption = (
  text: string,
  value: string,
  children?: Option[]
): Option => ({
  text,
  value,
  children
})

export function useAreaData(ignore = defaultIgnore) {
  const ignoreKeys = [...ignore]
  const {
    city_list: city,
    county_list: county,
    province_list: province
  } = areaList

  const provinceMap = new Map<string, Option>()
  Object.keys(province).forEach((code) => {
    const newCode = code.slice(0, 2)
    if (!ignoreKeys.includes(newCode)) {
      provinceMap.set(newCode, makeOption(province[code], code, []))
    }
  })

  const cityMap = new Map<string, Option>()
  Object.keys(city).forEach((code) => {
    const option = makeOption(city[code], code, [])
    cityMap.set(code.slice(0, 4), option)

    const province = provinceMap.get(code.slice(0, 2))
    if (province) {
      province.children!.push(option)
    }
  })

  Object.keys(county).forEach((code) => {
    const city = cityMap.get(code.slice(0, 4))
    if (city) {
      city.children!.push(makeOption(county[code], code))
    }
  })

  return Array.from(provinceMap.values())
}

export function searchAreaData(code: string) {
  const length = code.length

  if (length !== 6) {
    throw new Error('Area code must be exactly 6 characters long.')
  }

  const {
    city_list,
    county_list,
    province_list
  } = areaList

  const resultMap = {
    province: null,
    city: null,
    county: null
  } as Record<'province' | 'city' | 'county', {
    text: string
    value: string
  } | null>

  const province_code = code.slice(0, 2).padEnd(6, '0')
  const city_code = code.slice(0, 4).padEnd(6, '0')
  const county_code = code

  const province = province_list[province_code]
  const city = city_list[city_code]
  const county = county_list[county_code]

  if (province) {
    resultMap.province = {
      text: province,
      value: province_code
    }
  }

  if (city) {
    resultMap.city = {
      text: city,
      value: city_code
    }
  }

  if (county) {
    resultMap.county = {
      text: county,
      value: county_code
    }
  }

  return resultMap
}
