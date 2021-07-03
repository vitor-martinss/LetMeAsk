
import { useParams } from 'react-router'
import { Button } from '../components/Button'
import { Question } from '../components/Question'
import { RoomCode } from '../components/RoomCode'

import logoImg from '../assets/images/logo.svg'

import '../styles/room.scss'
import { FormEvent, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'
import { useEffect } from 'react'

type RoomParams = {
	id: string;
}

type QuestionType = {
	id: string;
	content: string;
	author: {
		name: string;
		avatar: string;
	},

	isHighlighted: boolean;
	isAnswered: boolean;
}

type FireBaseQuestions = Record<string, {
	content: string;
	author: {
		name: string;
		avatar: string;
	},

	isHighlighted: boolean;
	isAnswered: boolean;
}>

export function Room() {
	const { user } = useAuth()
	const params = useParams<RoomParams>()
	const [newsQuestion, setNewQuestion] = useState('')
	const [questions, setQuestions] = useState<QuestionType[]>([])
	const [title, setTitle] = useState('')
	const roomId = params.id

	useEffect(() => {
		const roomRef = database.ref(`rooms/${roomId}`)

		roomRef.on('value', room => {
			const dataBaseRoom = room.val()
			
			const fireBaseQuestions: FireBaseQuestions = dataBaseRoom.questions ?? {}

			const parsedQuestions = Object.entries(fireBaseQuestions).map(([key, value]) => {
				return {
					id: key,
					content: value.content,
					author: value.author,
					isHighlighted: value.isHighlighted,
					isAnswered: value.isAnswered,
				}
			})

			setTitle(dataBaseRoom.title)
			setQuestions(parsedQuestions)
			
		})

	}, [roomId])

	async function handleSendQuestion(event: FormEvent) {
		event.preventDefault()

		if (newsQuestion.trim() === '') {
			return
		}

		if(!user) {
			throw new Error('You must be logged in')
		}

		const question = {
			content: newsQuestion,
			author: {
				name: user.name,
				avatar: user.avatar,
			},

			isHighlighted: false,
			isAnswered: false
		}

		await database.ref(`rooms/${roomId}/questions`).push(question)
		setNewQuestion('')
	}

	return ( 
		<div id="page-room">
			<header>
				<div className='content'>
					<img src={logoImg} alt="Letmeask" />
					<RoomCode code={roomId}/>
				</div>
			</header>

			<main>
				<div className='room-title'>
					<h1>Sala {title}</h1>
					{questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
					
				</div>
				<form onSubmit={handleSendQuestion}>
					<textarea 
						placeholder='O que você quer perguntar?' 
						onChange={event => setNewQuestion(event.target.value)}
						value={newsQuestion}
					/>
					<div className='form-footer'>
						{
							user ? (
								<div className='user-info'>
									<img src={user.avatar} alt={user.name} />
									<span>{user.name}</span>
								</div>
							) : (
								<span>Para enviar uma pergunta, <button>faça seu login</button></span>
							)
						}
						
						<Button type='submit' disabled={!user}>Enviar perguntas</Button>
					</div>
				</form>
				<div className="question-list">
					{questions.map(question => {
						return (
							<Question
								key={question.id} 
								content={question.content}
								author={question.author}
							/>
						)
					})}
					
				</div>
				
			</main>
		</div>
	)
}