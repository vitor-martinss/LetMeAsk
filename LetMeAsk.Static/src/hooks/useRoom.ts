import { useEffect, useState } from "react"
import { database } from '../services/firebase'
import { useAuth } from "./useAuth"


type QuestionType = {
	id: string;
	content: string;
	author: {
		name: string;
		avatar: string;
	},

	isHighlighted: boolean;
	isAnswered: boolean;
	likeCount: number;
	likeId: string | undefined;
}


type FireBaseQuestions = Record<string, {
	content: string;
	author: {
		name: string;
		avatar: string;
	},

	isHighlighted: boolean;
	isAnswered: boolean;
	likes: Record<string, {
		authorId: string;
	}>
}>


export function useRoom(roomId: string) {
	const { user } = useAuth()
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
					likeCount: Object.values(value.likes ?? {}).length,
					likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
				}
			})

			setTitle(dataBaseRoom.title)
			setQuestions(parsedQuestions)
			
		})

		return () => {
			roomRef.off('value')
		}

	}, [roomId, user?.id])

	return {questions, title}
}