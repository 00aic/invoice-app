type DateFormatOptions = {
  locale?: string
  prefix?: string
}

export const formatDate = (dateString: string | Date, options: DateFormatOptions = {}) => {
  const { locale = 'en-GB', prefix = 'Due' } = options

  const date = typeof dateString === 'string' ? new Date(dateString) : dateString

  if (isNaN(date.getTime())) {
    return `${prefix} Invalid Date`
  }

  const formatter = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  return `${prefix} ${formatter.format(date)}`
}
