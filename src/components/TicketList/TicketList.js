/* eslint-disable react/no-array-index-key */
import { useState } from 'react'
import { useSelector } from 'react-redux'

import styles from './TicketList.module.scss'

function Loader() {
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
        {ticket.segments.map((segment, id) => (
          <TicketSegment key={id} segment={segment} />
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

  const sortedTickets = [...tickets].sort((a, b) => {
    if (sorting.byPrice) {
      return a.price - b.price
    }
    if (sorting.byDuration) {
      const getTotalDuration = (ticket) => ticket.segments.reduce((acc, seg) => acc + seg.duration, 0)
      return getTotalDuration(a) - getTotalDuration(b)
    }
    if (sorting.byOptimal) {
      const getTotalDuration = (ticket) => ticket.segments.reduce((acc, seg) => acc + seg.duration, 0)
      const getOptimalScore = (ticket) => ticket.price + getTotalDuration(ticket) * 0.5
      return getOptimalScore(a) - getOptimalScore(b)
    }
    return (
      <div
        className={styles.ticket}
        style={{ height: '100px', borderStyle: 'dotted', borderColor: 'orange', textAlign: 'center' }}
      >
        <div>Рейсов, подходящих под заданные фильтры, не найдено</div>
      </div>
    )
  })
  const filteredTickets = sortedTickets.filter((ticket) => {
    if (filters.all) return true
    if (filters.nonStop && ticket.segments.every((segment) => segment.stops.length === 0)) return true
    if (filters.oneStop && ticket.segments.every((segment) => segment.stops.length === 1)) return true
    if (filters.twoStops && ticket.segments.every((segment) => segment.stops.length === 2)) return true
    if (filters.threeStops && ticket.segments.every((segment) => segment.stops.length === 3)) return true
    return false
  })
  if (filteredTickets.length === 0 && !loading) {
    return (
      <div
        className={styles.ticket}
        style={{ height: '100px', borderStyle: 'dotted', borderColor: 'orange', textAlign: 'center' }}
      >
        <div>Рейсов, подходящих под заданные фильтры, не найдено</div>
      </div>
    )
  }

  const handleClick = () => {
    setDisplayedTicketCount(displayedTicketCount + 5)
  }
  return (
    <div className={styles.ticketListContainer}>
      {loading && <Loader />}
      {filteredTickets.slice(0, displayedTicketCount).map((ticket, id) => (
        <Ticket key={id} ticket={ticket} />
      ))}
      {filteredTickets.slice(0, displayedTicketCount).length > 0 && (
        <button className={styles.button} onClick={handleClick}>
          Показать еще 5 билетов
        </button>
      )}
    </div>
  )
}

export default TicketList
