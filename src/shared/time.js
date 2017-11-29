import moment from 'moment'

export const formatMoment = (timeData) => {
  return moment(timeData).format('MMMM DD, YYYY (ZZ)')
}
