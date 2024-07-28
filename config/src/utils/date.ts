import { DateTime } from 'luxon';

export function isValidDateTime(dateTime: string): boolean {
  const dt = DateTime.fromFormat(dateTime, 'dd/MM/yyyy - HH:mm', { zone: 'America/Sao_Paulo' });
  return dt.isValid;
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} - ${hours}:${minutes}`;
};

export const parseDateToISO = (dateString: string): string => {
  const [dayMonthYear, time] = dateString.split(' - ');
  const [day, month, year] = dayMonthYear.split('/');
  const [hours, minutes] = time.split(':');

  const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes));

  return date.toISOString();
};