import { useState } from 'react'
import { useSelector } from 'react-redux'

import styles from './TicketList.module.scss'

function SegmentInfo({ label, text }) {
  return (
    <div className={styles.data}>
      <div className={styles.ticket__segmentInfo__label}>{label}</div>
      <div className={styles.ticket__segmentInfo__text}>{text}</div>
    </div>
  )
}

function TicketSegment({ segment }) {
  const departureTime = new Date(segment.date).toLocaleTimeString('ru-RU', {
    hour: 'numeric',
    minute: 'numeric',
  })
  const arrivalTime = new Date(new Date(segment.date).getTime() + segment.duration * 60000).toLocaleTimeString(
    'ru-RU',
    {
      hour: 'numeric',
      minute: 'numeric',
    }
  )

  return (
    <div className={styles.segment}>
      <SegmentInfo label={`${segment.origin} - ${segment.destination}`} text={`${departureTime} - ${arrivalTime}`} />
      <SegmentInfo label="В пути" text={`${Math.floor(segment.duration / 60)}ч ${segment.duration % 60}мин`} />
      <SegmentInfo
        label={
          segment.stops.length === 0
            ? 'Без пересадок'
            : `${segment.stops.length} пересадк${segment.stops.length === 1 ? 'a' : 'и'}`
        }
        text={segment.stops.join(', ')}
      />
    </div>
  )
}

function Ticket({ ticket }) {
  return (
    <div className={styles.ticket}>
      <div className={styles.ticket__header}>
        <div className={styles.ticket__price}>{parseInt(ticket.price, 10).toLocaleString('ru-RU')} Р</div>
        <img
          className={styles.ticket__logo}
          src={`https://pics.avs.io/99/36/${ticket.carrier}.png`}
          alt={ticket.carrier}
        />
      </div>
      <div className={styles.ticket__info}>
        {ticket.segments.map((segment) => (
          <TicketSegment key={segment.id} segment={segment} />
        ))}
      </div>
    </div>
  )
}

function TicketList() {
  const tickets = useSelector((state) => state.tickets.tickets)
  const loading = useSelector((state) => state.tickets.loading)
  const filters = useSelector((state) => state.tickets.filters.stops)
  const sorting = useSelector((state) => state.tickets.sorting)
  const [displayedTicketCount, setDisplayedTicketCount] = useState(5)

  if (loading) {
    return (
      <div className={styles.ticket}>
        <div className={styles.ticket__header}>
          <div className={styles.ticket__pricePlaceholder} />
          <div className={styles.ticket__logoPlaceholder} />
        </div>
        <div className={styles.ticket__infoPlaceholder} />
      </div>
    )
  }

  const filteredTickets = tickets.filter((ticket) => {
    if (filters.all) return true
    if (filters.nonStop && ticket.segments.every((segment) => segment.stops.length === 0)) return true
    if (filters.oneStop && ticket.segments.every((segment) => segment.stops.length === 1)) return true
    if (filters.twoStops && ticket.segments.every((segment) => segment.stops.length === 2)) return true
    if (filters.threeStops && ticket.segments.every((segment) => segment.stops.length === 3)) return true
    return false
  })
  if (tickets.length === 0) {
    return <div className={styles.errorMessage}>Рейсов, подходящих под заданные фильтры, не найдено</div>
  }
  const sortedTickets = filteredTickets.slice(0, displayedTicketCount).sort((a, b) => {
    if (sorting.byPrice) {
      return a.price - b.price
    }
    if (sorting.byDuration) {
      return (
        a.segments.reduce((acc, seg) => acc + seg.duration, 0) - b.segments.reduce((acc, seg) => acc + seg.duration, 0)
      )
    }
    if (sorting.byOptimal) {
      const weightPrice = 0.7
      const weightDuration = 0.3

      const weightA = a.price * weightPrice + a.segments.reduce((acc, seg) => acc + seg.duration, 0) * weightDuration
      const weightB = b.price * weightPrice + b.segments.reduce((acc, seg) => acc + seg.duration, 0) * weightDuration

      return weightA - weightB
    }
    return 0
  })
  const displayedTickets = filteredTickets.slice(0, displayedTicketCount)

  const handleClick = () => {
    setDisplayedTicketCount(displayedTicketCount + 5)
  }
  return (
    <div className={styles.ticketListContainer}>
      {sortedTickets.map((ticket) => (
        <Ticket key={ticket.id} ticket={ticket} />
      ))}
      {displayedTickets.length && (
        <button className={styles.button} onClick={handleClick}>
          Показать еще 5 билетов
        </button>
      )}
    </div>
  )
}

export default TicketList
