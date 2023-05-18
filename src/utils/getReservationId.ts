const getReservationId = ({
  reservation_date,
  phone_number,
  reservation_time,
  birth_day,
}) => {
  const [year, month, day] = reservation_date.split('-');
  const last = phone_number.slice(7);
  const time = reservation_time.replace(':', '').slice(0, 4);
  return (
    year[2] + year[3] + month + day + last + time + birth_day[3] + birth_day[7]
  );
};

export default getReservationId;
