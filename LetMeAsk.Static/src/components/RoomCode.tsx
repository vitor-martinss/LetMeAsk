import copyImg from '../assets/images/copy.svg'

import '../styles/room-code.scss'

type RoomCodeProps = {
	code: string;
}

export function RoomCode(props: RoomCodeProps) {
	function copyRoomCodeToClipboard() {
		navigator.clipboard.writeText(props.code)
	}

	return (
		<button className='room-code' onClick={copyRoomCodeToClipboard}>
			<div className='room-code-clipboard'>
				<img src={copyImg} alt="Copy room code" />
			</div>
			<div className='room-code-container'>
				<span>Código da Sala</span>
				<span>#{props.code}</span>
			</div>
			
		</button>
	)
}