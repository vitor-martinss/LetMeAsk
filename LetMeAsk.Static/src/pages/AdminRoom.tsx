
import { useHistory, useParams } from 'react-router'
import { Button } from '../components/Button'
import { Question } from '../components/Question'
import { RoomCode } from '../components/RoomCode'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

import '../styles/room.scss'
import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'

type RoomParams = {
	id: string;
}

export function AdminRoom() {
	const history = useHistory()
	const params = useParams<RoomParams>()
	const roomId = params.id
	const {title, questions} = useRoom(roomId)

	async function handleEndRoom() {
		database.ref(`rooms/${roomId}`).update({
			endedAt: new Date()
		})

		history.push('/')
	}

	async function handleDeleteQuestion(questionId: string) {
		if(window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
			await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
		}
	}

	async function handleCheckQuestionAsAnswered(questionId: string) {
		await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
			isAnswered: true
		})
	}

	async function handleHighlightQuestion(questionId: string) {
		await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
			isHighlighted: true
		})
	}

	return ( 
		<div className="page-room page-room--admin">
			<header>
				<div className='content'>
					<img src={logoImg} alt="Let me ask" />
					<div>
						<RoomCode code={roomId}/>
						<Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
					</div>
				</div>
			</header>

			<main className="page-room-wrapper">
				<div className='room-title'>
					<h1>Sala <span className='room-title-main'>{title}</span> </h1>
					{questions.length > 0 && <span className='room-title-number'>{questions.length} pergunta(s)</span>}
					
				</div>
				
				<div className="question-list">
					{questions.map(question => {
						return (
							<Question
								key={question.id} 
								content={question.content}
								author={question.author}
								isAnswered={question.isAnswered}
								isHighlighted={question.isHighlighted}
							>
								{
									!question.isAnswered && (
										<>
											<button
												type='button'
												onClick={() => handleCheckQuestionAsAnswered(question.id)}
											>
												<img src={checkImg} alt="Check Pergunta" />
											</button>

											<button
												type='button'
												onClick={() => handleHighlightQuestion(question.id)}
											>
												<img src={answerImg} alt="Answer Pergunta" />
											</button>
										</>
									)
								}
								<button
									type='button'
									onClick={() => handleDeleteQuestion(question.id)}
								>
									<img src={deleteImg} alt="Remover Pergunta" />
								</button>
							</Question>
						)
					})}
					
				</div>
				
			</main>
		</div>
	)
}