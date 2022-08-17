import { useState } from "react"
import styles from '../styles/Home.module.css'

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    
    const data = {
      email,
      password
    }
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input type="email" value={email} placeholder="E-mail" onChange={e => setEmail(e.target.value)} className={styles.fields} />
      <input type="password" value={password} placeholder="Senha" onChange={e => setPassword(e.target.value)} className={styles.fields} />
      <button type="submit">acessar</button>
    </form>
  )
}
