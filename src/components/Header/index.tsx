import { Button } from "components/Button"
import { useAuth } from "context/AuthContext"

import styles from './styles.module.scss'

export const Header = () => {
  const { user, signOut } = useAuth()

  return (
    <header className={styles.container}>
      <span>Book <br />Tracker</span>

      <div className={styles.userContainer}>
        <div>
          <p>{user?.name}</p>
          <small>{user?.email}</small>
        </div>

        <Button variant="secondary" onClick={signOut}>Logout</Button>
      </div>
    </header>
  )
}