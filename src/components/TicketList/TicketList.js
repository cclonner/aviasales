import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './TicketList.module.scss';

const SegmentInfo = ({ label, text }) => (
  <div className={styles.data}>
    <p className={styles.ticket__segmentInfo__text}>
      {label}
    </p>
    <p className={styles.ticket__segmentInfo__text}>
      {text}
    </p>
  </div>
);

const TicketSegment = ({ segment }) => {
  const departureTime = new Date(segment.date).toLocaleTimeString('ru-RU', {
    hour: 'numeric',
    minute: 'numeric',
  });
  const arrivalTime = new Date(
    new Date(segment.date).getTime() + segment.duration * 60000
  ).toLocaleTimeString('ru-RU', {
    hour: 'numeric',
    minute: 'numeric',
  });

  return (
    <div className={styles.segment}>
      <SegmentInfo label={`${segment.origin} - ${segment.destination}`} text={`${departureTime} - ${arrivalTime}`} />
      <SegmentInfo label="В пути" text={`${Math.floor(segment.duration / 60)}ч ${segment.duration % 60}мин`} />
      <SegmentInfo
        label={segment.stops.length === 0 ? 'Без пересадок' : `${segment.stops.length} пересадки`}
        text={segment.stops.join(', ')}
      />
    </div>
  );
};

const Ticket = ({ ticket }) => (
  <div className={styles.ticket}>
    <div className={styles.ticket__header}>
      <p className={styles.ticket__price}>{ticket.price} ₽</p>
      <img
        className={styles.ticket__logo}
        src={`https://pics.avs.io/99/36/${ticket.carrier}.png`}
        alt={ticket.carrier}
      />
    </div>
    <div className={styles.ticket__info}>
      {ticket.segments.map((segment, segmentIndex) => (
        <TicketSegment key={segmentIndex} segment={segment} />
      ))}
    </div>
  </div>
);

const TicketList = () => {
  const tickets = useSelector((state) => state.tickets.tickets);
  const filters = useSelector((state) => state.tickets.filters.stops);
  const [displayedTicketCount, setDisplayedTicketCount] = useState(5);

  const filteredTickets = tickets.filter((ticket) => {
    if (filters.all) return true;
    if (filters.nonStop && ticket.segments.every((segment) => segment.stops.length === 0)) return true;
    if (filters.oneStop && ticket.segments.every((segment) => segment.stops.length === 1)) return true;
    if (filters.twoStops && ticket.segments.every((segment) => segment.stops.length === 2)) return true;
    if (filters.threeStops && ticket.segments.every((segment) => segment.stops.length === 3)) return true;
    return false;
  });

  const displayedTickets = filteredTickets.slice(0, displayedTicketCount);

  const handleClick = () => {
    setDisplayedTicketCount(displayedTicketCount + 5);
  };
  return (
    <div className={styles.ticketListContainer}>
      {displayedTickets.map((ticket, index) => (
        <Ticket key={index} ticket={ticket} />
      ))}
      {filteredTickets.length && (
      <button onClick={handleClick}>
        Показать еще 5 билетов
      </button>
      
    )}
    </div>
  );
};

export default TicketList;