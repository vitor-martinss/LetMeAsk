import { useHistory } from 'react-router-dom'
import toast from 'react-hot-toast';
import { Button } from '../components/Button'

import illustrationImg from '../assets/images/illustration.svg'
import googleIconImg from '../assets/images/google-icon.svg'
import logoImg from '../assets/images/logo.svg'

import '../styles/auth.scss'

import { useAuth } from '../hooks/useAuth'
import { FormEvent, useState } from 'react'
import { database } from '../services/firebase'

export function Home() {
	const history = useHistory()
	const {user, signInWithGoogle} = useAuth()
	const [roomCode, setRoomCode] = useState('')

	async function handleCreateRoom() {
		if (!user) {
			await signInWithGoogle()
		}

		toast.success('Parabéns, o seu login foi um sucesso!')
		history.push('/rooms/new')
	}

	async function handleJoinRoom(event: FormEvent) {
		event.preventDefault()
		if (roomCode.trim() === '') {
			toast.error('Insira o código da sala')
			return
		}

		const roomRef = await database.ref(`rooms/${roomCode}`).get()

		if (!roomRef.exists()) {
			toast.error('Esta sala não existe')
			return
		}

		if (roomRef.val().endedAt) {
			toast.error('Esta sala ja está encerrada')
			return
		}

		const roomName = roomRef.val().title

		toast.success(`Bem vindo a sala ${roomName} `)

		history.push(`/rooms/${roomCode}`)
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
					<button onClick={handleCreateRoom} className='create-room'>
						<img src={googleIconImg} alt="Google Logo" />
						Crie sua sala com o Google
					</button>
					<div className='separator'>ou entre em uma sala</div>
					<form 
						onSubmit={handleJoinRoom}
					>
						<input 
							type="text"
							placeholder='Digite o código da sala'
							onChange={event => setRoomCode(event.target.value)}
							value={roomCode}
						/>
						<Button
							type='submit'
						>
							Entrar na sala
						</Button>
					</form>
				</div>
			</main>
		</div>
	)
}