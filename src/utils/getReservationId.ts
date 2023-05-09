const getReservationId = ({
  reservation_date,
  phone_number,
  reservation_time,
  birth_day,
}) => {
  const [year, month, day] = reservation_date.split('-');
  const [, , last] = phone_number.split('-');
  const [hour, min] = reservation_time.split(':');
  return (
    year[2] +
    year[3] +
    month +
    day +
    last +
    hour +
    min +
    birth_day[3] +
    birth_day[7]
  );
};

export default getReservationId;
