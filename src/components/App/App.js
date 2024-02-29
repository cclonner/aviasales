/* eslint-disable no-await-in-loop */
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { getSearchId, getTickets } from '../../services/api'
import TicketList from '../TicketList/TicketList'
import Filters from '../Filters/Filters'
import logo from '../../assets/Logo.svg'
import SortButtons from '../SortButton'

import styles from './App.module.scss'

function App() {
  const dispatch = useDispatch()
  const [errorCount, setErrorCount] = useState(0)
  const [isErrorLimitReached, setIsErrorLimitReached] = useState(false)

  const fetchData = async () => {
    const searchId = await getSearchId()

    let isStopped = false
    while (!isStopped) {
      try {
        const data = await getTickets(searchId)
        if ('tickets' in data && Array.isArray(data.tickets) && data.stop === false) {
          dispatch({ type: 'FETCH_TICKETS_SUCCESS', payload: data.tickets })
          setErrorCount(0)
        } else if (data.stop === true) {
          isStopped = true
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } catch (error) {
        setErrorCount((prevCount) => prevCount + 1)

        if (errorCount >= 4) {
          setIsErrorLimitReached(true)
          isStopped = true
        }
      }
    }
  }

  useEffect(() => {
    fetchData()
  }, [dispatch])
  return (
    <div id="Avisales" className={styles.body_app}>
      <div className={styles.logo}>
        <img src={logo} alt="Logo" className={styles.logo__plane} />
      </div>
      <div className={styles.app}>
        <Filters />
        <div className={styles.menu}>
          {isErrorLimitReached && (
            <div className={styles.error}>
              <div className={styles.error__header} />
              <div className={styles.error__column}>{'{ERROR}'}</div>
              <div className={styles.error__infoPlaceholder}>
                Произошла ошибка при загрузке билетов.
                <br />
                Попробуйте изменить параметры поиска или повторить позже.
              </div>
            </div>
          )}
          <SortButtons />
          <TicketList />
        </div>
      </div>
    </div>
  )
}

export default App
