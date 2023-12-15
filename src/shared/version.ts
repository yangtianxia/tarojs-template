import { useSystemInfo } from '@/hooks/system-info'

const compareVersion = (v1: any, v2: any) => {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }

  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i], 10)
    const num2 = parseInt(v2[i], 10)

    if (num1 > num2) {
      return 1
    }

    if (num1 < num2) {
      return -1
    }
  }

  return 0
}

function gte(version: string) {
  const system = useSystemInfo()
  return compareVersion(system.SDKVersion, version) >= 0
}

export default gte
