const getReservationId = (
  birth_day: string,
  phone_number: string,
  reservation_date: string,
  reservation_time: string
) => {
  const [year, month, day] = reservation_date.split('-');
  const last = phone_number.slice(7);
  const time = reservation_time.replace(':', '').slice(0, 3);
  return (
    year[2] + year[3] + month + day + last + time + birth_day[3] + birth_day[7]
  );
};

export default getReservationId;
