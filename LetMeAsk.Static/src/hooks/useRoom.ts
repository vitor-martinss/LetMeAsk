import { useEffect, useState } from "react"
import { database } from '../services/firebase'


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


export function useRoom(roomId: string) {
	const [questions, setQuestions] = useState<QuestionType[]>([])
	const [title, setTitle] = useState('')

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

	return {questions, title}
}