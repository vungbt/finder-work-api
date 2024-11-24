import { format } from 'date-fns';

export enum EFormatType {
  yyyyMMddHHmmss = 'yyyyMMddHHmmss',
  MMM_DD_YYYY = 'MMM DD, YYYY'
}

/**
 *
 * @param date
 * @param formatType
 * @returns
 */
export const formatDate = (date: Date | string | number, formatType?: EFormatType) => {
  const newFormat = formatType ?? EFormatType.yyyyMMddHHmmss;
  return format(date, newFormat);
};
