import { FormEvent } from 'react'
import toast from 'react-hot-toast';

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'

import '../styles/auth.scss'
import { Button } from '../components/Button'
import { Link, useHistory } from 'react-router-dom'
import { useState } from 'react'
import { database } from '../services/firebase'
import { useAuth } from '../hooks/useAuth'


export function NewRoom() {

	const { user } = useAuth()
	const history = useHistory()

	const [newRoom, setNewRoom] = useState('')

	async function handleCreateRoom(event: FormEvent) {
		event.preventDefault()

		if (newRoom.trim() === '') {
			toast.error('Insira o nome da sala')
			return
		}
	
		const roomRef = database.ref('rooms')

		const firebaseRoom = await roomRef.push({
			title: newRoom,
			authorId: user?.id
		})

		toast.success(`Bem vindo a sua sala ${newRoom} `)

		history.push(`/admin/rooms/${firebaseRoom.key}`)
	}


	return (
		<div id='page-auth'>
			<aside>
				<img src={illustrationImg} alt="Illustration" />
				<strong>Crie salas de Q&amp;A ao-vivo</strong>
				<p>Tire as dúvidas da sua audiência em tempo-real</p>
			</aside>
			<main>
				<div className='main-content'>
					<img src={logoImg} alt="LetMeAsk Logo" />
					<h2>Criar uma nova sala</h2>
					
					<form onSubmit={handleCreateRoom}>
						<input 
							type="text"
							placeholder='Nome da sala'
							onChange={event => setNewRoom(event.target.value)}
							value={newRoom}
						/>
						<Button
							type='submit'
						>
							Criar sala
						</Button>
					</form>
					<p>Quer entrar em uma sala existente? <Link to='/'>clique aqui</Link></p>
				</div>
			</main>
		</div>
	)
}