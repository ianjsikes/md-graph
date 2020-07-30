import * as md5 from 'md5'

export const hash = (str: string) => md5(str)
